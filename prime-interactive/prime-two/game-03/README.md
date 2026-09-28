# PRIME TWO — Game 03 · London Underground Mystery

Third game of the PRIME TWO series (First Prime Interactive), isolated in
`game-03/`. A premium, mobile-first Phaser 3 game that teaches British English
vocabulary and phrases around the London Underground. Runs standalone and
integrates with the shared Mission Map as **House 3**.

## Seven official steps

1. **Mission Briefing** — Alex & Emma introduce the mystery (narration + subtitles).
2. **Memory Match** — match each picture card with its word card.
3. **Word Builder** — tap scrambled letters in order to spell each word.
4. **Match Word and Image** — see the picture, choose the correct word.
5. **Follow the Direction** — read the instruction, choose the right arrow.
6. **Sentence Puzzle** — assemble the sentence from word blocks.
7. **Timed Final Challenge** — quick questions against the clock.

## Rules & systems

- **Languages:** English (British) and Español, chosen at start. British
  English is the learning target in both languages; Spanish localises the
  instructions, narration and interface. No Portuguese on student screens.
- **Timer & stars (time-based):** the final 1–3 star rating comes from the
  Timed Final Challenge completion time — **up to 30s = ★★★ · 31–45s = ★★ ·
  over 45s = ★**.
- **Score, coins, lives, stars:** +100 points and +10 coins per correct answer;
  3 lives.
- **Wrong answer:** loses a life, shows feedback and lets you try again — the
  correct answer is **never** revealed. 0 lives = Game Over (retry the mission).
- **Assets:** only the 43 official Game 03 assets (packs 01–04). Only *code
  patterns* were reused from Games 01 and 02; those games are untouched.

## Mission Map integration (House 3 → House 4)

- House 3 launches this game in an iframe. Completion is detected by the map via
  the `ResultScene` contract (`window.PRIME_GAME` + a `ResultScene` whose
  `gameOver === false`).
- On completion: 3 stars are shown, the game returns to the map, Alex & Emma
  **walk from House 3 to House 4**, and **House 4 is unlocked** (progress saved).
- **ADM / Test mode** (`?adm=1`) can open House 3 directly and simulate its
  completion **without** changing real student progress.

## Structure

```
game-03/
  index.html            # scene/script load order
  css/style.css
  lib/phaser.min.js
  js/
    config.js  main.js
    data/       strings.js · content.en.js · content.es.js · asset-manifest.js · brand*.js
    managers/   GameState.js · AudioManager.js · SubtitleManager.js
    ui/         theme.js · ui.js · art.js · hud.js · flow.js · brand.js · flags.js
    scenes/     _ActivityScene.js · Boot · Preload · LanguageSelect · Menu ·
                MissionBriefing · MemoryMatch · WordBuilder · MatchWordImage ·
                FollowDirection · SentencePuzzle · TimedChallenge · Result
  assets/       characters/ (8) · backgrounds/ (7) · items/ (14) · interface/ (14)
```

See `RUN.md` to run, `ASSET-INVENTORY.md` for the validated asset list, and
`docs/HOMOLOGACAO-GAME-03.md` for the test report.
