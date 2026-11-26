BIN_DIR := bin
LDFLAGS := -s -w

.PHONY: build build-local test vet clean

# Cross-compile static binaries for Lambda (provided.al2023, arm64).
# Run before `sam build`/`sam deploy`; each function package needs a
# `bootstrap` executable in its CodeUri directory.
build:
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="$(LDFLAGS)" -o $(BIN_DIR)/api/bootstrap ./cmd/api
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="$(LDFLAGS)" -o $(BIN_DIR)/activities-updater/bootstrap ./cmd/activities-updater

build-local:
	CGO_ENABLED=0 go build -o $(BIN_DIR)/api-local ./cmd/api
	CGO_ENABLED=0 go build -o $(BIN_DIR)/updater-local ./cmd/activities-updater

test:
	go test ./...

vet:
	go vet ./...

clean:
	rm -rf $(BIN_DIR)
