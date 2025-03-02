#!/bin/bash

echo "Starting Barangay Case Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run this application."
    echo "Press Enter to exit..."
    read
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm to run this application."
    echo "Press Enter to exit..."
    read
    exit 1
fi

# Navigate to the script directory
cd "$(dirname "$0")"

# Check if the app is already built
if [ ! -d "dist" ]; then
    echo "Building the application for the first time..."
    npm run build
fi

# Start the application in production mode
echo "Starting the application in production mode..."
NODE_ENV=production npx electron electron/main.cjs

# Check if the application started successfully
if [ $? -ne 0 ]; then
    echo "Failed to start the application."
    echo "Press Enter to exit..."
    read
    exit 1
fi

exit 0 