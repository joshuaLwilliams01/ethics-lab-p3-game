#!/bin/bash
# Script to help move the audio file to the public folder

echo "🎵 Audio File Mover"
echo "==================="
echo ""
echo "This script will help you move the spy-detective audio file to the public folder."
echo ""

# Try to find the file in common locations
SEARCH_PATHS=(
  "$HOME/Downloads"
  "$HOME/Desktop"
  "$HOME/Downloads/spy-detective-background-suspenseful-investigation-full-412906.mp3"
  "$HOME/Desktop/spy-detective-background-suspenseful-investigation-full-412906.mp3"
)

FOUND_FILE=""

for path in "${SEARCH_PATHS[@]}"; do
  if [ -f "$path" ]; then
    FOUND_FILE="$path"
    echo "✅ Found file: $FOUND_FILE"
    break
  fi
done

if [ -z "$FOUND_FILE" ]; then
  echo "⚠️  Could not automatically find the file."
  echo ""
  echo "Please provide the full path to your downloaded file."
  echo "Example: /Users/cristenwilliams/Downloads/spy-detective-background-suspenseful-investigation-full-412906.mp3"
  echo ""
  read -p "Enter file path: " FOUND_FILE
fi

if [ ! -f "$FOUND_FILE" ]; then
  echo "❌ File not found: $FOUND_FILE"
  exit 1
fi

TARGET_DIR="/Users/cristenwilliams/ethics-lab-p3/public"
TARGET_FILE="$TARGET_DIR/spy-detective-background-suspenseful-investigation-full-412906.mp3"

# Create public directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy the file
echo "📋 Copying file..."
cp "$FOUND_FILE" "$TARGET_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Success! File copied to:"
  echo "   $TARGET_FILE"
  echo ""
  echo "📊 File size:"
  ls -lh "$TARGET_FILE"
  echo ""
  echo "🎉 Done! The audio file is now in the correct location."
else
  echo "❌ Failed to copy file. Please check permissions."
  exit 1
fi

