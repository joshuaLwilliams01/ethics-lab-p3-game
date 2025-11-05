# How to Add the Stanford Logo

## Option 1: Using the Script (Recommended)

Run the helper script:
```bash
./add-stanford-logo.sh
```

The script will prompt you for the path to your logo file and copy it to the public folder.

## Option 2: Manual Copy

1. **Find your Stanford logo file** (it should be a PNG, JPG, or SVG image)

2. **Copy it to the public folder:**
   ```bash
   cp /path/to/your/stanford-logo.png public/stanford-logo.png
   ```

3. **Or use Finder:**
   - Open Finder
   - Navigate to your logo file
   - Copy it
   - Navigate to: `/Users/cristenwilliams/ethics-lab-p3/public/`
   - Paste it
   - Rename it to: `stanford-logo.png`

## Option 3: Download from Official Source

If you need to download the Stanford logo:
1. Visit Stanford's brand guidelines: https://identity.stanford.edu/overview/logo/
2. Download the official logo
3. Save it as `stanford-logo.png` in the `public/` folder

## File Requirements

- **Name**: `stanford-logo.png` (or `.jpg`, `.svg`)
- **Location**: `public/stanford-logo.png`
- **Format**: PNG with transparency recommended
- **Size**: Any size (the code will scale it appropriately)

## Testing

Once the file is added:
1. Restart your dev server if it's running
2. Visit: http://localhost:3000
3. You should see the Stanford logo in:
   - Header navigation (left side)
   - Background decorative element (above title)
   - "Choose Your Level" section (on both sides)

## Fallback

If the logo file is not found, the code will automatically fall back to the tree emoji (🌲) so the site still works.
