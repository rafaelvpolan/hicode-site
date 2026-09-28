# Auditoria de SEO — hicode-site

Escopo: todo o site. `title`, `meta description`, headings, texto alternativo, canonical,
dados estruturados, arquivos de indexação (`robots.txt`, `sitemap.xml`) e tags de
compartilhamento. **Somente relatório — nenhuma correção aplicada.**

Apuração em **28/09/2026**, contra a `main` desta data. Cada achado foi verificado no
código-fonte; `arquivo:linha` cita a linha que existe hoje.

> **Esta apuração substitui a de 24/08/2026.** Entre as duas datas o site passou por um
> redesenho (`e62ba08`) que reescreveu o `App.vue` e removeu sete componentes, e por
> correções de SEO que resolveram a maior parte dos achados críticos originais. A seção
> seguinte registra o que saiu da lista, para o histórico não se perder.

## O que foi resolvido desde 24/08

| Achado original | Estado hoje |
|---|---|
| `canonical` apontava para `github.com/rafaelvpolan/hicode` | **resolvido** — `index.html:9` aponta para `https://rafaelvpolan.github.io/hicode-site/` |
| `og:url` e `url` do JSON-LD apontavam para o repositório | **resolvido** — `index.html:17` e `index.html:35` |
| `og:image`/`twitter:image` davam **404** (repo errado) | **resolvido** — servidos pelo próprio domínio do site |
| `sitemap.xml` listava URL de outro host | **resolvido** — `public/sitemap.xml` lista a URL do Pages |
| `meta description` com 213 caracteres | **resolvido** — 137 caracteres, dentro do corte do SERP |
| `og:image:alt` / `twitter:image:alt` ausentes | **resolvido** — `index.html:22` e `index.html:27` |
| `<section>` sem heading (`belt-section`) | **não se aplica** — a seção foi removida no redesenho |

---

## Críticos

### 1. Imagem social em SVG — nenhum scraper renderiza

`index.html:18` e `index.html:26`

```html
<meta property="og:image" content="https://rafaelvpolan.github.io/hicode-site/og-image.svg" />
```

A URL foi corrigida e responde. O **formato** não: Facebook, X/Twitter, LinkedIn e WhatsApp
não renderizam SVG em preview. O card de compartilhamento sai sem imagem hoje, exatamente
como saía quando a URL estava errada — a causa mudou, o efeito não.

`og:image:type` (`index.html:19`) declara `image/svg+xml`, então o problema está explícito no
próprio markup.

Destino correto: um **PNG 1200×630** servido pelo domínio do site. O `og:image:width`/`height`
(`index.html:20-21`) já declaram 1200×630 e conferem com o SVG real — só falta o rasterizado.

### 2. `robots.txt` é inalcançável por ser *project site*

`public/robots.txt`

```
Sitemap: https://rafaelvpolan.github.io/hicode-site/sitemap.xml
```

A URL do sitemap está certa. O arquivo é que não é lido: `vite.config.ts` usa
`base: '/hicode-site/'`, então o build publica o `robots.txt` em
`https://rafaelvpolan.github.io/hicode-site/robots.txt`. **Crawler só lê `robots.txt` na raiz
do host** — `https://rafaelvpolan.github.io/robots.txt` — que pertence ao *user site*, não a
este projeto.

Consequência: o `robots.txt` deste repositório é ignorado por completo, e com ele a única
declaração de onde vive o sitemap.

Saída possível: submeter o sitemap direto no Search Console, já que a descoberta por
`robots.txt` não tem como funcionar num project site. O arquivo pode ficar onde está — ele
não atrapalha, só não é lido.

---

## Médios

### 3. Conteúdo existe apenas depois do JS

`index.html:54`

```html
<div id="app"><noscript>hicode — gerenciador de projetos autônomo open source. Repositório: https://github.com/rafaelvpolan/hicode</noscript></div>
```

O `<body>` do HTML servido não tem nenhum texto de conteúdo: o `h1` e todas as seções são
injetados pelo Vue em runtime. O Google renderiza JS, mas consumidores de HTML cru — Bing
parcialmente, scrapers de rede social, crawlers de LLM — recebem página vazia.

O `<noscript>` tem uma linha e não repete nem o `h1` nem a proposta de valor.

### 4. `SoftwareApplication` sem `image`

`index.html:29-51`

O bloco JSON-LD declara `name`, `description`, `url`, `sameAs`, `applicationCategory`,
`operatingSystem`, `license`, `author` e `offers` — está correto e completo em identidade.
Falta a propriedade `image`, que é o que alimenta thumbnail em rich result.

---

## Baixos

### 5. `twitter:site` ausente

`index.html:23-27` traz `twitter:card`, `title`, `description`, `image` e `image:alt`, mas não
`twitter:site`. Sem ele o card não atribui autoria a uma conta.

### 6. `sitemap.xml` sem `<lastmod>`

`public/sitemap.xml` tem `<loc>`, `<changefreq>` e `<priority>`, e nenhum `<lastmod>`. Num
sitemap de uma URL só o ganho é pequeno, mas é o sinal que informa recrawl.

### 7. Glifos decorativos lidos pelo leitor de tela

Emoji e setas sem `aria-hidden="true"`, então o leitor de tela anuncia "estrela branca média",
"coração brilhante" ou "seta para a direita" junto do rótulo do botão:

| Arquivo:linha | Glifo | Onde |
|---|---|---|
| `src/App.vue:76` | ⭐ | botão do GitHub na nav |
| `src/App.vue:113` | → | texto do hero |
| `src/App.vue:117` | → | botão "Ver no GitHub" |
| `src/App.vue:118` | ⭐ | botão "Dar uma estrela" |
| `src/App.vue:122` | ⭐ | linha de contagem de estrelas |
| `src/App.vue:123` | ⭐ | linha de contagem de estrelas |
| `src/App.vue:190` | ⭐ | botão "Star" |
| `src/App.vue:192` | 💖 | botão "Doar / Sponsor" |
| `src/App.vue:208` | ↑ | botão de voltar ao topo |
| `src/components/FinalCta.vue:24` | → | botão "Começar no GitHub" |
| `src/components/FinalCta.vue:25` | ⭐ | botão "Dar uma estrela" |
| `src/components/FinalCta.vue:26` | 💖 | botão "Apoiar" |

O padrão certo já existe no projeto e é seguido na maioria dos casos — `Card.vue`
(`card-accent`), `Field.vue` (`field-req`), `FaqList.vue`, e todos os `aria-hidden` do
`App.vue`. A lista acima são as exceções, concentradas em rótulo de botão.

---

## Verificado sem problema

- **`title`:** 48 caracteres — dentro do limite do SERP.
- **`meta description`:** 137 caracteres — não é cortada.
- **Consistência de títulos:** `title`, `og:title` e `twitter:title` idênticos.
- **`canonical`, `og:url`, `url` do JSON-LD:** as três apontam para a mesma URL do site.
- **`meta robots`:** `index, follow`.
- **`<html lang="pt-BR">`**, `charset`, `viewport`, `theme-color`: corretos.
- **Alt text:** nenhuma tag `<img>` em `index.html` nem em `src/` — toda a iconografia é SVG
  inline decorativo (`BrandMark.vue`, `StrokeIcon.vue`), já com `aria-hidden` e
  `focusable="false"`. Não há `alt` a corrigir; o resíduo é o item 7.
- **Headings:** hierarquia válida, nenhum nível saltado. Um `h1` (`src/App.vue:107`), um `h2`
  por painel via a prop `title` do `Panel`, `h3` só dentro de painel que tem `h2`.
- **Nenhuma `<section>` sem heading.**
- **`favicon`:** `href="/favicon.svg"` é reescrito pelo Vite para `/hicode-site/favicon.svg`
  em build — resolve certo sob a base.
- **`rel="noopener noreferrer"`** em todos os links externos.

---

## Oportunidades (não são erros)

- **`FAQPage`.** `src/faq.ts` alimenta `FaqList.vue` em `<details>/<summary>`. É o conteúdo do
  site mais elegível a rich result, e não tem structured data.
- **Headings no `AgentGrid`.** `src/components/AgentGrid.vue` marca os agentes como `<ul>/<li>`
  com `<span>` para id e domínio. É marcação válida e não é defeito — mas é a lista de
  entidades mais específica da página, e headings ali dariam sinal de tópico que hoje não
  existe.
- **`og-image` rasterizado resolve dois itens.** Gerar o PNG 1200×630 fecha o crítico 1 e dá o
  `image` que falta ao JSON-LD (item 4), com um arquivo só.
