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

// Goal is a monthly target for an activity type (e.g. "run 100 km in 2026-11").
type Goal struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name   string             `bson:"name" json:"name"`
	Type   string             `bson:"type" json:"type"`     // sport type, e.g. "Run"; "any" matches all
	Metric string             `bson:"metric" json:"metric"` // "distance_km" | "count" | "time_hours"
	Target float64            `bson:"target" json:"target"`
	Month  string             `bson:"month" json:"month"` // "YYYY-MM"
	Active bool               `bson:"active" json:"active"`
}

var ValidGoalMetrics = map[string]bool{
	"distance_km": true,
	"count":       true,
	"time_hours":  true,
}

// Habit is a trackable routine. VerificationSource is where completion
// evidence comes from: "manual" (self-reported), or an external source
// ("strava", "github", "notion", "calendar") verified by a verifier run.
type Habit struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name               string             `bson:"name" json:"name"`
	Category           string             `bson:"category,omitempty" json:"category,omitempty"`
	Unit               string             `bson:"unit,omitempty" json:"unit,omitempty"`
	TargetPerWeek      int                `bson:"target_per_week" json:"target_per_week"`
	Schedule           []string           `bson:"schedule,omitempty" json:"schedule,omitempty"` // lowercase weekdays: mon..sun
	VerificationSource string             `bson:"verification_source" json:"verification_source"`
	SportType          string             `bson:"sport_type,omitempty" json:"sport_type,omitempty"`
	MinDistanceKm      *float64           `bson:"min_distance_km,omitempty" json:"min_distance_km,omitempty"`
	Active             bool               `bson:"active" json:"active"`
	CreatedAt          time.Time          `bson:"created_at" json:"created_at"`
}

type CheckinStatus string

const (
	CheckinDone           CheckinStatus = "done"             // verified by an external source
	CheckinDoneUnverified CheckinStatus = "done_unverified"  // self-reported only
	CheckinMissed         CheckinStatus = "missed"           // day closed, no evidence found
	CheckinSkipped        CheckinStatus = "skipped"          // not scheduled / snoozed
)

var ValidCheckinStatuses = map[string]bool{
	string(CheckinDone):           true,
	string(CheckinDoneUnverified): true,
	string(CheckinMissed):         true,
	string(CheckinSkipped):        true,
}

var ValidVerificationSources = map[string]bool{
	"manual":   true,
	"strava":   true,
	"github":   true,
	"notion":   true,
	"calendar": true,
}

var ValidWeekdays = map[string]bool{
	"mon": true, "tue": true, "wed": true, "thu": true, "fri": true, "sat": true, "sun": true,
}

// Evidence points at the external record that proves a check-in
// (Strava activity id, GitHub commit SHAs, Notion page url, ...).
type Evidence struct {
	Source string `bson:"source" json:"source"`
	ID     string `bson:"id,omitempty" json:"id,omitempty"`
	URL    string `bson:"url,omitempty" json:"url,omitempty"`
	Detail string `bson:"detail,omitempty" json:"detail,omitempty"`
}

// Checkin is one habit-day. Unique per (habit_id, date).
type Checkin struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	HabitID   primitive.ObjectID `bson:"habit_id" json:"habit_id"`
	Date      string             `bson:"date" json:"date"` // YYYY-MM-DD
	Status    CheckinStatus      `bson:"status" json:"status"`
	Verified  bool               `bson:"verified" json:"verified"`
	Source    string             `bson:"source" json:"source"` // manual | strava | github | notion | telegram
	Evidence  []Evidence         `bson:"evidence,omitempty" json:"evidence,omitempty"`
	Note      string             `bson:"note,omitempty" json:"note,omitempty"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

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
