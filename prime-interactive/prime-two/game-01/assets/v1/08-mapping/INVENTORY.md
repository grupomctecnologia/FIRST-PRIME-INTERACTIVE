# PRIME TWO — Game 01 · INVENTÁRIO DE ASSETS (v1)

Regra oficial: o jogo consome **assets individuais** (personagem, fundo, objeto,
UI separados). **Proibido** recortar de storyboard/mockup/screenshot. Storyboard =
referência visual apenas. Falta de asset → marcar **PENDENTE**, sem gambiarra.

---

## ✅ STATUS: PACKS 01–04 INTEGRADOS (v8)
Os 4 packs oficiais foram recebidos (ZIP), extraídos, **originais preservados** em
`00-originals/`, otimizados para WebP (transparência/proporções preservadas) em
`01-characters / 02-backgrounds / 03-items / 04-ui`, e **integrados no jogo**:
- Personagens Alex/Emma reais em Home, Intro, Listening, Conversation, Language, Result.
- Fundos de Londres por fase (Pack 02). Objetos reais no Vocabulary (Pack 03).
- UI premium (Pack 04): botões, **cards de 4 estados** (default/selected/correct/wrong),
  ícones ligados às funções (HUD), painel e barra de progresso.
- Carregamento por nome de arquivo (`asset-manifest.js`) — o jogo NÃO depende da
  pasta de referências. Lógica/idiomas/sequência preservados (EN+ES, 0 erros).
- **PENDENTE:** bandeiras realistas (Pack 06 não veio nestes 4); exports oficiais
  light/dark/símbolo da marca (fonte vetorial no Drive).

## A. JÁ EXISTE (utilizável)
| Asset | Onde | Observação |
|------|------|-----------|
| Logo oficial First Prime (primário) | `05-brand/logo-first-prime-primary.png` | recuperado do Drive; usar como light-sobre-escuro |
| Referência master (layout/estilo) | `07-references/reference-game01-approved-master.png` | só comparação — **não recortar** |
| Referência storyboard (10 painéis) | `07-references/reference-scenes-approved.png` | só comparação — **não recortar** |
| Áudio (música/SFX/narração) | `AudioManager` (WebAudio + TTS EN/ES) | funcional/procedural; sem arquivos de trilha |
| Motor + lógica | scenes/GameState/quiz/flow | EN/ES, 7 fases, pontuação, mobile — **validado, 0 erros** |

## B. INTERIM — A SUBSTITUIR (recortes provisórios do storyboard)
> Estão no jogo hoje (Versão 7) só para não deixar telas vazias. **Serão trocados**
> pelos assets oficiais individuais assim que existirem. Ficam em `assets/art/`.

| Interim | Substituto oficial previsto |
|--------|------------------------------|
| `char_boy / char_girl / char_couple / char_boy_intro / char_girl_head` | `01-characters/alex-*`, `emma-*` |
| `bg_london / bg_map` | `02-backgrounds/bg-01..08` |
| `prop_phonebox / prop_bigben / prop_bus / prop_museum` | `03-items/item-*` |
| Botões/painéis vetoriais (`theme.js`) | `04-ui/*` |
| Bandeiras vetoriais (`flags.js`) | `06-flags/flag-us / flag-spain` |

## C. RECUPERÁVEL DO DRIVE (marca oficial — First Prime → Logos)
| Arquivo no Drive | Tipo | Uso |
|------------------|------|-----|
| `FirstPrime_Logo_AI.ai` | vetor (Illustrator) | **fonte oficial** do logo (export light/dark/símbolo) |
| `FirstPrime_Logo_PDF.pdf` | vetor (PDF) | idem, rasterizável |
| `FirstPrime_Logo_CDR.cdr` | vetor (Corel) | idem |
| `FirstPrime_Manual_PDF/AI/CDR` | manual de marca | cores, versões light/dark, símbolo |
| `Logo_Imagens/V01..V08_PNG_Favicon.png` | PNG | candidatos a **símbolo** (`logo-first-prime-symbol`) |
| `Logo_Imagens/V0*_JPG_Avatar.jpg` | JPG | avatares de marca |

**Bloqueio técnico atual:** este ambiente não tem renderizador de vetor
(`pdftoppm`/`inkscape` ausentes) e o download binário do Drive para disco é
inviável aqui. Então os PNGs oficiais **light/dark/símbolo** ainda **não** foram
exportados. Precisam ser: (a) exportados por um designer a partir do `.ai/.cdr`, ou
(b) você me manda os PNGs prontos, ou (c) você autoriza instalar um renderizador
no ambiente para eu rasterizar o PDF/AI.

## D. PENDENTE — PRODUÇÃO NECESSÁRIA (não dá para eu improvisar)
### 01-characters (ALEX / EMMA) — 14 arquivos ⛔
alex: fullbody-neutral, halfbody-neutral, talking, pointing, thinking, celebrating, listening
emma: fullbody-neutral, halfbody-neutral, talking, tablet, listening-headphones, thinking, celebrating
→ mesma identidade facial em todas as poses, PNG/WebP transparente, cinematográfico.

### 02-backgrounds — 9 masters + derivados ⛔
bg-00 language-select · bg-01 home-night · bg-02 airport · bg-03 vocabulary-street ·
bg-04 big-ben · bg-05 café · bg-06 british-museum · bg-07 adventure-map · bg-08 celebration
→ **limpos** (sem UI/texto/logo/personagem), master 1920×1080 + safe areas + derivados.

### 03-items — 14 objetos ⛔
suitcase, passport, map, ticket, camera, headphones, red-bus, black-cab, phone-box,
big-ben, airplane, museum, coffee, signpost → transparente, semi-realista.

### 04-ui — botões/painéis/ícones/progress ⛔
(**Observação:** UI é o único pacote que eu consigo produzir por código
vetorial/SVG de forma legítima — não é recorte de storyboard. Aguardo seu OK
para produzir a UI premium por vetor; se preferir arte, marcar PENDENTE.)

### 06-flags — bandeiras realistas (tecido/3D) ⛔
flag-us-premium, flag-spain-premium (interim vetorial existe).

### 05-brand — exports oficiais ⛔
logo-first-prime-light / -dark / -symbol / -technology (fonte no Drive; ver seção C).

---

## E. COMO DESTRAVAR A PRODUÇÃO (decisão sua)
Personagens, fundos e objetos no nível cinematográfico pedido **não** podem ser
produzidos por mim de graça neste ambiente:
- geração por IA (Morphix) está **fora** (você vetou pago; e o host de saída das
  imagens está bloqueado pela rede, então nem o plano free serve para baixar);
- recorte de storyboard está **proibido** pela nova regra (correto).

Caminhos possíveis (escolha):
1. **Você/produção fornece** os PNG/WebP finais de personagens, fundos e objetos →
   eu integro, posiciono por código e testo.
2. **Autorizar um método de geração** (serviço/plano) — decisão exclusiva do Márcio.
3. **UI e bandeiras** eu posso produzir por **vetor/SVG** já (sem custo) se você aprovar.
4. **Marca oficial**: autorizar renderizador no ambiente OU me enviar os PNGs light/dark/símbolo.

Enquanto nada disso acontece, o jogo segue jogável com os **interim** (Versão 7),
claramente marcados como provisórios.
