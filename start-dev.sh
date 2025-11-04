#!/usr/bin/env bash
# Start the Next.js dev server with nvm
# Make sure you run this from the project directory

cd "$(dirname "$0")" || exit 1

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Use default node version (or specify one)
nvm use default

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Verify we're in the right place
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Make sure you're in the project directory."
  exit 1
fi

# Start the dev server
echo "Starting Next.js dev server..."
echo "Open http://localhost:3000 in your browser"
echo "Press Ctrl+C to stop the server"
npm run dev
