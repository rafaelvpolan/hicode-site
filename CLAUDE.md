<!-- hii:inicio — gerado por `hii projetar`; edite .hii/rules.md, nao este bloco -->
## Regras do projeto (fonte: .hii/rules.md)

# Regras do projeto para o motor hii

Site institucional do hicode: Vite + Vue 3 + TypeScript, publicado no GitHub Pages pelo workflow `.github/workflows/deploy.yml` a cada push em `main`.

- Componentes em Vue 3 com `<script setup lang="ts">` e Composition API; logica reutilizavel em composables `src/use*.ts`.
- Todo comportamento novo em `src/` ganha teste vitest ao lado (`src/**/*.test.ts`); rode `npm run test` e `npm run build` (o build roda `vue-tsc --noEmit`).
- Nada de `any`; tipos explicitos nas funcoes exportadas.
- SEO e metadados ficam em `index.html` e `public/` (robots, sitemap, og-image); mantenha-os coerentes com o conteudo.
- Nao adicione dependencias de runtime sem necessidade; o site e estatico.

## Memoria do projeto

Leia .hii/memory/ antes de mudar convencoes, e registre ali as decisoes duraveis.
<!-- hii:fim -->
