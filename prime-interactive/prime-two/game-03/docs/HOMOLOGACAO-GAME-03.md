# Homologação — GAME 03 · London Underground Mystery

Documento interno (não exibido ao aluno). Relatório de validação de assets e
testes automatizados do Game 03.

## 1. Recebimento e validação dos assets

Quatro packs oficiais recebidos e extraídos **fora do Git**; ZIPs **não
versionados**. Inventário completo em `ASSET-INVENTORY.md`.

| Categoria | Esperado | Recebido | OK |
|-----------|----------|----------|----|
| Personagens | 8 | 8 | ✓ |
| Cenários | 7 | 7 | ✓ |
| Objetos/Itens | 14 | 14 | ✓ |
| Interface | 14 | 14 | ✓ |
| **Total** | **43** | **43** | ✓ |

- **Formato:** todos PNG, 8-bit.
- **Dimensões:** cenários 1672×941 (RGB, opacos); personagens 1024×1536 (RGBA);
  itens e interface RGBA — transparência conferida.
- **Integridade:** assinatura PNG válida, CRC de todos os chunks válido e chunk
  IEND presente em todos os 43 arquivos — **0 corrompidos, 0 ausentes**.
- **Nenhum placeholder criado.** Somente assets oficiais do Game 03 são usados.
- Assets copiados para `game-03/assets/{characters,backgrounds,items,interface}/`.

## 2. Testes automatizados (Chromium headless / Playwright)

Servidor estático local; jogo dirigido pela própria lógica das cenas.
Resultado consolidado — **0 erros de console, 0 erros de página, 0 requisições
404** em todos os cenários.

### 2.1 Partida completa (7 etapas)

| Idioma | Viewport | 43 assets | Chegou ao Result | Sucesso | Estrelas | Pontos | Console/404 |
|--------|----------|-----------|------------------|---------|----------|--------|-------------|
| EN | 1280×720 (PC) | 43/43 | sim | gameOver=false | 3 | 2800 | 0 / 0 |
| ES | 1280×720 (PC) | 43/43 | sim | gameOver=false | 3 | 2800 | 0 / 0 |
| EN | 1024×768 (tablet) | 43/43 | sim | gameOver=false | 3 | 2800 | 0 / 0 |
| EN | 844×390 (celular paisagem) | 43/43 | sim | gameOver=false | 3 | 2800 | 0 / 0 |

As 28 perguntas/atividades foram respondidas; Memory Match (6 pares), Word
Builder (4 palavras), Match (4), Follow the Direction (4), Sentence Puzzle (4),
Timed Final Challenge (6) — todas concluídas.

### 2.2 Carregamento de assets

Todas as 43 texturas presentes no gerenciador de texturas após o preload; todas
as respostas HTTP dos assets = **200** (0 respostas ≠ 200, 0 requisições
falhas). Sem 404.

### 2.3 Timer e sistema de estrelas (limiares)

`finalStars()` — até 30s → 3★; 31–45s → 2★; acima de 45s → 1★.

| Tempo | Estrelas |
|-------|----------|
| 12.0s | 3 |
| 30.0s | 3 |
| 30.001s | 2 |
| 45.0s | 2 |
| 45.001s | 1 |
| 60.0s | 1 |

Timer visível na etapa final (moldura de timer + cronômetro), cor muda em
30s/45s.

### 2.4 Perda de vida, retentativa e Game Over

- Resposta errada → **perde 1 vida**, feedback "Try again!", **sem revelar a
  resposta** (`_answered` permanece falso; a opção certa nunca é destacada).
- Retentativa correta na sequência → avança normalmente.
- 3 erros (3→2→1→0 vidas) → transição para `ResultScene` com **gameOver=true**
  (tela de Game Over, permite refazer a missão). Verificado em fluxo real.

### 2.5 Replay e segunda partida consecutiva

- "Play again" reinicia a sessão (pontuação/moedas/vidas zeradas) e volta ao
  Mission Briefing; segunda partida jogável do início ao fim.

### 2.6 Integração Mission Map (Casa 3 → Casa 4)

Modo normal (progresso real), Casas 1 e 2 concluídas, Casa 3 liberada:

- Casa 3 abre o Game 03 no iframe; o mapa detecta a conclusão pelo contrato
  `ResultScene` (`gameOver === false`) — banner "House complete!" exibido.
- Ao voltar ao mapa: **completed[3]=true**, **unlockedMax=4**, Alex e Emma
  **caminham da Casa 3 para a Casa 4**, **Casa 4 liberada** (estado "current").
- Persistência confirmada após recarregar a página: `completed3=true`,
  `unlockedMax=4`, Casa 4 desbloqueada.

### 2.7 Modo ADM / Teste

- `?adm=1`: abre a Casa 3 diretamente e simula a conclusão **sem gravar** o
  progresso real do aluno (opera só em memória). Verificado — em ADM a conclusão
  não altera `localStorage`.

### 2.8 Idiomas e ausência de PT/DEMO

- Telas EN e ES renderizadas (Menu, Briefing, 6 atividades, Result) — textos
  corretos por idioma.
- **Nenhum** texto "DEMO", "placeholder" ou português nas telas do aluno.
  (`placeholder: false` — logo oficial First Prime exibido em splash, menu,
  briefing e resultado.)

### 2.9 Games 01 e 02

- Nenhum arquivo de `game-01/` ou `game-02/` foi alterado (apenas `map/` recebeu
  o registro da Casa 3). Game 01 e Game 02 continuam inicializando (`PRIME_GAME`
  presente), sem 404 reproduzível e Game 02 sem erros de console.

## 3. Conclusão

Game 03 aprovado nos testes automatizados: 43 assets válidos e carregados, 7
etapas funcionais em EN/ES, timer e estrelas por tempo, vidas/erro/retentativa
sem revelar resposta, replay e segunda partida, integração Casa 3 → Casa 4 com
liberação e caminhada, Modo ADM não altera progresso, sem 404 e sem erros de
console. Games 01 e 02 preservados.
