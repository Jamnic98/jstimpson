package strava

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/Jamnic98/jstimpson/server/internal/models"
)

const (
	TokenEndpoint      = "https://www.strava.com/oauth/token"
	ActivitiesEndpoint = "https://www.strava.com/api/v3/activities"

	perPage   = 200
	maxPages  = 50
)

type Client struct {
	httpClient     *http.Client
	clientID       string
	clientSecret   string
}

func NewClient(clientID, clientSecret string, timeout time.Duration) *Client {
	return &Client{
		httpClient:   &http.Client{Timeout: timeout},
		clientID:     clientID,
		clientSecret: clientSecret,
	}
}

type rawActivity struct {
	ID                 int64    `json:"id"`
	Name               string   `json:"name"`
	Distance           *float64 `json:"distance"`
	MovingTime         *int64   `json:"moving_time"`
	ElapsedTime        *int64   `json:"elapsed_time"`
	TotalElevationGain *float64 `json:"total_elevation_gain"`
	Type               string   `json:"type"`
	SportType          string   `json:"sport_type"`
	StartDate          string   `json:"start_date"`
	StartDateLocal     string   `json:"start_date_local"`
	Timezone           string   `json:"timezone"`
	UploadID           *int64   `json:"upload_id"`
	AverageSpeed       *float64 `json:"average_speed"`
	MaxSpeed           *float64 `json:"max_speed"`
	AverageHeartrate   *float64 `json:"average_heartrate"`
	MaxHeartrate       *float64 `json:"max_heartrate"`
	PRCount            *int64   `json:"pr_count"`
	SufferScore        *int64   `json:"suffer_score"`
}

func parseTime(s string) *time.Time {
	if s == "" {
		return nil
	}
	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return nil
	}
	return &t
}

func (r rawActivity) toModel() models.Activity {
	sportType := r.SportType
	if sportType == "" {
		sportType = r.Type
	}
	uploadID := ""
	if r.UploadID != nil {
		uploadID = strconv.FormatInt(*r.UploadID, 10)
	}
	return models.Activity{
		StravaID:           strconv.FormatInt(r.ID, 10),
		Name:               r.Name,
		Distance:           r.Distance,
		MovingTime:         r.MovingTime,
		ElapsedTime:        r.ElapsedTime,
		TotalElevationGain: r.TotalElevationGain,
		SportType:          sportType,
		StartDate:          parseTime(r.StartDate),
		StartDateLocal:     parseTime(r.StartDateLocal),
		Timezone:           r.Timezone,
		UploadID:           uploadID,
		AverageSpeed:       r.AverageSpeed,
		MaxSpeed:           r.MaxSpeed,
		AverageHeartrate:   r.AverageHeartrate,
		MaxHeartrate:       r.MaxHeartrate,
		PRCount:            r.PRCount,
		SufferScore:        r.SufferScore,
	}
}

// ListActivities fetches all activities after the given unix timestamp, paginating
// through the Strava API (default page size is only 30, which silently drops data).
func (c *Client) ListActivities(ctx context.Context, accessToken string, after int64) ([]models.Activity, error) {
	var out []models.Activity
	for page := 1; page <= maxPages; page++ {
		q := url.Values{
			"after":    {strconv.FormatInt(after, 10)},
			"per_page": {strconv.Itoa(perPage)},
			"page":     {strconv.Itoa(page)},
		}
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, ActivitiesEndpoint+"?"+q.Encode(), nil)
		if err != nil {
			return nil, err
		}
		req.Header.Set("Authorization", "Bearer "+accessToken)

		resp, err := c.httpClient.Do(req)
		if err != nil {
			return nil, fmt.Errorf("strava activities request failed: %w", err)
		}
		body, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			return nil, err
		}
		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("strava activities returned status %d: %s", resp.StatusCode, string(body))
		}

		var raw []rawActivity
		if err := json.Unmarshal(body, &raw); err != nil {
			return nil, fmt.Errorf("failed to decode strava activities payload: %w", err)
		}
		if len(raw) == 0 {
			break
		}
		for _, r := range raw {
			out = append(out, r.toModel())
		}
		if len(raw) < perPage {
			break
		}
	}
	return out, nil
}

type tokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    int64  `json:"expires_at"`
	ExpiresIn    int64  `json:"expires_in"`
	Message      string `json:"message"`
	Errors       []any  `json:"errors"`
}

// RefreshToken exchanges a refresh token for a new access token.
func (c *Client) RefreshToken(ctx context.Context, refreshToken string) (*models.StravaToken, error) {
	form := url.Values{
		"client_id":     {c.clientID},
		"client_secret": {c.clientSecret},
		"grant_type":    {"refresh_token"},
		"refresh_token": {refreshToken},
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, TokenEndpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Body = io.NopCloser(strings.NewReader(form.Encode()))
	req.ContentLength = int64(len(form.Encode()))

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("strava token request failed: %w", err)
	}
	body, err := io.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("strava token refresh returned status %d: %s", resp.StatusCode, string(body))
	}

	var tr tokenResponse
	if err := json.Unmarshal(body, &tr); err != nil {
		return nil, fmt.Errorf("failed to decode strava token payload: %w", err)
	}
	if len(tr.Errors) > 0 || tr.AccessToken == "" {
		return nil, fmt.Errorf("strava token refresh failed: %s", tr.Message)
	}
	return &models.StravaToken{
		ID:           models.DefaultStravaTokenID,
		AccessToken:  tr.AccessToken,
		RefreshToken: tr.RefreshToken,
		ExpiresAt:    tr.ExpiresAt,
		ExpiresIn:    tr.ExpiresIn,
	}, nil
}
