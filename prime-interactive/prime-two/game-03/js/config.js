/* =============================================================================
 *  Phaser configuration — GAME 03 (London Underground Mystery)
 *  Seven steps: Mission Briefing · Memory Match · Word Builder ·
 *  Match Word and Image · Follow the Direction · Sentence Puzzle ·
 *  Timed Final Challenge.
 * ===========================================================================*/
window.GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#0b1026",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 600,
    min: { width: 320, height: 180 },
    max: { width: 2560, height: 1200 }
  },
  dom: { createContainer: true },
  render: { antialias: true, roundPixels: false },
  scene: [
    BootScene, PreloadScene, LanguageSelectScene, MenuScene, MissionBriefingScene,
    MemoryMatchScene, WordBuilderScene, MatchWordImageScene, FollowDirectionScene,
    SentencePuzzleScene, TimedChallengeScene, ResultScene
  ]
};
