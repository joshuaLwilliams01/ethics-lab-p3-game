# How to Get the Direct Download URL from Pixabay

Since the CDN URL format may vary, here's how to get the actual download URL:

## Method 1: Browser Developer Tools

1. Visit: https://pixabay.com/music/cartoons-spy-detective-background-suspenseful-investigation-full-412906/
2. Open Developer Tools (F12 or Cmd+Option+I)
3. Click the "Download" button on the page
4. In the Network tab, look for the MP3 file request
5. Right-click the request → Copy → Copy URL
6. Use that URL with the download script:
   ```bash
   ./download-audio.sh [paste-url-here]
   ```

## Method 2: Right-Click Download Button

1. Visit: https://pixabay.com/music/cartoons-spy-detective-background-suspenseful-investigation-full-412906/
2. Right-click the "Download" button
3. Select "Copy Link" or "Copy Link Address"
4. Use that URL with the download script:
   ```bash
   ./download-audio.sh [paste-url-here]
   ```

## Method 3: Manual Download Then Copy

1. Visit the Pixabay page
2. Click Download
3. The file will download to your Downloads folder
4. Then run:
   ```bash
   cp ~/Downloads/spy-detective-background-suspenseful-investigation-full-412906.mp3 public/
   ```

