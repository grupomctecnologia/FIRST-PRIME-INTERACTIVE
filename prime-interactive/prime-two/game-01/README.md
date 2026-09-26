# PRIME TWO — THE ENGLISH ADVENTURE · Game 01

Primeiro jogo premium da linha **FIRST PRIME INTERACTIVE**, baseado no **PRIME TWO**.
Aventura educacional de inglês em HTML5 + Phaser 3, com 7 fases, modo Professor e
modo Desafio, música, efeitos, legendas sincronizadas, pontuação e acessibilidade.

> **Versão de HOMOLOGAÇÃO — NÃO é produção.**
> Projeto novo e isolado. Não altera o Portal do Professor, nem o site institucional,
> nem os jogos/livros/áudios atuais. Nada foi publicado em produção.

> ⚠️ **Conteúdo DEMONSTRATIVO (placeholder).** Não havia acesso autorizado ao
> conteúdo real do PRIME TWO neste ambiente. Todo o vocabulário, diálogos, listening
> e gramática são exemplos marcados como placeholder e **substituíveis** — veja
> [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md).

---

## Como abrir (homologação local)

O jogo usa apenas arquivos estáticos, mas **precisa ser servido por HTTP** (os
navegadores bloqueiam `file://` para scripts/áudio). Na pasta `game-01/`:

```bash
# Python (já disponível na maioria dos ambientes)
python3 -m http.server 8123
# depois abra:  http://localhost:8123/index.html
```

Alternativas: `npx serve` ou qualquer servidor estático.
Recomenda-se **modo paisagem** (horizontal) — em celulares no retrato o jogo
mostra um aviso "Gire o dispositivo".

Requisitos: navegador moderno com WebGL e Web Audio (Chrome, Edge, Firefox, Safari).

---

## Tecnologias

| Camada        | Tecnologia                                                        |
|---------------|-------------------------------------------------------------------|
| Engine 2D     | **Phaser 3.80.1** (vendorizado em `lib/phaser.min.js`, offline)   |
| Base          | HTML5, CSS moderno (gradientes, `dvh`, media queries), JavaScript |
| Áudio         | **Web Audio API** (música + efeitos sintetizados, royalty-free)   |
| Voz/Narração  | **SpeechSynthesis** (TTS do navegador — placeholder substituível) |
| Legendas      | Renderizadas DENTRO do canvas (in-canvas), sincronizadas — inglês apenas |
| Persistência  | `localStorage` (apenas preferências: modo, volume, legenda, etc.) |

Sem Java, sem WordPress, sem dependências de build. Nenhum material com copyright.

---

## Estrutura

```
prime-interactive/prime-two/game-01/
├── index.html              # ponto de entrada
├── css/style.css           # container, loader, legendas, acessibilidade, responsivo
├── lib/phaser.min.js        # Phaser 3 (vendorizado)
├── js/
│   ├── config.js           # config do Phaser (FIT 1280×720, autoCenter)
│   ├── main.js             # bootstrap
│   ├── data/content.js      # ⭐ CONTEÚDO (PLACEHOLDER) + manifesto de áudio
│   ├── managers/
│   │   ├── GameState.js     # score, estrelas, vidas, modo, settings, progressão
│   │   ├── AudioManager.js  # música/efeitos (WebAudio) + voz (TTS) + volume/mute
│   │   └── SubtitleManager.js # legendas EN/PT sincronizadas + acessibilidade
│   ├── ui/
│   │   ├── theme.js         # sistema visual premium (fundos, botões, cards, partículas)
│   │   ├── quiz.js          # grade de múltipla escolha reutilizável
│   │   ├── hud.js           # HUD + controles (legenda, volume, pausar, tela cheia…)
│   │   └── flow.js          # progressão entre fases + tela "fase concluída"
│   └── scenes/
│       ├── BootScene.js
│       ├── PreloadScene.js       # gera texturas procedurais + loading premium
│       ├── MenuScene.js          # menu, seleção de modo, configurações
│       ├── IntroScene.js         # FASE 1 — Cinematic Intro (parallax, título, narração)
│       ├── VocabularyScene.js    # FASE 2 — Vocabulary Mission
│       ├── ListeningScene.js     # FASE 3 — Listening Mission (áudio + legenda)
│       ├── ConversationScene.js  # FASE 4 — Conversation Challenge (personagens)
│       ├── LanguageScene.js      # FASE 5 — Language Challenge (drag & drop)
│       ├── FinalScene.js         # FASE 6 — Final Mission (mista)
│       └── ResultScene.js        # FASE 7 — Resultado (pontuação, estrelas, replay)
├── assets/
│   ├── img/                # (reservado — arte é gerada proceduralmente por ora)
│   └── audio/README.md     # como plugar áudios reais do PRIME TWO
├── screenshots/            # capturas da execução real no navegador
├── README.md
└── CONTENT_GUIDE.md         # como trocar o placeholder pelo conteúdo real
```

---

## As 7 fases

1. **Cinematic Intro** — abertura premium: céu noturno, skyline em parallax,
   partículas, revelação do título (FIRST PRIME INTERACTIVE / PRIME TWO /
   THE ENGLISH ADVENTURE), narração com legendas e botão START.
2. **Vocabulary Mission** — objeto em destaque + frase com lacuna; escolher a
   palavra correta; áudio da palavra, feedback e pontuação.
3. **Listening Mission** — áudio com equalizador animado, legenda sincronizada,
   botão *repetir*, múltipla escolha e feedback imediato.
4. **Conversation Challenge** — dois personagens (balões, voz, legenda);
   escolher a resposta correta para continuar o diálogo, com feedback pedagógico.
5. **Language Challenge** — gramática contextualizada: **arrastar/tocar** palavras
   para formar a frase; dica, correção e áudio da frase final.
6. **Final Mission** — combina vocabulário, listening, compreensão e gramática.
7. **Resultado** — pontuação total, estrelas, precisão, mensagem, *jogar novamente*
   e *voltar ao menu* (com confete na vitória / Game Over no Desafio).

## Idiomas e jogo único

- **Seleção de idioma na abertura**: 🇺🇸 **ENGLISH — PLAY** / 🇪🇸 **ESPAÑOL — JUGAR**.
  Toda a experiência (interface, perguntas, alternativas, instruções, legendas,
  narração/voz, feedbacks, resultados e botões) roda **exclusivamente no idioma
  escolhido**. Sem português e sem tradução simultânea.
- **Um único jogo** (sem Modo Professor/Desafio): fluxo `abrir → escolher idioma
  → PLAY/JUGAR → jogar`.
- **Pontuação, estrelas e 3 vidas**. Resposta errada → feedback no idioma +
  **nova tentativa** (a resposta correta **não** é revelada); perde uma vida a
  cada erro; ao zerar as vidas → tela final (Game Over).
- Conteúdo pedagógico **separado por idioma** (`content.en.js` / `content.es.js`),
  ambos **placeholder** — o espanhol **não** é tradução automática do inglês e
  deve ser substituído pelo currículo real de cada curso.

## Controles e acessibilidade

- HUD (barra única mobile-first): legenda (CC), repetir áudio, volume, mudo, pausar,
  tela cheia, menu.
- Atalhos de teclado: **L** legenda · **M** mudo · **P** pausar · **R** repetir ·
  **F** tela cheia · **Enter**/**Esc** navegar.
- Acessibilidade: legendas, controle de volume/mute, **fonte grande** (A+),
  **alto contraste**, navegação por teclado, suporte a toque, e alvos grandes.
- Responsivo: desktop, tablet, lousa digital e celular (paisagem recomendada).

---

## Áudio e conteúdo

- **Música e efeitos** são sintetizados em runtime (Web Audio API) — royalty-free,
  sem arquivos com copyright.
- **Vozes/narração** usam o TTS do navegador (SpeechSynthesis) como placeholder.
- Para plugar **áudios reais** do PRIME TWO, veja `assets/audio/README.md` e o
  `PRIME_AUDIO_MANIFEST` em `js/data/content.js` — o `AudioManager` prioriza
  arquivos quando existirem.

Para trocar **todo o conteúdo pedagógico** pelo material real do PRIME TWO,
siga o [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md).

---

## Validação (teste real no navegador)

Executado no Chromium (Playwright), viewport desktop e mobile:

- 7 fases navegáveis, menu, pontuação, estrelas, vidas, tela "fase concluída" e
  resultado — **0 erros no console**.
- Música/efeitos (Web Audio) e legendas sincronizadas ativos.
- Interação real validada (respostas registram pontuação; legenda oculta após
  responder).
- Desktop (1280×720), mobile paisagem (844×390) e retrato (aviso de rotação).

Capturas em [`screenshots/`](./screenshots/).
