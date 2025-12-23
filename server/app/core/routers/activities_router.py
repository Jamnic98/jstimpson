from http import HTTPStatus
from datetime import datetime
from typing import Optional

from fastapi import Query, HTTPException
from fastapi.routing import APIRouter
from pymongo.errors import PyMongoError

from app.core.models.activity_model import ActivityCollection
from app.factories.database import activities_collection
from app.utils.enums import SportType
from app.utils.logger import logger


router = APIRouter(prefix="/activities")


@router.get("", response_model=ActivityCollection)
async def index(
    after: int = Query(None),
    sport_type: Optional[SportType] = Query(None, alias="type")
):
    """
    Fetch activities from database

    Parameters:
        after (int): unix time stamp to filter activities after a certain date
        sport_type (SportType): optional sport type to filter (e.g., Run, Ride)

    Returns:
    ActivityCollection: A collection of activities.
    """
    logger.info("Fetching activities from database")

    if after is not None and after < 0:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Invalid timestamp: must be a positive integer"
        )

    try:
        query = {}

        if after is not None:
            query["start_date_local"] = {"$gt": datetime.fromtimestamp(after / 1000)}

        if sport_type:
            query["sport_type"] = sport_type.value

        activities = await activities_collection.find(query).to_list(length=None)
        return ActivityCollection(activities=activities).model_dump()

    except PyMongoError as e:
        logger.error("Database error occurred: %s", e)
        raise HTTPException(
            status_code=HTTPStatus.SERVICE_UNAVAILABLE,
            detail="Internal Server Error: Database operation failed"
        ) from e

    except Exception as e:
        logger.error("Unexpected error occurred: %s", e)
        raise HTTPException(
            status_code=HTTPStatus.SERVICE_UNAVAILABLE,
            detail="Internal Server Error: An unexpected error occurred"
        ) from e
