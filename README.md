# FIRST PRIME INTERACTIVE

Jogos educacionais premium da **First Prime** — Inglês (Prime 1 a 4).
Repositório novo e **isolado** do Portal do Professor atual (não altera produção,
nginx, autenticação, livros/jogos homologados, ORION ou site institucional).

## Projetos

| Projeto | Caminho | Estado |
|--------|---------|--------|
| PRIME TWO — The English Adventure (Game 01) | [`prime-interactive/prime-two/game-01/`](./prime-interactive/prime-two/game-01/) | Homologação (não produção) |

### PRIME TWO — Game 01
Aventura educacional premium em HTML5 + Phaser 3: 7 fases, Modo Professor e Modo
Desafio, música, efeitos, legendas sincronizadas, pontuação/estrelas e
acessibilidade. Conteúdo atual é **demonstrativo (placeholder)**, com estrutura
pronta para receber o conteúdo real do PRIME TWO.

Como abrir (local):
```bash
cd prime-interactive/prime-two/game-01
python3 -m http.server 8123
# http://localhost:8123/index.html
```

Documentação: [README do jogo](./prime-interactive/prime-two/game-01/README.md) ·
[Guia de conteúdo](./prime-interactive/prime-two/game-01/CONTENT_GUIDE.md)

## Estrutura de deploy pretendida (futura)
```
/opt/prime-interactive/
    prime-two/
        game-01/
```
No ambiente cloud, a mesma estrutura foi criada em `prime-interactive/` dentro
deste repositório, pronta para deploy posterior. **Nada foi publicado em produção.**

## Versionamento
Não versionar segredos: `.env`, chaves, senhas, credenciais ou backups (ver `.gitignore`).
