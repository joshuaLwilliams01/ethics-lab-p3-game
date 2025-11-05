#!/bin/bash
# Script to add Stanford logo to public folder

echo "Stanford Logo Setup Script"
echo "=========================="
echo ""
echo "This script will help you add the Stanford logo to the public folder."
echo ""
echo "Please provide the path to your Stanford logo image file."
echo "Common locations:"
echo "  - ~/Downloads/stanford-logo.png"
echo "  - ~/Desktop/stanford-logo.png"
echo "  - Or any other location"
echo ""
read -p "Enter the full path to your Stanford logo file: " LOGO_PATH

if [ -z "$LOGO_PATH" ]; then
    echo "Error: No path provided."
    exit 1
fi

# Expand ~ to home directory
LOGO_PATH="${LOGO_PATH/#\~/$HOME}"

if [ ! -f "$LOGO_PATH" ]; then
    echo "Error: File not found at: $LOGO_PATH"
    echo ""
    echo "Please check the path and try again."
    exit 1
fi

# Get file extension
EXTENSION="${LOGO_PATH##*.}"

# Copy to public folder
cp "$LOGO_PATH" "public/stanford-logo.$EXTENSION"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Success! Logo copied to: public/stanford-logo.$EXTENSION"
    echo ""
    echo "The logo should now appear on the website."
    echo "If your file was not .png, you may need to update the image references in:"
    echo "  - app/layout.tsx"
    echo "  - app/page.tsx"
    echo ""
    echo "Or rename the file to stanford-logo.png"
else
    echo "Error: Failed to copy logo file."
    exit 1
fi
