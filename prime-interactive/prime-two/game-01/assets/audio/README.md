# assets/audio/

Pasta reservada para os **áudios reais** do PRIME TWO (música, efeitos e vozes).

## Estado atual (homologação)

Nenhum áudio real foi incluído — **não havia acesso autorizado aos áudios do
PRIME TWO neste ambiente cloud**. Enquanto isso, o jogo gera o áudio em runtime:

| Recurso            | Placeholder atual                                   |
|--------------------|-----------------------------------------------------|
| Música de fundo    | Sintetizada via Web Audio API (royalty-free)        |
| Efeitos sonoros    | Sintetizados via Web Audio API                      |
| Vozes / narração   | `SpeechSynthesis` do navegador (TTS em inglês)      |

Nada aqui usa material com copyright.

## Como substituir pelos áudios reais

1. Coloque os arquivos `.mp3`/`.ogg` nesta pasta.
2. Edite `js/data/content.js` → `window.PRIME_AUDIO_MANIFEST`:

```js
window.PRIME_AUDIO_MANIFEST = {
  placeholder: false,
  music: {
    menu: "assets/audio/music_menu.mp3",
    adventure: "assets/audio/music_adventure.mp3",
    victory: "assets/audio/music_victory.mp3"
  },
  voice: {
    "l1": "assets/audio/listening_1.mp3",   // usa o id do item de conteúdo
    "convA_0": "assets/audio/emma_line1.mp3"
  }
};
```

O `AudioManager` dá **prioridade a arquivos** quando o caminho existe no
manifesto; caso contrário, mantém o placeholder sintetizado/TTS.
