from typing import List, Dict, Any
from datetime import datetime, timedelta

import httpx
from pydantic import ValidationError

from app.core.models.activity_model import ActivityCollection, ActivityModel
from app.core.models.strava_token_model import StravaTokenModel
from app.factories.database import strava_tokens_collection, activities_collection
from app.utils.constants import DEFAULT_STRAVA_TOKEN_ID, STRAVA_ACTIVITIES_API_ENDPOINT, REQUEST_TIMEOUT
from app.utils import safe_str
from app.utils.logger import logger


async def fetch_strava_activities_data(after: int = 0) -> List[Dict[str, Any]]:
    """
    Fetches activities from Strava API after a given unix timestamp

    :param after: Unix timestamp of a past date
    :return: List of raw Strava activity dictionaries
    """
    logger.info("Fetching activities from Strava API")
    try:
        # Fetch token from db
        token_data = await strava_tokens_collection.find_one({"_id": DEFAULT_STRAVA_TOKEN_ID})
        if not token_data:
            raise ValueError(f"No token with id = {DEFAULT_STRAVA_TOKEN_ID}")

        strava_token = StravaTokenModel.model_validate(token_data)
        if not strava_token.is_token_valid():
            await strava_token.refresh()

        # Non-blocking async HTTP request
        async with httpx.AsyncClient() as client:
            response = await client.get(
                STRAVA_ACTIVITIES_API_ENDPOINT,
                headers={"Authorization": f"Bearer {strava_token.access_token}"},
                params={"after": after},
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            strava_activities = response.json()

        if not isinstance(strava_activities, list):
            raise ValueError(f"Strava API returned unexpected payload: {strava_activities}")

        logger.info("Fetched %d activities", len(strava_activities))
        return strava_activities

    except httpx.HTTPStatusError as e:
        logger.error("Strava API returned HTTP error status %s: %s", e.response.status_code, e.response.text)
        raise RuntimeError("Strava API request failed") from e

    except httpx.RequestError as e:
        logger.error("Network error while connecting to Strava API: %s", e)
        raise RuntimeError("Network error connecting to Strava") from e

    except ValidationError as e:
        logger.error("Token data failed validation: %s", e)
        raise RuntimeError("Invalid token data format") from e

    except ValueError as e:
        logger.error("Token error: %s", e)
        raise RuntimeError("Missing or invalid Strava token") from e


async def add_new_activities_to_db() -> List[ActivityModel]:
    logger.info("Attempting to add new activities to DB")
    try:
        # Get a date from a two days ago
        current_date = datetime.now()
        date_in_past = current_date - timedelta(hours=48)

        # Fetch recent activities from DB using past date
        query = {"start_date_local": {"$gte": date_in_past}}
        db_activity_data = await activities_collection.find(query).to_list(length=None)
        db_activity_dates = {db_activity["start_date_local"] for db_activity in db_activity_data}

        # Fetch recent activities from Strava's API
        strava_activities_data = await fetch_strava_activities_data(int(date_in_past.timestamp()))

        # Filter out existing activities
        filtered_strava_activities = []
        for activity in strava_activities_data:
            date_str = activity.get("start_date_local")
            if not date_str:
                continue
            parsed_date = datetime.fromisoformat(date_str.replace("Z", "+00:00")).replace(tzinfo=None)
            if parsed_date not in db_activity_dates:
                filtered_strava_activities.append(activity)

        if not filtered_strava_activities:
            logger.info("No new activities to upload")
            return []

        # Prepare records for Pydantic validation
        activity_data = []
        for strava_activity in filtered_strava_activities:
            raw_local_date = strava_activity.get("start_date_local", "")
            raw_start_date = strava_activity.get("start_date", "")

            start_date_local_dt = datetime.fromisoformat(raw_local_date.replace("Z", "+00:00")).replace(tzinfo=None)
            start_date_dt = datetime.fromisoformat(raw_start_date.replace("Z", "+00:00")).replace(tzinfo=None)

            activity_data.append({
                "strava_id": safe_str(strava_activity.get("id")),
                "name": strava_activity.get("name"),
                "distance": strava_activity.get("distance"),
                "moving_time": strava_activity.get("moving_time"),
                "elapsed_time": strava_activity.get("elapsed_time"),
                "total_elevation_gain": strava_activity.get("total_elevation_gain"),
                "sport_type": strava_activity.get("sport_type"),
                "start_date": start_date_dt,
                "start_date_local": start_date_local_dt,
                "timezone": strava_activity.get("timezone"),
                "upload_id": safe_str(strava_activity.get("upload_id")),
                "average_speed": strava_activity.get("average_speed"),
                "max_speed": strava_activity.get("max_speed"),
                "average_heartrate": strava_activity.get("average_heartrate"),
                "max_heartrate": strava_activity.get("max_heartrate"),
                "pr_count": strava_activity.get("pr_count"),
                "suffer_score": strava_activity.get("suffer_score"),
            })

        # 1. Validate list into Pydantic models (returns List[ActivityModel])
        activities_collection_data = ActivityCollection.model_validate({"activities": activity_data})
        pydantic_activities: List[ActivityModel] = activities_collection_data.activities

        # 2. Convert models to dicts specifically for MongoDB insertion
        activities_dicts = [activity.model_dump() for activity in pydantic_activities]

        # 3. Insert into DB
        await activities_collection.insert_many(activities_dicts)

        logger.info("Successfully inserted %d new activities to DB", len(pydantic_activities))

        # 4. Return the List[ActivityModel] as promised by the type hint
        return pydantic_activities

    except (RuntimeError, TypeError, ValidationError, ValueError) as e:
        logger.error("Failed to insert new activities to DB: %s", e)
        raise RuntimeError from e