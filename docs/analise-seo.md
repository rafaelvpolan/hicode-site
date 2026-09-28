# Análise de SEO técnico — hicode-site

Data: 2026-09-04
Escopo: SEO técnico (meta tags, sitemap, robots.txt, dados estruturados), renderização/indexabilidade, semântica de headings, acessibilidade com impacto em SEO, performance de entrega e social preview.
Fora de escopo: nenhuma alteração de código, config ou asset — apenas este relatório.

Método: leitura direta de `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/og-image.svg`, `public/favicon.svg`, `vite.config.ts`, `.github/workflows/deploy.yml`, `src/App.vue`, os 17 componentes em `src/components/`, `src/faq.ts`, `src/main.ts`, `src/style.css`, `src/seo.test.ts`, `README.md`, `package.json`. Onde a leitura estática não bastava, o comportamento foi verificado empiricamente rodando `npm run build` (inspeção de `dist/index.html`, `dist/robots.txt`, `dist/sitemap.xml`) e `npx vitest run src/seo.test.ts`. O diretório `dist/` gerado foi removido após a inspeção; nenhum arquivo de código, config ou asset foi alterado.

---

## 1. O que já está correto

Estes pontos foram verificados e **não são achados** — evita repetir como problema o que já funciona.

1. **Canonical / og:url / JSON-LD `url` / `<loc>` do sitemap são idênticos e apontam para o site publicado**, não para o repositório do produto (`https://rafaelvpolan.github.io/hicode-site/`). Travado por teste: `src/seo.test.ts:45-57`.
2. **O repositório do produto está em `sameAs`, não em `url`** no JSON-LD (`index.html:36`). Travado por teste: `src/seo.test.ts:59-61`.
3. **`og:image`/`twitter:image` são URLs absolutas sob o domínio do site** e ambas declaram texto alternativo não vazio (`index.html:18,22,26-27`). Travado por teste: `src/seo.test.ts:64-79`.
4. **`robots.txt` anuncia o sitemap com a URL absoluta correta** do site (`public/robots.txt:3`). Travado por teste: `src/seo.test.ts:82-87`.
5. **`<title>` (48 caracteres) e `meta description` (137 caracteres)** ficam dentro dos limites que a suíte trava (60 e 160). Medido diretamente: `title.length === 48`, `description.length === 137`.
6. **`vite.config.ts` base de build (`/hicode-site/`) bate com o path da URL canônica.** Travado por teste: `src/seo.test.ts:104-107`.
7. **`og:image` declara `width`/`height` (1200×630) que batem com o `viewBox` real do SVG** (`public/og-image.svg:1`, `index.html:20-21`). Não há teste travando isso — ver seção 7.
8. **O caminho absoluto `/favicon.svg` (`index.html:8`) É reescrito corretamente pelo Vite no build.** Verificado empiricamente: `dist/index.html:8` após `npm run build` mostra `href="/hicode-site/favicon.svg"`. Isso descarta a hipótese de que referências absolutas a arquivos de `public/` quebrariam sob o `base` de produção — o Vite trata `<link rel="icon">` como referência de asset e aplica o prefixo do `base`.
9. **`title`/`description`/Open Graph/Twitter Card/JSON-LD são 100% estáticos no `<head>` do `index.html`**, não são injetados via JavaScript (não há `vue-meta`/`@unhead/vue` ou manipulação de `document.title` em `src/main.ts`). Isso significa que esses campos sobrevivem para crawlers que não executam JS — mitiga parcialmente o achado F3 (seção 2).
10. **Título único (`<h1>`) na página** — varredura em `src/App.vue` e nos 17 componentes de `src/components/`: 1 ocorrência de `<h1>` (`src/App.vue:100`), zero duplicidade.
11. **Zero `<img>` na aplicação** — varredura em `src/App.vue` + 17 componentes `.vue`: 0 ocorrências de `<img>`. Todo ícone é emoji em `<span aria-hidden="true">` ou glifo desenhado via CSS (`IsoBlock.vue`), não há `alt` para auditar porque não há elemento de imagem raster/vetor embutido no template.
12. **Zero `<svg>` inline nos templates Vue** — os únicos SVGs do projeto são arquivos estáticos em `public/` (`favicon.svg`, `og-image.svg`), referenciados por URL, não embutidos.
13. **Todos os `target="_blank"` vêm acompanhados de `rel="noopener noreferrer"`** — varredura: 13 ocorrências de `target="_blank"` em `src/App.vue` (10) e `src/components/FinalCta.vue` (3), todas as 13 pareadas com `rel="noopener noreferrer"`. Zero exceção.
14. **Zero âncora interna quebrada** — os 7 links de navegação em `tabs` (`src/App.vue:29-37`) e os links `#topo`, `#conteudo`, `#comece` resolvem para ids realmente presentes no template (`#sobre` App.vue:142, `#pipeline` :158, `#telemetria` :169, `#anatomia` :177, `#agentes` :185, `#faq` :193, `#open` :209, `#topo` :91, `#conteudo` :90, `#comece` :224).
15. **Sem `@font-face` / fontes web customizadas** (`src/style.css:104-106`): todas as pilhas de fonte (`--font-mono`, `--font-sans`, `--font-display`) usam apenas fontes de sistema (`ui-sans-serif`, `ui-monospace`, `system-ui`, `Bahnschrift` como fallback declarado, não carregado). Zero requisição de rede para fonte — elimina FOIT/FOUT como risco de LCP/CLS.
16. **Sem imagens de fundo carregadas via `url()`** em `src/style.css` — o fundo é 100% gradientes/`color-mix` em CSS, sem requisição de asset adicional.
17. **`<script type="module" src="/src/main.ts">` (`index.html:55`) já é adiado nativamente** pela especificação HTML (scripts `module` sempre executam após o parse do documento, equivalente a `defer`) — não é bloqueio de renderização adicional a corrigir.
18. **Bundle de produção é pequeno**: medido no build (`npm run build`), `dist/assets/index-*.js` = 102.22 kB (gzip 39.30 kB), `dist/assets/index-*.css` = 46.76 kB (gzip 8.92 kB). Não há JS/CSS de terceiros.
19. **FAQ usa `<details>/<summary>` nativo** (`src/components/FaqList.vue:7-13`), não um acordeão que esconde conteúdo do DOM via `display:none` controlado por JS — o Google trata conteúdo em `<details>` como conteúdo normal para indexação e ranking desde a atualização de 2023.

---

## 2. Achados

### [Crítico] F1 — `robots.txt` e `sitemap.xml` não ficam na raiz do domínio

**Onde**: `public/robots.txt:1-3`, `public/sitemap.xml:1-8`, confirmado no artefato de build: `dist/robots.txt` e `dist/sitemap.xml` são copiados byte a byte para a raiz de `dist/`, e o GitHub Pages publica `dist/` sob o path `/hicode-site/` do domínio `rafaelvpolan.github.io` (evidência: `dist/index.html:52-53` referencia `/hicode-site/assets/...`; ausência de `CNAME` em `public/` confirma que não há domínio próprio).

**Impacto concreto**: por especificação (RFC 9309), um `robots.txt` só é autoritativo para um crawler quando está na **raiz do domínio de origem** (`https://rafaelvpolan.github.io/robots.txt`). Esse caminho pertence a outro repositório (o site raiz do usuário `rafaelvpolan.github.io`), fora do controle deste projeto. O arquivo publicado por este repo (`https://rafaelvpolan.github.io/hicode-site/robots.txt`) é acessível manualmente, mas **crawlers bem-comportados não o descobrem automaticamente** — logo a diretiva `Sitemap:` (`public/robots.txt:3`) nunca é lida pelo mecanismo padrão de auto-descoberta de sitemap via robots.txt.

**Recomendação**: submeter a URL do sitemap (`https://rafaelvpolan.github.io/hicode-site/sitemap.xml`) diretamente no Google Search Console e no Bing Webmaster Tools — esse caminho de submissão manual ignora completamente a descoberta via robots.txt e resolve o problema sem tocar em código. Alternativamente, se houver acesso ao repositório que serve a raiz de `rafaelvpolan.github.io`, adicionar lá uma linha `Sitemap: https://rafaelvpolan.github.io/hicode-site/sitemap.xml`. Custo: zero mudança neste repositório, ação administrativa externa. Risco: nenhum.

Nota de manutenção relacionada: as URLs absolutas dentro de `public/robots.txt`, `public/sitemap.xml` e dos metas `og:image`/`canonical` são texto hardcoded — o Vite **não** as reescreve (só reescreve atributos de asset em `index.html`, como `href`/`src`). Se o `base` em `vite.config.ts:5` mudar no futuro, essas URLs precisam ser atualizadas manualmente em todos esses arquivos.

---

### [Crítico] F2 — `og:image`/`twitter:image` apontam para SVG, que Facebook, LinkedIn e X não renderizam

**Onde**: `index.html:18-19` (`og:image` + `og:image:type="image/svg+xml"`), `index.html:26` (`twitter:image`), arquivo real: `public/og-image.svg`.

**Impacto concreto**: as especificações de Open Graph consumidas pelo crawler do Facebook e pelo LinkedIn, e o Twitter Card Validator da X, não aceitam `image/svg+xml` como formato de preview — os formatos suportados são JPG/PNG/WEBP/GIF. Ao compartilhar `https://rafaelvpolan.github.io/hicode-site/` nessas três plataformas (que juntas cobrem a maior parte do tráfego social referenciado a projetos open source), o card de preview aparece **sem imagem** (ou com um placeholder genérico), reduzindo a taxa de clique dos compartilhamentos — justamente o cenário que as 6 linhas de `og:image:*`/`twitter:image:*` foram escritas para evitar.

**Recomendação**: gerar um PNG estático 1200×630 a partir do design já existente em `public/og-image.svg` (export manual ou script de build com `resvg`/`sharp`), publicar como `public/og-image.png`, e apontar `og:image` (`index.html:18`) e `twitter:image` (`index.html:26`) para essa nova URL, ajustando `og:image:type` para `image/png`. Custo: baixo (1 asset novo + edição de 3 linhas de meta). Risco: nenhum — não é mudança de comportamento, é troca de formato de um asset estático.

---

### [Alto] F3 — SPA client-side: `<div id="app">` fica vazio no HTML bruto; o `<noscript>` cobre só uma frase

**Onde**: `index.html:54` — `<div id="app"><noscript>hicode — gerenciador de projetos autônomo open source. Repositório: https://github.com/rafaelvpolan/hicode</noscript></div>`; `src/main.ts:5` — `createApp(App).mount('#app')` substitui esse conteúdo assim que o JS roda.

**Impacto concreto**: para qualquer crawler que **não executa JavaScript**, o único conteúdo textual do `<body>` é a frase única do `<noscript>` — uma linha. Todo o restante (o `<h1>` real, os 3 pilares de "O que é o hicode", os 6 passos do pipeline, a telemetria, a lista de agentes Nexus, as 5 perguntas e respostas do FAQ em `src/faq.ts`, o rodapé) é invisível para esses bots, porque só existe depois que o Vue monta a árvore de componentes. Isso inclui explicitamente os **crawlers de LLM** citados no escopo desta análise (GPTBot, ClaudeBot, PerplexityBot, CCBot, Amazonbot, Bytespider e afins) — a maioria desses agentes hoje faz apenas fetch de HTML bruto, sem renderização JS. Googlebot e Bingbot, por outro lado, executam JS via Chromium headless (indexação em duas ondas), então o risco para busca clássica é mais de **atraso/custo de renderização** do que de invisibilidade total — mas para os motores baseados em LLM/RAG, o conteúdo diferenciado do produto (o que é Loop Engineering, como funciona o pipeline, as respostas do FAQ) simplesmente não existe do ponto de vista deles hoje.

Mitigação parcial já existente: título, descrição, Open Graph, Twitter Card e o bloco JSON-LD **são** estáticos no `<head>` (ver item 9 da seção 1) — então esses crawlers ainda recebem nome do produto, descrição curta, categoria, licença e link do repositório, só não recebem o corpo da página.

**Recomendação**: dado que reescrever o pipeline de build para SSR/prerender (ex.: `vite-plugin-ssr`, prerender estático via Puppeteer no CI) é uma mudança arquitetural de custo alto e fora do escopo deste relatório, a mitigação de menor custo é o `llms.txt` (ver F4) — um resumo em texto plano dedicado a exatamente esse tipo de agente. Prerender/SSR fica registrado aqui como opção de maior custo, não recomendada para implementação imediata sem avaliação de esforço separada.

---

### [Alto] F4 — Ausência de `llms.txt`/`llms-full.txt`

**Onde**: confirmado por varredura — nenhum arquivo `llms.txt` ou `llms-full.txt` em `public/`, na raiz do repo, ou em qualquer subdiretório (`find . -iname "llms*.txt"` não retornou resultado, excluindo `node_modules`).

**O que é**: `llms.txt` é uma convenção informal (não é um padrão IETF/W3C, proposta por Jeremy Howard/Answer.AI em set/2024) de um arquivo markdown servido em `/llms.txt` na raiz do site, com um resumo curto e estruturado do propósito do site e links para as páginas/seções mais importantes — pensado para ser consumido por LLMs com orçamento de contexto limitado ou por crawlers que não processam HTML renderizado por JS. `llms-full.txt` é a variante estendida, com o conteúdo relevante já inlined em texto plano (sem precisar seguir links).

**Por que faz sentido aqui**: este é exatamente o perfil de site onde a convenção tem utilidade real — SPA sem HTML server-rendered (F3), produto voltado a desenvolvedores (mais provável de ser citado por assistentes de código/LLM), e conteúdo qualitativamente rico (explicação de Loop Engineering, pipeline, FAQ) que hoje só existe do lado do cliente.

**Recomendação (conteúdo/estrutura proposta, não implementar)**:
- `public/llms.txt` — markdown curto: H1 com o nome do produto, um blockquote de uma linha com o resumo (reaproveitando o texto de `index.html:7`), seção `## Docs` com link para o repositório GitHub (`https://github.com/rafaelvpolan/hicode`), seção `## FAQ` listando as 5 perguntas de `src/faq.ts` como bullets com link de âncora para `#faq`.
- `public/llms-full.txt` (opcional, segunda iteração) — mesma estrutura, mas com o texto completo de cada resposta do FAQ e a descrição dos 6 estágios do pipeline (`src/pipeline.ts`) inlined, para agentes que não seguem links.
- Custo: baixo (arquivo de texto estático, sem build step). Risco: nenhum — é aditivo, não altera comportamento existente. Requer manutenção manual para não divergir do conteúdo real de `src/faq.ts`/`src/pipeline.ts` ao longo do tempo (mesmo trade-off do F7).

---

### [Médio] F5 — Hierarquia de headings pula nível: h1 → h3 antes de qualquer h2

**Onde**: `src/App.vue:100` (único `<h1>` da página) é seguido, na ordem de renderização, pelos três primeiros `Panel`s do deck (`src/App.vue:125,129,133`), todos com `heading-level="h3"` explícito. O primeiro `<h2>` só aparece depois, no Panel `id="sobre"` (`src/App.vue:142`), que usa o valor padrão da prop (`Panel.vue:14`: `headingLevel: 'h2'`). O componente `Panel.vue:24` renderiza o título com `<component :is="headingLevel">`, então esses 3 painéis ("Sinais", "Ignição do motor", "Repositório") realmente emitem `<h3>Sinais</h3>`, `<h3>Ignição do motor</h3>`, `<h3>Repositório</h3>` como as primeiras headings depois do h1 — sem h2 intermediário.

**Impacto concreto**: leitores de tela que navegam por heading (`h` no NVDA/JAWS/VoiceOver) veem uma árvore de documento inconsistente (h1 → h3 → h3 → h3 → h2 → h2 → …), o que a WCAG 2.4.10/1.3.1 trata como falha de estrutura. Para SEO, isso não impede indexação, mas é um sinal de qualidade estrutural: mecanismos que constroem um "outline" semântico da página (usado para snippets em destaque e para segmentar passagens de conteúdo) recebem uma hierarquia quebrada logo nas primeiras seções da página.

**Recomendação**: nos 3 `Panel`s afetados (`src/App.vue:125,129,133`), remover o atributo `heading-level="h3"` e deixar o padrão `h2` — visualmente não muda nada, porque o estilo do título vem da classe `.panel-title` (`Panel.vue:95-106`), não da tag semântica. Fora do escopo deste relatório (é alteração de código); citado apenas como recomendação, não implementado.

---

### [Médio] F6 — JSON-LD `SoftwareApplication` sem `image`, `softwareVersion`, `inLanguage`

**Onde**: `index.html:29-51`. Campos presentes: `name`, `description`, `url`, `sameAs`, `applicationCategory`, `operatingSystem`, `license`, `author`, `offers`. Ausentes: `image`, `softwareVersion`, `inLanguage`.

**Impacto concreto**: `image` é o campo que o Google usa preferencialmente (por cima do `og:image`) para associar uma imagem ao item estruturado quando ele é elegível a algum rich result; sem ele, a associação depende inteiramente do fallback de Open Graph (que hoje tem o problema do F2). `inLanguage` ausente deixa ambíguo, para qualquer agregador que leia só o bloco JSON-LD sem olhar `html[lang]` (`index.html:2`), qual o idioma da entidade descrita. `softwareVersion` simplesmente não existe hoje no bloco.

**Recomendação**: adicionar os 3 campos ao objeto JSON-LD em `index.html:29-51`: `"image"` apontando para a URL absoluta do asset de preview (idealmente o PNG proposto no F2, não o SVG atual, pelo mesmo motivo de compatibilidade), `"inLanguage": "pt-BR"`, e `"softwareVersion"` referenciando a versão real do **produto hicode** — atenção: `package.json:4` (`"version": "0.1.0"`) é a versão deste repositório do *site*, e o rodapé (`src/App.vue:239`, texto literal `"⟳ hicode v0.1.0"`) hoje coincide por acaso, não por vínculo — confirmar a versão correta do produto antes de preencher para não publicar um número desatualizado ou fictício. Custo: baixo (edição de um bloco JSON estático). Risco: baixo, mas com dependência de manutenção manual.

---

### [Médio] F7 — FAQ visível na página sem `FAQPage` no JSON-LD

**Onde**: conteúdo em `src/faq.ts:6-27` (5 perguntas), renderizado em `src/components/FaqList.vue:7-13` via `<details>/<summary>` nativo (conteúdo totalmente visível/indexável, não é um acordeão que esconde via JS — ver item 19 da seção 1). Não existe nenhum bloco `FAQPage` em `index.html`.

**Impacto concreto, com ressalva**: há uma oportunidade real de marcar essas 5 perguntas como `FAQPage`/`mainEntity` no JSON-LD. Ressalva importante para não superestimar o ganho: **desde agosto de 2023 o Google restringiu o rich result de FAQ na busca a sites "bem estabelecidos e oficiais"** (majoritariamente governo e saúde) — a maioria dos sites comerciais e de ferramentas para desenvolvedores não recebe mais o snippet expandido de FAQ na SERP, mesmo com o markup correto. O ganho hoje é menor do que a recomendação genérica "adicione FAQPage" sugere: serve para compatibilidade futura (caso a política mude de novo) e para outros consumidores de JSON-LD (alguns cenários do Bing, agentes que leem dados estruturados diretamente).

**Recomendação**: adicionar um segundo bloco JSON-LD `FAQPage` (ou combinar com o existente via `@graph`) em `index.html`, com `mainEntity` derivado de `src/faq.ts`. Se implementado, decidir explicitamente entre hardcode manual (custo baixo, risco de desatualização se `src/faq.ts` mudar e o JSON-LD não acompanhar) ou geração do bloco a partir de `src/faq.ts` em build-time (custo médio, elimina o risco de divergência). Fora do escopo deste relatório — apenas recomendação.

---

### [Baixo] F8 — Sitemap sem `<lastmod>`; uma única URL é o comportamento correto

**Onde**: `public/sitemap.xml:1-8`.

**Avaliação de "mais URLs"**: descartado. A landing page tem seções ancoradas (`#sobre`, `#pipeline`, `#telemetria`, `#anatomia`, `#agentes`, `#faq`, `#open` — `src/App.vue:29-37`), não rotas HTTP distintas. A porção depois de `#` de uma URL nunca é enviada ao servidor e não constitui um recurso diferente para fins de sitemap — adicionar `https://.../hicode-site/#faq` como uma segunda `<url>` seria uma entrada duplicada do mesmo `<loc>` da home, sem benefício. Uma única URL no sitemap está correta para esta arquitetura de página única.

**Achado real**: ausência de `<lastmod>`. Isso ajuda crawlers a priorizar re-crawl quando o conteúdo muda; hoje não há sinal nenhum de quando a página foi atualizada pela última vez.

**Recomendação**: adicionar `<lastmod>YYYY-MM-DD</lastmod>` em `public/sitemap.xml`, atualizado manualmente a cada mudança relevante de conteúdo (ou automatizado por um passo do `.github/workflows/deploy.yml` que reescreve a data no momento do build — mudança de infraestrutura, fora do escopo deste relatório). Custo: baixíssimo. Risco: nenhum, mas exige disciplina de atualização para não ficar uma data "congelada" que sinalize conteúdo parado.

---

### [Baixo] F9 — Favicon só em SVG, sem `apple-touch-icon`

**Onde**: `index.html:8`, `public/favicon.svg`.

**Impacto concreto**: o Google Search já renderiza a página com Chromium headless para exibir o favicon nos resultados de busca, então SVG funciona para esse caso. O impacto real fica restrito a: (1) suporte parcial/inconsistente a favicon SVG em versões mais antigas do Safari; (2) sem `apple-touch-icon`, "Adicionar à Tela de Início" no iOS usa uma captura de tela genérica da página em vez de um ícone limpo. Não bloqueia indexação — é polimento de apresentação.

**Recomendação**: opcional. Adicionar `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` com um PNG 180×180 exportado do mesmo design de `public/favicon.svg`, caso se queira uma apresentação consistente em iOS. Custo baixo, risco nenhum.

---

## 3. Pontos avaliados e descartados (sem achado)

- **`hreflang`/idioma alternativo**: descartado. Varredura de todo o texto visível em `src/App.vue` e nos 17 componentes confirma site 100% em pt-BR (termos técnicos em inglês como "GitHub", "PR", "FAQ" não constituem uma variante de idioma). `html[lang="pt-BR"]` (`index.html:2`) já declara corretamente o único idioma publicado. `hreflang` existe para apontar variantes de idioma/região da *mesma* página — não há variante em inglês servida por este site (o README menciona o repositório do produto em inglês, mas README não é uma página HTML servida). Não é achado.
- **`twitter:site`/`twitter:creator`**: descartado. Exigem um handle @ institucional no X/Twitter; varredura confirma que não existe menção a nenhum perfil X/Twitter em nenhum lugar do repositório (`README.md`, `index.html`, JSON-LD `sameAs` só lista GitHub). Sem handle real, não há o que preencher — não é uma omissão, é ausência de pré-requisito.
- **`og:image:secure_url`**: descartado. É redundante quando `og:image` já é `https://` (`index.html:18`) — o Facebook trata a URL como segura automaticamente nesse caso. Ganho zero.
- **`theme-color` por `color-scheme`**: descartado. `index.html:28` declara um único `theme-color`. O site não tem tema claro — `src/style.css` define uma única paleta escura fixa, sem `@media (prefers-color-scheme: light)`. Uma segunda `theme-color` para um tema claro inexistente seria enganosa, não uma melhoria.

---

## 4. Tabela de priorização

| Achado | Severidade | Esforço |
|---|---|---|
| F1 — robots.txt/sitemap fora da raiz do domínio | Crítico | Baixíssimo (ação externa em GSC/Bing, sem código) |
| F2 — og:image/twitter:image em SVG | Crítico | Baixo (1 asset PNG + 3 linhas de meta) |
| F3 — corpo invisível para crawlers sem JS | Alto | Alto se for SSR/prerender; mitigação parcial via F4 é baixa |
| F4 — llms.txt/llms-full.txt ausentes | Alto | Baixo (1-2 arquivos de texto estático) |
| F5 — heading h1→h3 sem h2 intermediário | Médio | Baixíssimo (remover 3 atributos) |
| F6 — JSON-LD sem image/softwareVersion/inLanguage | Médio | Baixo (editar bloco JSON estático) |
| F7 — FAQ sem marcação FAQPage | Médio | Baixo a médio (hardcode vs. gerado do faq.ts) |
| F8 — sitemap sem `<lastmod>` | Baixo | Baixíssimo (1 tag XML) |
| F9 — favicon sem apple-touch-icon | Baixo | Baixo (1 PNG + 1 link tag) |

---

## 5. Cobertura de teste — o que `src/seo.test.ts` já trava e o que falta

**Já coberto** (13 testes, todos passando — verificado com `npx vitest run src/seo.test.ts`):
- Canonical, `og:url`, `url` do JSON-LD e `<loc>` do sitemap são idênticos e apontam para o site publicado.
- `sameAs` do JSON-LD contém a URL do repositório do produto.
- `og:image`/`twitter:image` são URLs absolutas sob o domínio do site.
- `og:image:alt`/`twitter:image:alt` não são vazios.
- `robots.txt` anuncia a URL correta do sitemap.
- `<title>` presente e ≤ 60 caracteres.
- `meta description` presente e ≤ 160 caracteres.
- `base` de build do `vite.config.ts` bate com o path da URL canônica.

**Não coberto** (gaps reais, não implementados aqui):
- Formato/tipo do `og:image`/`twitter:image` (nada impede reintroduzir um SVG — não trava o F2).
- Campos do JSON-LD além de `url`/`sameAs` (nenhuma asserção sobre `image`, `softwareVersion`, `inLanguage`, `FAQPage`).
- Hierarquia/ordem de headings (não há teste de DOM renderizado — `seo.test.ts` só faz regex sobre `index.html` estático, e o `<h1>` real vive dentro de `src/App.vue`, montado em runtime).
- Existência ou conteúdo de `llms.txt`/`llms-full.txt`.
- Presença de `rel="noopener noreferrer"` em todo `target="_blank"`.
- `<lastmod>` no sitemap.
- Integridade das âncoras internas (`tabs` em `src/App.vue` apontando para ids existentes).
- `html[lang]`.

---

## 6. Sugestões de teste (não implementadas — apenas indicação de onde travar regressão)

- Em `src/seo.test.ts`: asserir que `og:image`/`twitter:image` não terminam em `.svg` e que `og:image:type` não é `image/svg+xml` — trava regressão do F2.
- Em `src/seo.test.ts`: parsear o JSON-LD e asserir presença de `image`, `softwareVersion`, `inLanguage` (e, se implementado, um segundo objeto/`@graph` com `@type: "FAQPage"`) — trava regressão dos F6/F7.
- Em `src/seo.test.ts`: asserir que `sitemap.xml` contém `<lastmod>` em formato `YYYY-MM-DD` válido — trava regressão do F8.
- Novo teste (fora de `seo.test.ts`, precisa montar o componente com `@vue/test-utils`/`happy-dom` em vez de regex sobre HTML estático, já que o `<h1>` e os `<h2>`/`<h3>` só existem depois do Vue montar `src/App.vue`): asserir que a primeira heading depois do `<h1>` é um `<h2>`, não um `<h3>` — trava regressão do F5.
- Novo teste simples de regex sobre `src/App.vue`/`src/components/FinalCta.vue`: todo `target="_blank"` é seguido por `rel="noopener noreferrer"` no mesmo elemento — hoje é verdade (13/13), vale travar para não regredir.
- Novo teste de existência de arquivo: `public/llms.txt` existe e começa com `# ` (heading H1 markdown) — trava a recomendação do F4 quando/se for implementada.
