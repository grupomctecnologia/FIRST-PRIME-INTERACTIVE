/* =============================================================================
 *  PRIME_ASSETS — manifesto dos assets OFICIAIS do GAME 02 (London Shopping
 *  Mission), por nome de arquivo. Packs 01–04, organizados em assets/.
 *  Chave lógica (usada no código) -> caminho do arquivo .png.
 *
 *  Modo de carga:
 *   - versão local/hospedada: carrega por URL (estes caminhos).
 *   - prévia single-file: o build injeta window.PRIME_ART_DATA (base64) e o
 *     loader prefere os data-URIs; senão, cai para estas URLs.
 * ===========================================================================*/
window.PRIME_ASSETS = {
  /* Cenários da loja (Pack 02) — 6 telas */
  bg_street:      "assets/backgrounds/g02-bg-london-street.png",
  bg_clothing:    "assets/backgrounds/g02-bg-clothing-section.png",
  bg_shoes:       "assets/backgrounds/g02-bg-shoes-section.png",
  bg_accessories: "assets/backgrounds/g02-bg-accessories-section.png",
  bg_fitting:     "assets/backgrounds/g02-bg-fitting-room.png",
  bg_checkout:    "assets/backgrounds/g02-bg-checkout-counter.png",

  /* Personagens (Pack 01) — Alex e Emma, 4 poses cada (transparentes) */
  alex_neutral:     "assets/characters/g02-alex-neutral.png",
  alex_speaking:    "assets/characters/g02-alex-speaking.png",
  alex_pointing:    "assets/characters/g02-alex-pointing.png",
  alex_celebrating: "assets/characters/g02-alex-celebrating.png",
  emma_neutral:     "assets/characters/g02-emma-neutral.png",
  emma_speaking:    "assets/characters/g02-emma-speaking.png",
  emma_pointing:    "assets/characters/g02-emma-pointing.png",
  emma_celebrating: "assets/characters/g02-emma-celebrating.png",

  /* Objetos e itens de compra (Pack 03) — 14 itens (transparentes) */
  item_backpack:       "assets/items/g02-item-backpack.png",
  item_cap:            "assets/items/g02-item-cap.png",
  item_headphones:     "assets/items/g02-item-headphones.png",
  item_jacket:         "assets/items/g02-item-jacket.png",
  item_scarf:          "assets/items/g02-item-scarf.png",
  item_shopping_bag:   "assets/items/g02-item-shopping-bag.png",
  item_sneakers_blue:  "assets/items/g02-item-sneakers-blue.png",
  item_sneakers_white: "assets/items/g02-item-sneakers-white.png",
  item_sunglasses:     "assets/items/g02-item-sunglasses.png",
  item_trousers:       "assets/items/g02-item-trousers.png",
  item_tshirt_blue:    "assets/items/g02-item-tshirt-blue.png",
  item_tshirt_white:   "assets/items/g02-item-tshirt-white.png",
  item_wallet:         "assets/items/g02-item-wallet.png",
  item_watch:          "assets/items/g02-item-watch.png",

  /* Telas e elementos de interface (Pack 04) — 12 elementos (transparentes) */
  ui_panel_mission:   "assets/interface/01-painel-principal-missao.png",
  ui_progress:        "assets/interface/02-barra-progresso.png",
  ui_button_primary:  "assets/interface/03-botao-acao-principal.png",
  ui_button_secondary:"assets/interface/04-botao-acao-secundario.png",
  ui_icon_bag:        "assets/interface/05-icone-sacola-compras.png",
  ui_slots:           "assets/interface/06-slots-inventario.png",
  ui_product_card:    "assets/interface/07-cartao-produto.png",
  ui_price_tag:       "assets/interface/08-etiqueta-preco.png",
  ui_icon_coin:       "assets/interface/09-icone-moeda.png",
  ui_panel_confirm:   "assets/interface/10-painel-confirmacao.png",
  ui_icon_check:      "assets/interface/11-icone-certo.png",
  ui_icon_back:       "assets/interface/12-icone-voltar.png"
};
