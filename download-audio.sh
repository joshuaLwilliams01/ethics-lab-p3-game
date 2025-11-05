#!/bin/bash
# Script to download the spy-detective audio from Pixabay

echo "🎵 Downloading Spy-Detective Audio from Pixabay"
echo "================================================"
echo ""

TARGET_DIR="/Users/cristenwilliams/ethics-lab-p3/public"
TARGET_FILE="$TARGET_DIR/spy-detective-background-suspenseful-investigation-full-412906.mp3"

# Create public directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Pixabay CDN URL pattern (ID: 412906)
# Try different date formats - Pixabay uses YYYY/MM/DD format
PIXABAY_CDN="https://cdn.pixabay.com/download/audio/2025/10/01/audio_412906.mp3?filename=spy-detective-background-suspenseful-investigation-full-412906.mp3"

# If URL provided as argument, use it; otherwise try CDN
PIXABAY_URL="${1:-$PIXABAY_CDN}"

echo "📥 Attempting to download from Pixabay..."
echo "URL: $PIXABAY_URL"
echo ""

# Try to download using curl
curl -L -o "$TARGET_FILE" "$PIXABAY_URL" 2>&1

if [ $? -eq 0 ] && [ -f "$TARGET_FILE" ] && [ -s "$TARGET_FILE" ]; then
  echo "✅ Success! File downloaded to:"
  echo "   $TARGET_FILE"
  echo ""
  echo "📊 File info:"
  ls -lh "$TARGET_FILE"
  echo ""
  echo "🎉 Done! The audio file is ready to use."
else
  echo "⚠️  Direct download failed or URL is not accessible."
  echo ""
  echo "Please follow these steps:"
  echo "1. Visit: https://pixabay.com/music/cartoons-spy-detective-background-suspenseful-investigation-full-412906/"
  echo "2. Click the 'Download' button"
  echo "3. Right-click the download button and select 'Copy Link'"
  echo "4. Run this script with the URL:"
  echo "   ./download-audio.sh [paste-the-download-url-here]"
  echo ""
  echo "Or manually download and place the file at:"
  echo "   $TARGET_FILE"
fi

