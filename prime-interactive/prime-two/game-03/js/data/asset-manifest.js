/* =============================================================================
 *  PRIME_ASSETS — official asset manifest for GAME 03 (London Underground
 *  Mystery). Packs 01–04, organised under assets/. Logical key (used in code)
 *  -> .png file path. All 43 official assets are referenced here.
 *
 *  Loading modes:
 *   - local / hosted build: loads by URL (these paths).
 *   - single-file preview: the build injects window.PRIME_ART_DATA (base64)
 *     and the loader prefers the data-URIs; otherwise it falls back to URLs.
 * ===========================================================================*/
window.PRIME_ASSETS = {
  /* ---- Backgrounds (Pack 02) — 7 Underground scenes ---------------------- */
  bg_station_entrance:     "assets/backgrounds/g03-bg-station-entrance.png",
  bg_ticket_hall:          "assets/backgrounds/g03-bg-ticket-hall.png",
  bg_escalator_corridor:   "assets/backgrounds/g03-bg-escalator-corridor.png",
  bg_underground_platform: "assets/backgrounds/g03-bg-underground-platform.png",
  bg_train_interior:       "assets/backgrounds/g03-bg-train-interior.png",
  bg_route_puzzle_room:    "assets/backgrounds/g03-bg-route-puzzle-room.png",
  bg_final_destination:    "assets/backgrounds/g03-bg-final-destination.png",

  /* ---- Characters (Pack 01) — Alex & Emma, 4 poses each (transparent) ---- */
  alex_mission_ready:   "assets/characters/g03-alex-mission-ready.png",
  alex_listening:       "assets/characters/g03-alex-listening.png",
  alex_puzzle_thinking: "assets/characters/g03-alex-puzzle-thinking.png",
  alex_celebrating:     "assets/characters/g03-alex-celebrating.png",
  emma_mission_ready:   "assets/characters/g03-emma-mission-ready.png",
  emma_listening:       "assets/characters/g03-emma-listening.png",
  emma_puzzle_thinking: "assets/characters/g03-emma-puzzle-thinking.png",
  emma_celebrating:     "assets/characters/g03-emma-celebrating.png",

  /* ---- Objects & items (Pack 03) — 14 items (transparent) --------------- */
  item_arrow_left:         "assets/items/g03-item-arrow-left.png",
  item_arrow_right:        "assets/items/g03-item-arrow-right.png",
  item_arrow_straight:     "assets/items/g03-item-arrow-straight.png",
  item_double_decker_bus:  "assets/items/g03-item-double-decker-bus.png",
  item_escalator:          "assets/items/g03-item-escalator.png",
  item_exit_door:          "assets/items/g03-item-exit-door.png",
  item_london_taxi:        "assets/items/g03-item-london-taxi.png",
  item_platform:           "assets/items/g03-item-platform.png",
  item_route_map:          "assets/items/g03-item-route-map.png",
  item_station_entrance:   "assets/items/g03-item-station-entrance.png",
  item_stopwatch:          "assets/items/g03-item-stopwatch.png",
  item_ticket:             "assets/items/g03-item-ticket.png",
  item_travel_card:        "assets/items/g03-item-travel-card.png",
  item_underground_train:  "assets/items/g03-item-underground-train.png",

  /* ---- Interface (Pack 04) — 14 UI elements (transparent) --------------- */
  ui_correct_icon:            "assets/interface/g03-ui-correct-icon.png",
  ui_letter_tile:             "assets/interface/g03-ui-letter-tile.png",
  ui_main_mission_panel:      "assets/interface/g03-ui-main-mission-panel.png",
  ui_memory_card_back:        "assets/interface/g03-ui-memory-card-back.png",
  ui_memory_card_front:       "assets/interface/g03-ui-memory-card-front.png",
  ui_primary_button:          "assets/interface/g03-ui-primary-button.png",
  ui_progress_bar:            "assets/interface/g03-ui-progress-bar.png",
  ui_retry_icon:              "assets/interface/g03-ui-retry-icon.png",
  ui_route_choice_panel:      "assets/interface/g03-ui-route-choice-panel.png",
  ui_sentence_assembly_panel: "assets/interface/g03-ui-sentence-assembly-panel.png",
  ui_sentence_block:          "assets/interface/g03-ui-sentence-block.png",
  ui_three_stars_frame:       "assets/interface/g03-ui-three-stars-frame.png",
  ui_timer_frame:             "assets/interface/g03-ui-timer-frame.png",
  ui_word_assembly_slots:     "assets/interface/g03-ui-word-assembly-slots.png"
};
