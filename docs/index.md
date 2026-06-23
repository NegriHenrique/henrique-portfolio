# Mapeamento Arquitetural — Henrique Portfolio

> Documento canônico de governança técnica. Qualquer decisão que contradiga este mapa precisa de um registro formal no `DECISION_LOG.md`.

---

## 1. Entry Point

| Propriedade | Valor |
|---|---|
| **Arquivo** | `src/pages/index.astro` |
| **Layout** | `src/layouts/BaseLayout.astro` |
| **Tipo** | Astro Island Architecture (MPA com hidratação parcial) |

O `index.astro` é o ponto de entrada único da aplicação. Ele orquestra os componentes de seção como ilhas independentes, delegando ao Astro o controle de quando e como o JavaScript de cada ilha é carregado.

---

## 2. Regra de Hidratação

### Princípio

> **Menos JavaScript = mais performance.**
> Cada byte de JS enviado ao navegador precisa justificar sua existência.

### Diretivas Permitidas

| Diretiva | Uso Autorizado | Justificativa |
|---|---|---|
| `client:load` | **Apenas `<Hero />`** | Componente above-the-fold que exige interatividade imediata para a primeira impressão do usuário. |
| `client:visible` | Componentes below-the-fold (`About`, `Skills`, `Lab`, `Contact`) | Adia o download e execução do JS até o componente entrar no viewport. Reduz o bundle inicial e melhora LCP/TBT. |
| `client:idle` | Casos excepcionais com justificativa documentada | Carrega JS após o browser ficar idle. Usar somente quando `client:visible` não for suficiente. |
| `client:media` | Componentes condicionais por breakpoint | Carrega JS apenas quando a media query corresponde. |
| _(sem diretiva)_ | Componentes puramente estáticos | **Padrão preferido.** Renderiza HTML sem enviar nenhum JS ao client. |

### Regras Estritas

1. **`client:load` é proibido** em qualquer componente que não seja o `Hero`. Qualquer exceção requer aprovação formal e registro no `DECISION_LOG.md`.
2. **Priorizar estado estático**: se um componente pode funcionar sem JavaScript no client, ele **não deve** receber diretiva de hidratação.
3. **`client:visible` é o padrão** para componentes interativos below-the-fold.
4. Componentes Astro nativos (`.astro`) **nunca** recebem diretivas — eles já são estáticos por natureza.

### Budget de Performance

| Métrica | Target |
|---|---|
| Lighthouse Score | > 95 |
| LCP | < 2.0s |
| TBT | < 200ms |
| CLS | < 0.1 |

---

## 3. Estado Global — Zustand

### Decisão

Zustand é a solução adotada para gerenciamento de estado global no client-side. A escolha se justifica por:

- **Bundle mínimo** (~1kB gzipped) — alinhado com o budget de performance
- **Zero boilerplate** — sem providers, reducers ou action creators
- **Compatível com React 19** e com a arquitetura de ilhas do Astro
- **API baseada em hooks** — idiomatic React

### Store Principal

| Arquivo | Responsabilidade |
|---|---|
| `src/store/useAppStore.ts` | Estado global da aplicação (feature flags, preferências de UI) |

### Regras de Uso

1. **Estado no server é proibido no Zustand.** O store só existe no client. Dados estáticos devem vir de Content Collections ou props do Astro.
2. **Granularidade**: preferir stores pequenos e focados a um store monolítico.
3. **Seletores**: sempre usar seletores para evitar re-renders desnecessários.
4. **Tipagem**: todo estado e ação deve ser tipado com TypeScript strict.

---

## Referências Internas

- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — Contexto geral do projeto
- [ENGINEERING_PRINCIPLES.md](./ENGINEERING_PRINCIPLES.md) — Princípios de engenharia
- [DECISION_LOG.md](./DECISION_LOG.md) — Registro de decisões arquiteturais
- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) — Tokens de design
