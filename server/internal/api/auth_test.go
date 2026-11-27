package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func okHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
}

func TestAuthMiddleware(t *testing.T) {
	handler := authMiddleware("secret", okHandler())

	cases := []struct {
		name   string
		method string
		path   string
		key    string
		want   int
	}{
		{"health is open", http.MethodGet, "/health", "", http.StatusOK},
		{"preflight is open", http.MethodOptions, "/activities", "", http.StatusOK},
		{"protected without key", http.MethodGet, "/activities", "", http.StatusUnauthorized},
		{"protected with wrong key", http.MethodGet, "/activities", "wrong", http.StatusUnauthorized},
		{"protected with key", http.MethodGet, "/activities", "secret", http.StatusOK},
		{"write without key", http.MethodPost, "/checkins", "", http.StatusUnauthorized},
		{"write with key", http.MethodPost, "/checkins", "secret", http.StatusOK},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(tc.method, tc.path, nil)
			if tc.key != "" {
				req.Header.Set("X-Api-Key", tc.key)
			}
			rec := httptest.NewRecorder()
			handler.ServeHTTP(rec, req)
			if rec.Code != tc.want {
				t.Fatalf("got %d, want %d", rec.Code, tc.want)
			}
		})
	}
}

func TestAuthMiddlewareEmptyKeyDisablesAuth(t *testing.T) {
	handler := authMiddleware("", okHandler())
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/activities", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 with empty key (auth disabled), got %d", rec.Code)
	}
}
