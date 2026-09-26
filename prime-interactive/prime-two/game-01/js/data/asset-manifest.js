/* =============================================================================
 *  PRIME_ASSETS — manifesto dos assets OFICIAIS (packs 01–04) por nome de arquivo.
 *  O jogo carrega SEMPRE por estes caminhos (dentro de assets/v1/), nunca da pasta
 *  de referências. Chave lógica (usada no código) -> caminho do arquivo .webp.
 *
 *  Modo de carga:
 *   - versão local/hospedada: carrega por URL (estes caminhos).
 *   - prévia single-file: build injeta window.PRIME_ART_DATA (base64) e o loader
 *     prefere os data-URIs; senão, cai para estas URLs.
 * ===========================================================================*/
window.PRIME_ASSETS = {
  /* Fundos de Londres (Pack 02) */
  bg_wide:   "assets/v1/02-backgrounds/bg-wide-london.webp",
  bg_bigben: "assets/v1/02-backgrounds/bg-bigben.webp",
  bg_tower:  "assets/v1/02-backgrounds/bg-tower-bridge.webp",
  bg_metro:  "assets/v1/02-backgrounds/bg-metro.webp",
  bg_bus:    "assets/v1/02-backgrounds/bg-bus-street.webp",
  bg_cafe:   "assets/v1/02-backgrounds/bg-cafe.webp",
  bg_park:   "assets/v1/02-backgrounds/bg-park.webp",
  bg_dusk:   "assets/v1/02-backgrounds/bg-dusk-street.webp",

  /* Personagens (Pack 01) — chaves lógicas reutilizadas pelas cenas */
  char_boy:        "assets/v1/01-characters/alex-fullbody-neutral.webp",
  char_boy_point:  "assets/v1/01-characters/alex-fullbody-pointing.webp",
  char_boy_speak:  "assets/v1/01-characters/alex-halfbody-speaking.webp",
  char_boy_listen: "assets/v1/01-characters/alex-listening.webp",
  char_girl:       "assets/v1/01-characters/emma-fullbody-neutral.webp",
  char_girl_brief: "assets/v1/01-characters/emma-fullbody-tablet.webp",
  char_girl_speak: "assets/v1/01-characters/emma-halfbody-speaking.webp",
  char_girl_head:  "assets/v1/01-characters/emma-listening.webp",

  /* Objetos (Pack 03) */
  item_suitcase:   "assets/v1/03-items/item-suitcase-blue.webp",
  item_ticket:     "assets/v1/03-items/item-ticket.webp",
  item_map:        "assets/v1/03-items/item-map-london.webp",
  item_passport:   "assets/v1/03-items/item-passport.webp",
  item_camera:     "assets/v1/03-items/item-camera.webp",
  item_headphones: "assets/v1/03-items/item-headphones.webp",
  item_red_bus:    "assets/v1/03-items/item-red-bus.webp",
  item_black_cab:  "assets/v1/03-items/item-black-cab.webp",
  item_phone_box:  "assets/v1/03-items/item-phone-box.webp",
  item_big_ben:    "assets/v1/03-items/item-big-ben.webp",
  item_airplane:   "assets/v1/03-items/item-airplane.webp",
  item_museum:     "assets/v1/03-items/item-museum.webp",
  item_coffee:     "assets/v1/03-items/item-coffee.webp",
  item_signpost:   "assets/v1/03-items/item-signpost.webp",

  /* Interface premium (Pack 04) */
  ui_answer_default:  "assets/v1/04-ui/ui-answer-default.webp",
  ui_answer_selected: "assets/v1/04-ui/ui-answer-selected.webp",
  ui_answer_correct:  "assets/v1/04-ui/ui-answer-correct.webp",
  ui_answer_wrong:    "assets/v1/04-ui/ui-answer-wrong.webp",
  ui_button_primary:  "assets/v1/04-ui/ui-button-primary.webp",
  ui_button_secondary:"assets/v1/04-ui/ui-button-secondary.webp",
  ui_panel_hud:       "assets/v1/04-ui/ui-panel-hud.webp",
  ui_panel_dialogue:  "assets/v1/04-ui/ui-panel-dialogue.webp",
  ui_progress_track:  "assets/v1/04-ui/ui-progress-track.webp",
  ui_progress_fill:   "assets/v1/04-ui/ui-progress-fill.webp",
  ui_icon_play:       "assets/v1/04-ui/ui-icon-play.webp",
  ui_icon_heart:      "assets/v1/04-ui/ui-icon-heart.webp",
  ui_icon_star:       "assets/v1/04-ui/ui-icon-star.webp",
  ui_icon_volume:     "assets/v1/04-ui/ui-icon-volume.webp",
  ui_icon_mute:       "assets/v1/04-ui/ui-icon-mute.webp",
  ui_icon_pause:      "assets/v1/04-ui/ui-icon-pause.webp",
  ui_icon_repeat:     "assets/v1/04-ui/ui-icon-repeat.webp",
  ui_icon_settings:   "assets/v1/04-ui/ui-icon-settings.webp",
  ui_icon_fullscreen: "assets/v1/04-ui/ui-icon-fullscreen.webp",
  ui_icon_confirm:    "assets/v1/04-ui/ui-icon-confirm.webp"
};
