# Guia de Substituição de Conteúdo — PRIME TWO Game 01

Este jogo foi construído como **motor completo**. O conteúdo atual é
**DEMONSTRATIVO (placeholder)** porque não havia acesso autorizado ao conteúdo
real do PRIME TWO no ambiente de desenvolvimento.

Para transformar o placeholder no conteúdo **oficial da Unidade** do PRIME TWO,
edite **apenas** o arquivo:

```
js/data/content.js
```

A estrutura de dados permanece a mesma — troque só os valores. Nenhuma outra
parte do código precisa mudar.

---

## 1. Metadados

```js
meta: {
  book: "PRIME TWO",
  unit: "Unit 1",                 // ← unidade real
  theme: "…",                     // ← tema real da unidade
  placeholder: false,             // ← marque false quando for conteúdo oficial
  note: "…"
}
```

## 2. Fase 1 — Intro (`intro`)
- `titleLines`: mantenha a identidade (FIRST PRIME INTERACTIVE / PRIME TWO / título).
- `narration`: lista de `{ en, pt }` faladas com legenda na abertura.

## 3. Fase 2 — Vocabulary (`vocabulary.items[]`)
Cada item:
```js
{ id, icon, word, translation,
  prompt: { en, pt },            // frase com lacuna
  options: [ ... ]               // deve conter `word`
}
```
`icon` usa uma chave de emoji já mapeada em `VocabularyScene` (`suitcase`,
`ticket`, `map`, `passport`, `camera`, `key`, `phone`, `wallet`). Para novos
objetos, acrescente a chave no mapa `iconEmoji` da cena (ou use arte em
`assets/img/`).

## 4. Fase 3 — Listening (`listening.items[]`)
```js
{ id, audioText,                 // texto falado (TTS) — ou plugue áudio real (item 8)
  subtitle: { en, pt },          // legenda sincronizada
  question: { en, pt },
  options: [ ... ], answer: <índice correto> }
```

## 5. Fase 4 — Conversation (`conversation`)
- `speakerA` / `speakerB`: nomes e papéis.
- `steps[]`: cada passo tem a fala `{ en, pt }` e 3 `options`
  `{ text, correct, feedback:{en,pt} }`.

## 6. Fase 5 — Language (`language.items[]`)
```js
{ id, words: [ ... ],            // palavras embaralhadas em cena
  answer: "frase correta exata", // usada na verificação (case-insensitive)
  translation, hint: { en, pt } }
```

## 7. Fase 6 — Final (`final.items[]`)
Itens mistos por `kind`: `vocab` | `listening` | `comprehension` | `grammar`.
Itens de `listening` também têm `audioText` + `subtitle`.

## 8. Áudios reais (opcional)
Em `PRIME_AUDIO_MANIFEST` (fim de `content.js`):
```js
window.PRIME_AUDIO_MANIFEST = {
  placeholder: false,
  music: { menu: "assets/audio/menu.mp3", adventure: "…", victory: "…" },
  voice: { "l1": "assets/audio/l1.mp3", "convA_0": "…" }  // chave = id/segmento
};
```
O `AudioManager` usa o arquivo quando o caminho existe; senão, mantém o
placeholder (TTS/síntese). Veja `assets/audio/README.md`.

---

## Checklist ao entregar conteúdo oficial
- [ ] `meta.placeholder = false` e `PRIME_AUDIO_MANIFEST.placeholder = false`
- [ ] Vocabulário, listening, conversa, gramática e final revisados pedagogicamente
- [ ] Legendas em inglês conferidas (a interface é 100% inglês — sem tradução)
- [ ] Áudios reais plugados (se houver)
- [ ] Remover os avisos de "conteúdo demonstrativo" do menu/resultado
      (`MenuScene.js` e `ResultScene.js`)
- [ ] Testar as 7 fases no navegador (desktop e mobile paisagem)
