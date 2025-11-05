# Audio Setup Instructions

The background music now uses a high-quality audio file instead of programmatic generation.

## To Add Your Audio File:

1. **Find a high-quality background music file** (MP3, OGG, or WAV format)
   - Recommended: Mid-tempo, suspenseful, confident pulse (like James Bond/Mission Impossible theme)
   - Should be professional quality, similar to AISES Knowledge Bowl

2. **Copy the file to the public folder:**
   ```bash
   cp /path/to/your/audio-file.mp3 /Users/cristenwilliams/ethics-lab-p3/public/background-music.mp3
   ```

3. **Supported formats:**
   - `background-music.mp3` (MPEG audio)
   - `background-music.ogg` (OGG Vorbis)
   - `background-music.wav` (WAV format)

4. **The component will automatically:**
   - Loop the music
   - Set volume to 40% (professional level)
   - Handle autoplay restrictions
   - Start/stop based on user toggle

## If you have a file in Downloads:

If you have an audio file in `/Users/cristenwilliams/Downloads`, you can copy it:

```bash
cp /Users/cristenwilliams/Downloads/your-audio-file.mp3 /Users/cristenwilliams/ethics-lab-p3/public/background-music.mp3
```

## Testing:

After adding the file, restart your dev server and test the audio toggle button. The music should play smoothly and loop continuously.

