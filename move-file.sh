#!/bin/bash
# Find and copy the spy-detective audio file

echo "Searching for the audio file in Downloads..."
cd ~/Downloads

# Try to find the file
FILE=$(ls -t | grep -i "spy\|detective\|412906\|\.mp3" | head -1)

if [ -z "$FILE" ]; then
  echo "Please enter the exact filename:"
  read FILE
fi

if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE"
  echo "Available files in Downloads:"
  ls -lt | head -10
  exit 1
fi

echo "Found: $FILE"
echo "Copying to public folder..."

cp "$FILE" /Users/cristenwilliams/ethics-lab-p3/public/spy-detective-background-suspenseful-investigation-full-412906.mp3

if [ $? -eq 0 ]; then
  echo "✅ Success! File copied."
  ls -lh /Users/cristenwilliams/ethics-lab-p3/public/spy-detective-background-suspenseful-investigation-full-412906.mp3
else
  echo "❌ Failed to copy file"
  exit 1
fi
