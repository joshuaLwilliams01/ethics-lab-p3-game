# Audio Setup Instructions

## Background Music

The application uses a spy/detective-themed background music from Pixabay.

### Download the Audio File

1. Visit: https://pixabay.com/music/cartoons-spy-detective-background-suspenseful-investigation-full-412906/
2. Click the download button to download the audio file
3. Save the file as `spy-detective-background-suspenseful-investigation-full-412906.mp3` in the `/public` folder
4. The file should be located at: `/public/spy-detective-background-suspenseful-investigation-full-412906.mp3`

### File Format

- **Format**: MP3
- **Location**: `/public/spy-detective-background-suspenseful-investigation-full-412906.mp3`
- **Usage**: Loops continuously when sound is enabled

### Fallback

If the audio file is not found or fails to load, the application will automatically use a simple ambient background tone generated via Web Audio API.

## Sound Effects

Button click sounds are generated to match the spy/detective theme:
- Lower frequency tones (800Hz, 600Hz→400Hz)
- Mystery/suspense elements
- Detective-style thud (150Hz)

All sound effects respect the user's sound toggle preference.

