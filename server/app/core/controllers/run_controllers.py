from datetime import datetime, timedelta
from typing import List
from pydantic import ValidationError

from app.core.controllers.activity_controllers import fetch_strava_activities_data
from app.core.models.run_model import RunCollection, RunModel
from app.utils.logger import logger


async def add_new_runs_to_db(runs_collection) -> List[RunModel]:
    logger.info("Attempting to add new runs to DB")
    try:
        # Get a date from a day ago
        date_in_past = datetime.now() - timedelta(days=1)

        # Fetch recent runs from DB using past date
        query = {"start_date_local": {"$gte": date_in_past}}
        db_run_data = await runs_collection.find(query).to_list(length=None)
        db_run_data_dates = [run["start_date_local"] for run in db_run_data]

        # Fetch recent runs from Strava's API using past date
        strava_activities_data = await fetch_strava_activities_data(int(date_in_past.timestamp()))

        # Filter by type 'Run' and not already in DB
        filtered_strava_runs = []
        for activity in strava_activities_data:
            if activity.get("type") != "Run":
                continue

            start_date_local_dt = datetime.strptime(
                activity["start_date_local"], "%Y-%m-%dT%H:%M:%SZ"
            )

            if start_date_local_dt not in db_run_data_dates:
                filtered_strava_runs.append({
                    "distance": activity["distance"],
                    "duration": activity["moving_time"],
                    "start_date_local": start_date_local_dt,  # store as datetime
                })

        if not filtered_strava_runs:
            logger.info("No new runs to upload")
            return []

        # Wrap list in a dict for RunCollection validation
        runs_collection_data = RunCollection.model_validate({"runs": filtered_strava_runs})

        # Convert all runs to dictionaries once
        runs_dicts = [run.model_dump() for run in runs_collection_data.runs]

        # Insert the validated and dumped runs into the database
        await runs_collection.insert_many(runs_dicts)

        logger.info("Successfully inserted new runs to DB: %s", runs_dicts)
        return runs_dicts

    except (RuntimeError, TypeError, ValidationError, ValueError) as e:
        logger.error("Failed to insert new runs to DB: %s", e)
        raise RuntimeError from e
