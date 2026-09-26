# assets/brand/ — Logotipo OFICIAL da First Prime

⚠️ **OBRIGATÓRIO — use exclusivamente o logotipo OFICIAL da First Prime.**
NÃO recriar, redesenhar, estilizar, inventar símbolo parecido nem gerar
"versão inspirada" por IA.

## Estado atual (homologação)

**Nenhum logo oficial foi incluído** — o arquivo original ainda não estava
disponível neste ambiente. Por isso o jogo exibe um **PLACEHOLDER TÉCNICO** no
cabeçalho (splash, menu, intro e resultado) e a **arte final do cabeçalho está
EM ESPERA**. Nenhuma marca recriada por IA é usada.

## Como plugar o logo oficial

1. Copie os arquivos **oficiais autorizados** para esta pasta, por exemplo:
   - `first-prime-logo-light.png` — versão para **fundo escuro** (arte clara)
   - `first-prime-logo-dark.png`  — versão para **fundo claro** (arte escura)
   - `first-prime-logo.png`       — versão padrão/única (fallback)

   PNG com transparência ou SVG. Preserve **símbolo, tipografia, proporções,
   cores e identidade** exatamente como no original.

2. Edite `js/data/brand.js`:
   ```js
   window.PRIME_BRAND = {
     placeholder: false,
     logo:      "assets/brand/first-prime-logo.png",
     logoLight: "assets/brand/first-prime-logo-light.png",
     logoDark:  "assets/brand/first-prime-logo-dark.png",
     aspect: 3.4  // ajuste à proporção real do arquivo
   };
   ```

3. Recarregue o jogo. O logo oficial passa a ser usado automaticamente no
   splash, menu, intro e resultado. Nada mais precisa mudar.

## Regras
- Usar apenas o arquivo oficial (sem recriação por IA).
- Preservar símbolo, tipografia, proporções, cores e identidade.
- Fundo escuro/claro → usar somente as versões oficiais autorizadas.
- Não aprovar telas finais com logo recriado por IA.
