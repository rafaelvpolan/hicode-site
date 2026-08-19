# Auditoria de SEO — hicode-site

Escopo: todo o site. Checagem básica (title, meta description, headings, alt text, canonical)
mais os arquivos de indexação (`robots.txt`, `sitemap.xml`) e as tags de compartilhamento.
Somente relatório — nenhuma correção aplicada.

URL real de produção (derivada de `.github/workflows/deploy.yml` + `vite.config.ts` `base`):
`https://rafaelvpolan.github.io/hicode-site/`

---

## Críticos

### 1. `canonical` aponta para outro domínio

`index.html:9`

```html
<link rel="canonical" href="https://github.com/rafaelvpolan/hicode" />
```

A página se declara como versão duplicada de uma URL no `github.com`. O efeito é o pior
possível: o Google desindexa a landing e atribui todo o sinal ao repositório. Não existe
canonical próprio em nenhum lugar.

Correto: `https://rafaelvpolan.github.io/hicode-site/`.

### 2. `og:url` repete a URL errada

`index.html:17` — mesmo endereço do `canonical`. Todo compartilhamento resolve para o repo,
não para o site.

### 3. `sitemap.xml` lista URL de outro host

`public/sitemap.xml:4`

```xml
<loc>https://github.com/rafaelvpolan/hicode</loc>
```

Um sitemap só pode listar URLs do mesmo host em que é servido. Entrada cross-host é
rejeitada — o sitemap não indexa nada, e a única página real do site não está listada.
Sem `<lastmod>` também.

### 4. `robots.txt` inerte + Sitemap inexistente

`public/robots.txt:3`

```
Sitemap: https://github.com/rafaelvpolan/hicode/sitemap.xml
```

Dois problemas somados:

- A URL não existe (404). O sitemap está em `public/`, servido pelo Pages, não no repo `hicode`.
- Sendo um *project site* do GitHub Pages, o build é publicado sob `/hicode-site/`, então este
  arquivo termina em `/hicode-site/robots.txt`. `robots.txt` só é lido na raiz do host
  (`https://rafaelvpolan.github.io/robots.txt`) — o arquivo é ignorado por completo pelos
  crawlers. O mesmo vale para o `sitemap.xml`, que precisa ser referenciado pela URL sob a base.

### 5. Imagem social em SVG — nenhum preview renderiza

`index.html:18` e `index.html:24`

```html
<meta property="og:image" content="https://raw.githubusercontent.com/rafaelvpolan/hicode/main/public/og-image.svg" />
<meta name="twitter:image" content="…/og-image.svg" />
```

Três falhas encadeadas:

- **Formato:** Facebook, X/Twitter, LinkedIn e WhatsApp não aceitam SVG em preview. O card
  sai sem imagem, mesmo com `og:image:width/height` declarados como 1200×630 (dimensões que
  conferem com o arquivo, mas não são usadas).
- **Content-Type:** `raw.githubusercontent.com` serve SVG como `text/plain`, o que bloqueia o
  scraper mesmo onde houvesse suporte.
- **Repo errado:** a URL aponta para o repo `hicode`, mas `public/og-image.svg` vive em
  `hicode-site`. Provável 404 — confirmar.

Correto: exportar um PNG 1200×630 e servi-lo pelo próprio domínio do site.

---

## Médios

### 6. Conteúdo existe apenas depois do JS

`index.html:50`

```html
<div id="app"><noscript>hiignation — gerenciador de projetos autônomo open source. Repositório: https://github.com/rafaelvpolan/hicode</noscript></div>
```

SPA sem pré-renderização: `h1`, `h2`, headings de seção e todo o corpo de texto são injetados
pelo Vue em runtime. O Google renderiza JS, mas os demais consumidores de HTML cru (Bing
parcialmente, scrapers de rede social, crawlers de LLM) recebem uma página vazia. O
`<noscript>` tem uma linha e não repete nem o `h1` nem a proposta de valor.

### 7. `meta description` acima do limite útil

`index.html:7` — 213 caracteres. O SERP corta em ~155–160, então a cauda
(`executar → preview → aprovar → PR → deploy`) não aparece. O title está bem dimensionado
(52 caracteres).

### 8. JSON-LD com a mesma URL errada e sem imagem

`index.html:26-47` — `"url": "https://github.com/rafaelvpolan/hicode"` repete o erro do
canonical; falta a propriedade `image`. Com `offers` mas sem `aggregateRating`, o
`SoftwareApplication` não é elegível a rich result.

---

## Baixos

### 9. Imagem social sem texto alternativo

Não existem `og:image:alt` nem `twitter:image:alt`. Também falta `twitter:site`.

### 10. Duas `<section>` sem heading

`src/App.vue:97` (`.belt-section`) usa só `aria-label`, sem `h2`. Sem heading, a seção não
contribui com nenhum sinal de tópico. A hierarquia em si está correta: um único `h1`
(`src/App.vue:74`), um `h2` por seção, `h3` apenas dentro de seções com `h2`
(pilares e `CardLifecycle`) — nenhum nível saltado.

### 11. Nomes dos agentes não são headings

`src/components/AgentGrid.vue` — os 15 agentes usam `<span>` para id e domínio. É a lista de
entidades mais específica da página e não tem marcação semântica alguma.

### 12. Emoji sem `aria-hidden`

`src/components/AgentGrid.vue:5` — o `⚖️` de `⚖️ gate` é decorativo mas é lido pelo leitor de
tela como "balança". Todos os outros ícones da página (`src/App.vue:51,114,115,130`,
`FeatureBelt`, `FaqList`, `.stars-ic`) estão corretamente marcados com `aria-hidden="true"`.

---

## Sem problema encontrado

- **Alt text de imagens:** não existe nenhuma tag `<img>` no projeto. Toda a iconografia é
  emoji ou glifo, decorativa e marcada com `aria-hidden` (exceto o item 12).
- **Headings:** hierarquia válida, um único `h1`.
- **`<html lang="pt-BR">`**, `meta charset`, `viewport`, `theme-color`: corretos.
- **Consistência de títulos:** `title`, `og:title` e `twitter:title` idênticos.
- **`rel="noopener noreferrer"`** presente em todos os links externos.
- **`meta robots`:** `index, follow` — correto.

## Oportunidade (não é erro)

O site tem 5 perguntas em `src/faq.ts` renderizadas por `FaqList.vue` sem nenhum
`FAQPage` structured data.
