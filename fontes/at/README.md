# Código QR das faturas portuguesas — fontes oficiais

Usadas por `src/services/fatura-pt-service.ts` (testes: `src/testes/fatura-pt.test.ts`).

| Documento | Endereço | Obtido em | SHA-256 |
|---|---|---|---|
| AT — *Technical Specifications, Two-dimensional Bar Code – QR Code*, Portaria n.º 195/2020, versão 1.1 (outubro de 2020) | https://info.portaldasfinancas.gov.pt/en/tax-information/doing-business/invoicing-and-accounting-systems/qr-code/Documents/qr-code-technical-specifications.pdf | 2026-11-14 | `a80ba4025bafb8692a2ff443920f35beeddf24046f5b3cf30d033d463045d1b2` |
| Portaria n.º 195/2020, de 13 de agosto (texto no Portal das Finanças) | https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/Portaria_195_2020.pdf | 2026-11-14 | `f2f5be68ba8bbc019bc6a9b35b5f169da8640259aba1233bd9e8c7cee32fd1b8` |

Regras usadas (secções 3 e 4 da especificação):

- Campo = «código»«:»«valor», campos separados por «*», sempre pela ordem da tabela.
- Valores monetários em euros, com «.» decimal e duas casas, sem separador de milhares.
- Obrigatórios: A (NIF emitente), B, C, D (tipo SAF-T), E (estado), F (data AAAAMMDD), G (n.º), H (ATCUD),
  I1 (espaço fiscal; «0» = sem indicação de taxa de IVA), N (IVA + imposto do selo), O (total com impostos), Q, R.
- I/J/K 1–8: até três espaços fiscais (PT, PT-AC, PT-MA ou estrangeiros) com bases e IVA por taxa.
- L: valores não sujeitos / não tributáveis ou sem discriminação do imposto (ex.: regime da margem).

Os exemplos da secção 5 estão copiados nos testes. Se a AT publicar uma nova versão, atualize esta tabela,
o comentário do service e os testes.
