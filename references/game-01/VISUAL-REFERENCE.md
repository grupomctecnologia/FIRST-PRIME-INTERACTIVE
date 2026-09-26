# PRIME TWO — Game 01 · Referência Visual Oficial

> **ATUALIZAÇÃO (referência principal):** `reference-approved-2.png` é a
> **referência oficial de LAYOUT e estilo** — personagens **mais realistas**
> (menos infantis) e mapeia 1:1 as 7 telas do jogo, cada uma com seu cenário
> de Londres (aeroporto, cabine telefônica, Big Ben, rua/museu e o **mapa de
> progressão** na Final). O casal e os cenários usados no jogo são recortados
> desta imagem. `reference-approved.png` (storyboard, abaixo) permanece como
> referência complementar. Regra do Márcio: **o mais realista possível**.
> A lógica (jogo único, sem modos; EN/ES; pontuação; mobile) é preservada —
> os botões "Modo Professor/Desafio" que aparecem na arte NÃO são reativados.

**Arquivo (complementar):** `reference-approved.png` (1536×1024, storyboard com 10 painéis)
**Status:** REFERÊNCIA VISUAL OFICIAL — pré-aprovada pelo Márcio.
Toda implementação visual do Game 01 (home, personagens, cenários, iluminação,
paleta, botões, interface e progressão) deve ser comparada com esta arte.

> ⚠️ **Marca:** o logotipo *conceitual* que aparece na arte ("PRIME SECRET MISSION")
> **NÃO** substitui a marca oficial. Usar **exclusivamente** o arquivo oficial
> First Prime já recuperado (`assets/brand/first-prime-logo.png`). O nome do produto
> continua **PRIME TWO — The English Adventure**.

> ⚠️ **Lógica:** a arte mostra modos SOLO/DUO/TEAMS, configuração de equipes e roleta.
> Esses sistemas foram **removidos** pela decisão definitiva (jogo único, 7 fases,
> sem modos). Desta referência aproveitamos a **direção visual** (casal, Londres,
> cinematografia, paleta, botões, sensação de mapa de aventura) — **não** os
> sistemas de jogo removidos.

---

## 1. Estilo geral
- **3D estilizado cinematográfico** (tipo Pixar/DreamWorks), não vetor chapado,
  não 8-bit. Personagens com volume, subsurface, olhos grandes expressivos.
- **Tema:** aventura de agentes/"missão secreta" — clima de espião jovem,
  tecnológico, premium.
- **Profundidade de campo:** fundos desfocados com bokeh; foco nos personagens/UI.
- **Iluminação:** rim light quente (âmbar/dourado) + preenchimento frio (azul/ciano);
  reflexos glossy; atmosfera com névoa e luzes de cidade.

## 2. Paleta (aproximada)
| Uso | Cor | Hex aprox. |
|-----|-----|-----------|
| Fundo profundo | azul-marinho | `#0a1428` / `#0d1b3a` |
| Fundo painel | azul escuro | `#132247` |
| Acento quente (luz, títulos) | âmbar/dourado | `#ffb733` / `#ffd15c` |
| Acento tecnológico | ciano | `#38c7ff` |
| Botão primário (CTA) | dourado pílula | `#ffc21e` |
| Botão azul (modo/idioma) | azul | `#2b6fff` |
| Positivo | verde | `#37c837` |
| Negativo/alerta | vermelho | `#e8433a` |
| Equipes | azul / vermelho / verde / amarelo | — |
| Texto | branco | `#ffffff` |

## 3. Personagens (o casal de protagonistas)
- **Menino (agente):** cabelo castanho espetado, **óculos/goggles na testa**,
  jaqueta tática escura com detalhes ciano/teal, mochila, sorriso confiante.
- **Menina (agente):** cabelo castanho longo ondulado, jaqueta tática escura,
  em vários painéis segura um **tablet**, expressão simpática.
- Ambos jovens, heroicos, "agentes-exploradores". Aparecem ladeando os títulos
  (home) e comemorando nos resultados.

## 4. Tipografia / logotipo
- Emblema de **estrela** + "FIRST PRIME INTERACTIVE" no topo.
- Wordmark do produto em **metálico dourado com contorno azul**, alto contraste,
  sombra forte. (No jogo: usar a marca oficial + nome PRIME TWO.)
- Títulos de tela em branco/dourado, bold, tracking largo.

## 5. Interface / botões
- **Painéis:** retângulos arredondados, borda sutil clara, leve gloss no topo,
  sombra profunda; sensação de "vidro/HUD".
- **CTA primário:** **pílula dourada** (START, CONFIRM, SPIN, PLAY AGAIN) com
  texto escuro.
- **Botões de modo/idioma:** cartões azuis glossy com ícone e bandeira.
- **Quiz:** grade 2×2 de opções; opção correta destaca em **verde**.
- **HUD:** placar com chips de avatar + cor de equipe; timer circular.

## 6. Progressão (mapa de aventura) — painel 5
- **Tabuleiro aéreo de cidade noturna** (Londres/campus) com **caminho de casas
  numeradas** serpenteando (1→19→FINISH), personagens como peões no caminho,
  helicóptero, rio, pontes, holofotes.
- É a **sensação de avanço fase a fase / mundo a mundo** que o jogo deve evocar:
  cada fase é um "ponto" no mapa; concluir avança no caminho até o destino final.

## 7. Mapa painel → tela do jogo (7 telas)
| # | Painel da referência | Tela no PRIME TWO |
|---|----------------------|-------------------|
| 1 | Choose your language | **LanguageSelect** (🇺🇸/🇪🇸) |
| 4 | Mission briefing | **Intro** (chegada/aeroporto/Londres) |
| 5 | Board + progressão | **Home/menu** com sensação de mapa de aventura + **transições entre fases** |
| 6 | Challenge (quiz) | **Vocabulary / Listening / Final** |
| 6 | Challenge (diálogo) | **Conversation** (casal em cena) |
| 6 | Challenge | **Language** (montar frase) |
| 8 | CORRECT! +100 ★★★ | Feedback de acerto por fase |
| 9 | Mission complete / ranking | **Result** (comemorativo) |
| 10 | Mobile (iPhone paisagem) | Layout responsivo já existente |

## 8. Regras de fidelidade
- Comparar cada tela implementada com o painel correspondente **lado a lado**.
- **Não** declarar "fiel à referência" sem screenshot real do jogo + comparação.
- Preservar: casal, Londres, clima cinematográfico, paleta, pílulas douradas,
  cada fase com cenário próprio, progressão de mapa.
- Preservar a **lógica** já corrigida (navegação, idiomas EN/ES, pontuação, mobile).
