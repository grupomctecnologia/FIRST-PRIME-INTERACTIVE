# GAME 03 — London Underground Mystery · How to run

Static site (Phaser 3, vanilla JS). No build step.

## Run the game on its own

From `prime-interactive/prime-two/`:

```bash
python3 -m http.server 8099
# then open:  http://localhost:8099/game-03/index.html
```

(Any static server works. Opening `index.html` via `file://` will not load the
PNG assets because of browser security — use a local server.)

## Run inside the Mission Map (House 3 → House 4)

Open the map instead and complete House 3:

```
http://localhost:8099/map/index.html
```

- House 3 unlocks after Houses 1 and 2 are completed.
- ADM / Test mode: `http://localhost:8099/map/index.html?adm=1` — open House 3
  directly and simulate its completion **without** changing real student
  progress.

## Landscape

The game is designed for **landscape**. On a portrait phone a "rotate your
device" hint is shown until the device is rotated.

## Languages

Choose **English** or **Español** on the first screen. British English is the
learning target in both; Spanish localises the instructions and interface.
