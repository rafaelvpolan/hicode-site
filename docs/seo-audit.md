# Auditoria de SEO — hicode-site

Escopo: todo o site. Checagem básica (title, meta description, headings, alt text, canonical)
mais os arquivos de indexação (`robots.txt`, `sitemap.xml`) e as tags de compartilhamento.
**Somente relatório — nenhuma correção aplicada.**

Apuração em 24/08/2026. Cada achado abaixo foi verificado no código-fonte, no `dist/`
construído e — onde há URL envolvida — por requisição HTTP real. Nada entra como suposição.

## Onde o site é servido

`origin` = `https://github.com/rafaelvpolan/hicode-site`. O `vite.config.ts` usa
`base: '/hicode-site/'` em build e o `.github/workflows/deploy.yml` publica `./dist` no
GitHub Pages, o que dá `https://rafaelvpolan.github.io/hicode-site/`.

Essa URL responde **404** hoje (`https://rafaelvpolan.github.io/` responde 200): o Pages
deste projeto não está publicando. Todos os endereços "corretos" apontados adiante assumem
essa URL como destino do deploy — mas ela ainda não serve o site.

---

## Críticos

### 1. `canonical` aponta para outro domínio

`index.html:9`

```html
<link rel="canonical" href="https://github.com/rafaelvpolan/hicode" />
```

A página se declara versão duplicada de uma URL em `github.com`. O Google desindexa a
landing e atribui todo o sinal ao repositório. Não existe canonical próprio em nenhum lugar
do projeto.

Destino correto: `https://rafaelvpolan.github.io/hicode-site/`.

Confirmado em `dist/index.html:9`: o Vite não reescreve URLs absolutas, então o erro chega
intacto ao artefato publicado.

### 2. A mesma URL errada se repete em `og:url` e no JSON-LD

- `index.html:17` — `og:url`. Todo compartilhamento resolve para o repo, não para o site.
- `index.html:32` — `"url"` do `SoftwareApplication` (bloco `index.html:26-47`).

Três declarações independentes de identidade da página apontam para fora do site. Além da
URL, o `SoftwareApplication` não tem a propriedade `image`.

### 3. `og:image`/`twitter:image` em SVG e com 404 confirmado

`index.html:18` e `index.html:24`

```html
<meta property="og:image" content="https://raw.githubusercontent.com/rafaelvpolan/hicode/main/public/og-image.svg" />
```

Duas falhas independentes, cada uma suficiente para matar o preview:

- **404 confirmado.** A URL aponta para o repo `hicode`; o arquivo vive em `hicode-site`.
  Probe: `.../hicode/main/public/og-image.svg` → `404`;
  `.../hicode-site/main/public/og-image.svg` → `200 image/svg+xml`.
- **Formato.** Facebook, X/Twitter, LinkedIn e WhatsApp não renderizam SVG em preview. Ainda
  que a URL fosse corrigida, o card sairia sem imagem.

O `og:image:width`/`height` (`index.html:19-20`) declaram 1200×630, que confere com o
`public/og-image.svg` real — mas nenhum scraper chega a ler a imagem.

Destino correto: um PNG 1200×630 servido pelo próprio domínio do site.

### 4. `sitemap.xml` lista URL de outro host

`public/sitemap.xml:4`

```xml
<loc>https://github.com/rafaelvpolan/hicode</loc>
```

Um sitemap só pode listar URLs do host que o serve; entrada cross-host é rejeitada. O
resultado é um sitemap que não indexa nada, e a única página real do site fora dele.
Também não há `<lastmod>`.

### 5. `robots.txt` inerte

`public/robots.txt:3`

```
Sitemap: https://github.com/rafaelvpolan/hicode/sitemap.xml
```

Dois problemas somados:

- A URL não existe. O sitemap é servido pelo Pages a partir de `public/`, não pelo repo `hicode`.
- Sendo um *project site*, o build vai para `/hicode-site/`, então o arquivo termina em
  `https://rafaelvpolan.github.io/hicode-site/robots.txt`. Crawler só lê `robots.txt` na raiz
  do host — o arquivo é ignorado por completo. Confirmado em `dist/`: `robots.txt` e
  `sitemap.xml` estão na raiz do artefato, que é publicada sob a base.

---

## Médios

### 6. Conteúdo existe apenas depois do JS

`index.html:50`

```html
<div id="app"><noscript>hiignation — gerenciador de projetos autônomo open source. Repositório: https://github.com/rafaelvpolan/hicode</noscript></div>
```

`dist/index.html` sai com `<body>` sem nenhum texto de conteúdo: `h1`, os nove `h2` e todo o
corpo são injetados pelo Vue em runtime. O Google renderiza JS, mas consumidores de HTML cru
(Bing parcialmente, scrapers de rede social, crawlers de LLM) recebem página vazia. O
`<noscript>` tem uma linha e não repete nem o `h1` nem a proposta de valor.

### 7. `meta description` acima do limite útil

`index.html:7` — **213 caracteres** (medido). O SERP corta em ~155–160, então a cauda
`executar → preview → aprovar → PR → deploy` nunca aparece.

---

## Baixos

### 8. Imagem social sem texto alternativo

Não existem `og:image:alt` nem `twitter:image:alt`. Também falta `twitter:site`.

### 9. Uma `<section>` sem heading

`src/App.vue:97` — `<section aria-label="Diferenciais do hiignation" class="belt-section">`
usa só `aria-label`. Sem heading, a seção não contribui com sinal de tópico.

É a única no site: as nove `<Section>` têm `h2` (`src/App.vue:106,126,145,157,169,181,194,221`
e `src/components/FinalCta.vue:16`).

### 10. Glifos decorativos lidos pelo leitor de tela

Emoji e setas sem `aria-hidden="true"`, então o leitor de tela anuncia "estrela branca média",
"coração roxo", "seta para a direita" junto do rótulo:

| Arquivo:linha | Glifo |
|---|---|
| `src/App.vue:62` | ⭐ (botão do GitHub na nav) |
| `src/App.vue:81` | → |
| `src/App.vue:82` | ⭐ |
| `src/App.vue:83` | 💖 |
| `src/App.vue:87` | ⭐ |
| `src/App.vue:88` | ⭐ |
| `src/App.vue:202` | ⭐ |
| `src/App.vue:204` | 💖 |
| `src/App.vue:246` | ⟳ (footer) |
| `src/components/AgentGrid.vue:9` | ⚖️ |
| `src/components/FinalCta.vue:22` | → |
| `src/components/FinalCta.vue:23` | ⭐ |
| `src/components/FinalCta.vue:24` | 💖 |

O padrão certo já existe no projeto e é seguido na maioria dos casos —
`src/App.vue:51,95,114,115,130,133,209,210`, `FeatureBelt.vue:8`, `FaqList.vue:9`,
`TelemetryHud.vue` (`conn-dot`, `alert-ic`), `ThrottleGauge.vue` (raiz), `ProcessFeed.vue`
(`TransitionGroup`), `Card.vue` (`card-accent`), `Field.vue` (`field-req`),
`CardLifecycle.vue` (`lc-index`). A lista acima são as exceções, concentradas em rótulo de
botão e no footer.

---

## Verificado sem problema

- **Alt text:** nenhuma tag `<img>` em `index.html` nem em `src/` (grep em todo o projeto).
  Toda a iconografia é emoji ou glifo, decorativa. Não há `alt` a corrigir; o resíduo é o
  `aria-hidden` do item 10.
- **Headings:** hierarquia válida, nenhum nível saltado. Um único `h1` (`src/App.vue:74`),
  um `h2` por seção, `h3` só dentro de seção que tem `h2` (`src/App.vue:116` em `#sobre`,
  `src/components/CardLifecycle.vue:19` em `#anatomia`).
- **`title`:** 52 caracteres (medido) — dentro do limite do SERP.
- **Consistência de títulos:** `title`, `og:title` e `twitter:title` idênticos
  (`index.html:6,15,22`).
- **`meta robots`:** `index, follow` (`index.html:11`).
- **`<html lang="pt-BR">`**, `meta charset`, `viewport`, `theme-color`: corretos.
- **`favicon`:** `href="/favicon.svg"` é reescrito pelo Vite para `/hicode-site/favicon.svg`
  em build (`dist/index.html:8`) — resolve certo sob a base.
- **`rel="noopener noreferrer"`** em todos os links externos.
- **Acessibilidade estrutural:** `LoopVsPrompt.vue:13` tem `<caption class="sr-only">`;
  `EngineConsole.vue:35` expõe o estado do motor via `role="status"` + `aria-live`.

---

## Oportunidades (não são erros)

- `src/faq.ts` tem 5 perguntas renderizadas por `FaqList.vue` em `<details>/<summary>`, sem
  structured data `FAQPage`. É o conteúdo do site mais elegível a rich result.
- `src/components/AgentGrid.vue` marca os 16 agentes como `<ul>/<li>` com `<span>` para id e
  domínio. É marcação válida e não é defeito — mas é a lista de entidades mais específica da
  página, e headings ali dariam sinal de tópico que hoje não existe.
