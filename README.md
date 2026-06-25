# Krokowoord

Krokowoord is a small Phaser platformer built with Vite. The goal is to collect the letters of the word `KROKOWOORD` in the correct order while moving through a side-scrolling level.

## Features

- Phaser 3 platformer gameplay
- Letter-collection objective with order checking
- Animated character movement and jumping
- Scrolling camera across a longer level
- On-screen right-move button for touch or mouse play
- Win state with quick restart

## Controls

- Left / Right Arrow keys or `A` / `D`: move
- Up Arrow or `W`: jump
- On-screen right button: move right
- `R`: restart after winning

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

## Project Structure

- `index.html`: game page and app shell
- `src/main.js`: entry point that starts the game
- `src/game/main.js`: Phaser configuration and bootstrapping
- `src/game/scenes/Game.js`: main game scene, movement, and letter collection logic
- `public/assets/`: character and background images
- `public/style.css`: global styling
- `vite/config.dev.mjs`: development Vite config
- `vite/config.prod.mjs`: production Vite config

## Notes

The game loads its art from the `public/assets/` folder and expects to be served through Vite so the asset paths resolve correctly.
