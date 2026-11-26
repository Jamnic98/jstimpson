import asyncio

from app.core.controllers.activity_controllers import add_new_activities_to_db
from app.utils.logger import logger


def handler(_event, _context):
    try:
        activities = asyncio.run(add_new_activities_to_db())
    except Exception as e:
        logger.exception("Failed to upload activities: %s", e)
        return {
            "statusCode": 500,
            "body": f"Failed to upload activities: {e}"
        }

    return {
        "statusCode": 200,
        "body": f"Uploaded {len(activities)} activities"
    }
