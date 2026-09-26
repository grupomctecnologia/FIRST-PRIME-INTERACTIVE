# Direção — Próxima etapa (NÃO implementar agora)

Registro de direção aprovada pelo gestor para a evolução do PRIME TWO, **após** a
homologação do Game 01. **Não implementar nesta etapa.** Não iniciar o Game 02 agora.

## Metas e conceito
1. **Meta inicial: 15 jogos por livro.**
2. **Mapa de missões** com casinhas/pontos conectados por trilhas, inspirado na
   navegação de **Super Mario World**, mas com **identidade visual própria da First Prime**
   (não copiar a arte da Nintendo).
3. **Cada ponto = um jogo** e exibe as **estrelas conquistadas** naquele jogo.
4. Ao conquistar **todas as estrelas** de uma missão, o ponto ganha uma
   **aparência de conquista completa** (estado visual "completo").
5. **Progressão até o nível Master.**
6. **Mecânicas variadas** entre os jogos — evitar repetir a mesma atividade só trocando
   as perguntas.
7. **Conteúdo de cada missão vinculado aos objetivos pedagógicos do livro.**

## A definir na próxima etapa (ainda em aberto)
- Critérios de **desbloqueio** de cada ponto/missão.
- Critérios do **nível Master**.
- Catálogo das mecânicas dos 15 jogos.
- Vínculo pedagógico detalhado por missão (mapa conteúdo × unidade do livro).

## Observações de arquitetura (já preparado, reutilizável)
- O jogo já carrega assets **por nome de arquivo** (`asset-manifest.js`) e tem
  `assets/v1/08-mapping/ASSET-MAP.md` — base para escalar para vários jogos.
- Estrelas por fase já existem em `GameState` (reaproveitável para estrelas por ponto do mapa).
- Preservar lógica/idiomas/pontuação já validados ao criar o mapa de missões.
