#!/bin/sh

# Terminate the script on a first error, disallow unbound variables.
set -eu

# Main app
echo "Starting the app..."
yarn run:worker