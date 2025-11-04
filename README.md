# Ethics Lab: People · Planet · Parity (ETTP Simulator)

Starter scaffold. Add scenarios in /data/levels and wire components (ToolkitCard, P3Strip, scoring). See full README template in the chat history.

## Setup

### Prerequisites
- Node.js (v18 or v20 recommended)
- npm, pnpm, or yarn

### Installation

If you have nvm installed:
```bash
# Source nvm and use Node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use default

# Install dependencies
npm install
```

Or use the helper script:
```bash
./start-dev.sh
```

### Development

Start the development server:
```bash
npm run dev
```

Or use the helper script:
```bash
./start-dev.sh
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run validate:content` - Validate all level JSON files
- `npm run typecheck` - Run TypeScript type checking
- `npm run seed` - Run seed script

### Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/lib` - Utility functions and types
- `/data/levels` - Scenario JSON files (level1.json through level6.json)
- `/scripts` - Utility scripts

### Testing Scenarios

All 30 scenarios are ready to play:
- Level 1: Moral Foundations & Complicity (5 scenarios)
- Level 2: Algorithmic Decision-Making & Fairness (5 scenarios)
- Level 3: AI, Child Safety & Burden of Responsibility (5 scenarios)
- Level 4: Political Economy & Distribution of Power (5 scenarios)
- Level 5: Data Collection, Privacy & Civil Liberties (5 scenarios)
- Level 6: Future of Work (5 scenarios)

Visit `/play/individual/1` through `/play/individual/6` to play each level.

### Troubleshooting

**"Connection refused" error:**
- Make sure the dev server is running: `npm run dev`
- Check that port 3000 is not in use by another application

**Node.js not found:**
- If using nvm, make sure it's sourced: `source ~/.nvm/nvm.sh`
- Or use the `start-dev.sh` script which handles this automatically

**Dependencies not installed:**
- Run `npm install` to install all dependencies
