package api

import "testing"

func TestParseAfter(t *testing.T) {
	if got, err := parseAfter(""); err != nil || got != nil {
		t.Fatalf("empty after should be nil, got %v, %v", got, err)
	}
	if _, err := parseAfter("-5"); err == nil {
		t.Fatal("negative after should be an error")
	}
	if _, err := parseAfter("abc"); err == nil {
		t.Fatal("non-numeric after should be an error")
	}
	got, err := parseAfter("1767000000000")
	if err != nil || got == nil || got.UnixMilli() != 1767000000000 {
		t.Fatalf("unexpected parse result: %v, %v", got, err)
	}
}
