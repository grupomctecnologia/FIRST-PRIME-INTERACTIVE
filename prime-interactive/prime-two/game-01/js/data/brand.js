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
  // Logo OFICIAL da First Prime plugado (fonte: Google Drive · Referências
  // Visuais/Logos — variação "First Prime", V03). Embutido como data-URI em
  // js/data/brand-logo.js (window.PRIME_BRAND_LOGO) para funcionar no bundle único.
  placeholder: false,

  logo:      (typeof window !== "undefined" && window.PRIME_BRAND_LOGO) || "assets/brand/first-prime-logo.png",
  logoLight: (typeof window !== "undefined" && window.PRIME_BRAND_LOGO) || "assets/brand/first-prime-logo.png", // dourado sobre fundo escuro
  logoDark:  (typeof window !== "undefined" && window.PRIME_BRAND_LOGO) || "assets/brand/first-prime-logo.png",

  aspect: 458 / 330,

  note: "Logo oficial First Prime (V03). Não recriar por IA."
};
