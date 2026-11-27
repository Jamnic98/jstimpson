LDFLAGS := -s -w
GO_BUILD_ENV := GOOS=linux GOARCH=arm64 CGO_ENABLED=0
ARTIFACTS_DIR ?= bin

.PHONY: build build-local test vet clean build-FastApiFunction build-DbActivitiesUpdaterFunction

# SAM CustomMakeBuilder targets: `sam build` runs `make build-<FunctionLogicalId>`
# with ARTIFACTS_DIR pointing at the per-function output directory. The target names
# must match the function logical IDs in template.yml.
build-FastApiFunction:
	$(GO_BUILD_ENV) go build -ldflags="$(LDFLAGS)" -o $(ARTIFACTS_DIR)/bootstrap ./cmd/api

build-DbActivitiesUpdaterFunction:
	$(GO_BUILD_ENV) go build -ldflags="$(LDFLAGS)" -o $(ARTIFACTS_DIR)/bootstrap ./cmd/activities-updater

# Local convenience: prebuilt static binaries under bin/ (manual packaging, local runs)
build:
	$(GO_BUILD_ENV) go build -ldflags="$(LDFLAGS)" -o bin/api/bootstrap ./cmd/api
	$(GO_BUILD_ENV) go build -ldflags="$(LDFLAGS)" -o bin/activities-updater/bootstrap ./cmd/activities-updater

build-local:
	CGO_ENABLED=0 go build -o bin/api-local ./cmd/api
	CGO_ENABLED=0 go build -o bin/updater-local ./cmd/activities-updater

test:
	go test ./...

vet:
	go vet ./...

clean:
	rm -rf bin .aws-sam
