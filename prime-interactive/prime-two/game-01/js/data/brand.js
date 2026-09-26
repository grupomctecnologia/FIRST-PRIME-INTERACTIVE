/* =============================================================================
 *  IDENTIDADE VISUAL — First Prime
 * -----------------------------------------------------------------------------
 *  ⚠️  OBRIGATÓRIO: usar EXCLUSIVAMENTE o logotipo OFICIAL da First Prime.
 *  NÃO recriar, redesenhar, estilizar, inventar símbolo parecido nem gerar
 *  "versão inspirada". Enquanto o arquivo oficial não estiver no projeto, o
 *  cabeçalho exibe um PLACEHOLDER TÉCNICO e a arte final fica EM ESPERA.
 *
 *  COMO ATIVAR O LOGO OFICIAL:
 *    1. Coloque os arquivos oficiais em  assets/brand/
 *       (PNG com transparência ou SVG; ver assets/brand/README.md).
 *    2. Preencha os caminhos abaixo e mude  placeholder: false.
 *    3. Recarregue — o jogo passa a usar o logo oficial automaticamente em
 *       splash, menu, intro e resultado. Nada mais precisa mudar.
 *
 *  Variações por fundo:
 *    - logoLight: versão para FUNDO ESCURO (arte clara)  → usada no jogo (tema escuro)
 *    - logoDark:  versão para FUNDO CLARO  (arte escura)
 *    - logo:      versão padrão/única (fallback)
 *  Use somente versões oficiais autorizadas.
 * ===========================================================================*/
window.PRIME_BRAND = {
  placeholder: true,          // ← mude para false quando o logo OFICIAL estiver plugado

  logo:      null,            // ex.: "assets/brand/first-prime-logo.png"
  logoLight: null,            // ex.: "assets/brand/first-prime-logo-light.png" (fundo escuro)
  logoDark:  null,            // ex.: "assets/brand/first-prime-logo-dark.png"  (fundo claro)

  // proporção nominal (largura/altura) do logo — ajuste ao arquivo real, se necessário
  aspect: 3.4,

  note: "Aguardando o arquivo OFICIAL do logo da First Prime. Não recriar por IA."
};
