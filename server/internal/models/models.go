package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Activity struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	StravaID           string             `bson:"strava_id,omitempty" json:"strava_id"`
	Name               string             `bson:"name,omitempty" json:"name"`
	Distance           *float64           `bson:"distance,omitempty" json:"distance"`
	MovingTime         *int64             `bson:"moving_time,omitempty" json:"moving_time"`
	ElapsedTime        *int64             `bson:"elapsed_time,omitempty" json:"elapsed_time"`
	TotalElevationGain *float64           `bson:"total_elevation_gain,omitempty" json:"total_elevation_gain"`
	SportType          string             `bson:"sport_type,omitempty" json:"sport_type"`
	StartDate          *time.Time         `bson:"start_date,omitempty" json:"start_date"`
	StartDateLocal     *time.Time         `bson:"start_date_local,omitempty" json:"start_date_local"`
	Timezone           string             `bson:"timezone,omitempty" json:"timezone"`
	UploadID           string             `bson:"upload_id,omitempty" json:"upload_id"`
	AverageSpeed       *float64           `bson:"average_speed,omitempty" json:"average_speed"`
	MaxSpeed           *float64           `bson:"max_speed,omitempty" json:"max_speed"`
	AverageHeartrate   *float64           `bson:"average_heartrate,omitempty" json:"average_heartrate"`
	MaxHeartrate       *float64           `bson:"max_heartrate,omitempty" json:"max_heartrate"`
	PRCount            *int64             `bson:"pr_count,omitempty" json:"pr_count"`
	SufferScore        *int64             `bson:"suffer_score,omitempty" json:"suffer_score"`
}

type ActivityCollection struct {
	Activities []Activity `json:"activities"`
}

type Run struct {
	Distance       float64   `bson:"distance" json:"distance"`
	Duration       int64     `bson:"duration" json:"duration"`
	StartDateLocal time.Time `bson:"start_date_local" json:"start_date_local"`
}

type RunCollection struct {
	Runs []Run `json:"runs"`
}

type StravaToken struct {
	ID           string `bson:"_id" json:"id"`
	AccessToken  string `bson:"access_token" json:"access_token"`
	RefreshToken string `bson:"refresh_token" json:"refresh_token"`
	ExpiresAt    int64  `bson:"expires_at" json:"expires_at"`
	ExpiresIn    int64  `bson:"expires_in" json:"expires_in"`
}

const DefaultStravaTokenID = "0"

var ValidSportTypes = map[string]bool{
	"AlpineSki": true, "BackcountrySki": true, "Badminton": true, "Canoeing": true,
	"Crossfit": true, "EBikeRide": true, "Elliptical": true, "EMountainBikeRide": true,
	"Golf": true, "GravelRide": true, "Handcycle": true, "HighIntensityIntervalTraining": true,
	"Hike": true, "IceSkate": true, "InlineSkate": true, "Kayaking": true,
	"Kitesurf": true, "MountainBikeRide": true, "NordicSki": true, "Pickleball": true,
	"Pilates": true, "Racquetball": true, "Ride": true, "RockClimbing": true,
	"RollerSki": true, "Rowing": true, "Run": true, "Sail": true,
	"Skateboard": true, "Snowboard": true, "Snowshoe": true, "Soccer": true,
	"Squash": true, "StairStepper": true, "StandUpPaddling": true, "Surfing": true,
	"Swim": true, "TableTennis": true, "Tennis": true, "TrailRun": true,
	"Velomobile": true, "VirtualRide": true, "VirtualRow": true, "VirtualRun": true,
	"Walk": true, "WeightTraining": true, "Wheelchair": true, "Windsurf": true,
	"Workout": true, "Yoga": true,
}
