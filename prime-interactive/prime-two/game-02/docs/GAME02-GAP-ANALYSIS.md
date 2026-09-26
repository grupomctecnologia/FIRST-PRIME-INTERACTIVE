# GAME 02 — Gap Analysis (commit `f30b8da` × estrutura oficial de 7 etapas)

Comparação entre o Game 02 aprovado como base técnica (`f30b8da`) e a estrutura
pedagógica oficial de 7 etapas. Mapeia o que já existe, o que muda e o que falta.

| # | Etapa oficial | Existe em `f30b8da`? | Ação |
|---|---|---|---|
| 1 | **MISSION BRIEFING** | ✅ `IntroScene` (Alex & Emma, narração) | **Ajustar** texto (briefing de compras; sem "DEMO/placeholder" na tela) |
| 2 | **FIND THE ITEM** (escolher produto entre opções visuais) | ✅ mecânica existente (`ListeningScene`: ouvir + tocar imagem na grade) | **Remapear** → `FindItemScene` (título/prompt "Find the …"; áudio opcional) |
| 3 | **COLOUR AND SIZE** (produto + cor + tamanho S/M/L) | ❌ não existe (havia vocabulário palavra↔imagem) | **Adicionar** `ColourSizeScene` (cards com imagem + cor + tamanho; frase-alvo) |
| 4 | **PRICES AND POUNDS** (preços em £ + cálculo) | ✅ `CheckoutScene` (total / mais barato / troco) | **Remapear** → `PricesScene` (mesma mecânica; título) |
| 5 | **SHOPPING DIALOGUE** (conversa na loja) | ✅ `ConversationScene` | **Ajustar** falas para as oficiais (Can I help you? / I'm looking for a jacket / Do you have this in blue? / What size? / Can I try it on? / Where is the fitting room? / I'll take it) |
| 6 | **SHOPPING BAG** (adicionar, ver, conferir, **remover** via slots) | 🟡 `FinalScene` adicionava itens aos slots, **sem remover** | **Ajustar** → `ShoppingBagScene` (adiciona **e remove** tocando o slot; confere a lista) |
| 7 | **CHECKOUT CHALLENGE** (conferência: produtos, cores, tamanhos, quantidades, preços, total) + **CONFIRM PURCHASE** | ❌ não existe (fluxo ia direto ao resultado) | **Adicionar** `CheckoutChallengeScene` (recibo + verificação do total + botão CONFIRM PURCHASE) |
| — | **MISSION COMPLETE!** (Excellent work! …) | 🟡 `ResultScene` genérico ("Shopping complete") | **Ajustar** para "MISSION COMPLETE! / Excellent work! You completed the London Shopping Mission." |

## Mecânicas preservadas (não reconstruir)
Pontuação, moedas, estrelas (3★/fase), 3 vidas, **retry sem revelar a resposta**,
EN/ES independentes, HUD, áudio/TTS, transições, resets de estado por partida
(2ª partida consecutiva), carregamento dos 40 assets por nome de arquivo,
persistência separada (`STORAGE_KEY = "prime2_game02_v1"`).

## Resumo
- **Já existiam (remapeadas):** 1 Briefing, 2 Find the Item, 4 Prices and Pounds, 5 Shopping Dialogue.
- **Ajustadas:** 6 Shopping Bag (adiciona **+ remove**), Result → Mission Complete, textos sem "DEMO".
- **Adicionadas (novas):** 3 Colour and Size, 7 Checkout Challenge (com CONFIRM PURCHASE).
- Fases no fluxo: **6 atividades** (etapas 2–7) + briefing + mission complete.
- Regras extras aplicadas: inglês britânico (colour, trainers, T-shirt), nenhuma
  ocorrência de "DEMO/placeholder" visível ao aluno.
