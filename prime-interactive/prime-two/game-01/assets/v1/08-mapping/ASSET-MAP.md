# PRIME TWO — Game 01 · ASSET MAP (v1)

Mapeamento **tela → assets individuais**. O jogo deve carregar/posicionar cada
asset por código (personagem, fundo, objeto e UI **separados** — nunca uma tela
inteira como imagem única).

**Legenda de status:**
`✅ existe` · `🟡 interim` (recorte provisório do storyboard — a SUBSTITUIR) ·
`⛔ PENDENTE` (asset oficial ainda não produzido/recebido — **não improvisar**)

---

## LANGUAGE SELECT
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-00-language-select-london-v1.webp` | ⛔ PENDENTE |
| logo | `05-brand/logo-first-prime-light.*` | 🟡 (primário recuperado; light/dark a exportar) |
| English | `06-flags/flag-us-premium-v1.webp` | ⛔ PENDENTE (há bandeira vetorial interim) |
| Español | `06-flags/flag-spain-premium-v1.webp` | ⛔ PENDENTE (há bandeira vetorial interim) |

## HOME
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-01-home-london-night-v1.webp` | ⛔ PENDENTE |
| left character | `01-characters/alex-halfbody-neutral-v1.webp` | ⛔ PENDENTE |
| right character | `01-characters/emma-halfbody-neutral-v1.webp` | ⛔ PENDENTE |
| logo | `05-brand/logo-first-prime-light.*` | 🟡 |
| CTA | `04-ui/btn-gold-play-v1.webp` | ⛔ PENDENTE (há pílula vetorial interim) |

## INTRO
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-02-airport-arrival-v1.webp` | ⛔ PENDENTE |
| character | `01-characters/alex-talking-v1.webp` | ⛔ PENDENTE |

## VOCABULARY
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-03-vocabulary-london-street-v1.webp` | ⛔ PENDENTE |
| objetos | `03-items/item-*.webp` (suitcase, ticket, map, camera, bus, cab, phone-box…) | ⛔ PENDENTE |

## LISTENING
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-04-listening-big-ben-v1.webp` | ⛔ PENDENTE |
| character | `01-characters/emma-listening-headphones-v1.webp` | ⛔ PENDENTE |

## CONVERSATION
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-05-conversation-london-cafe-v1.webp` | ⛔ PENDENTE |
| character A | `01-characters/alex-talking-v1.webp` | ⛔ PENDENTE |
| character B | `01-characters/emma-talking-v1.webp` | ⛔ PENDENTE |

## LANGUAGE
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-06-language-british-museum-v1.webp` | ⛔ PENDENTE |
| characters | conforme cena (`alex-thinking` / `emma-thinking`) | ⛔ PENDENTE |

## FINAL
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-07-final-adventure-map-v1.webp` | ⛔ PENDENTE |

## RESULT
| Papel | Arquivo | Status |
|------|---------|--------|
| background | `02-backgrounds/bg-08-result-london-celebration-v1.webp` | ⛔ PENDENTE |
| character A | `01-characters/alex-celebrating-v1.webp` | ⛔ PENDENTE |
| character B | `01-characters/emma-celebrating-v1.webp` | ⛔ PENDENTE |

---

## HUD / UI (todas as fases)
`04-ui/`: `panel-hud`, `panel-question`, `panel-dialog`, `panel-listening`,
`panel-result`, `btn-blue-primary/secondary`, `btn-green-correct`, `btn-red-error`,
`icon-volume/mute/repeat/pause/fullscreen/settings/heart/star`, `progress-bar` — **⛔ PENDENTE**.

## Responsividade
Master 1920×1080 com **safe areas**; derivados `desktop-1920x1080/`, `tablet/`,
`mobile-landscape/`. Texto importante nunca nas bordas. Posicionamento por código.

## Idiomas
EN e ES completos e **nunca misturados** na mesma atividade. Sem português.
