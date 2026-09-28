import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { pipeline, type PipelineStep } from './pipeline'
import { phaseIconKeys, strokeIconKeys } from './strokeIcons'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

function readSource(relativePath: string): string {
  return readFileSync(`${rootDir}/${relativePath}`, 'utf-8')
}

const pipelineSource = readSource('src/pipeline.ts')
const iconSource = readSource('src/components/StrokeIcon.vue')
const appSource = readSource('src/App.vue')

const GLYPH_RENDERED_BY_THE_OS = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u

const named = pipeline.map((step): [string, PipelineStep] => [step.k, step])
const handled = [...iconSource.matchAll(/props\.icon === '([a-z-]+)'/g)].map((match) => match[1])

function branchOf(key: string): string | null {
  const match = iconSource.match(new RegExp(`props\\.icon === '${key}'">([\\s\\S]*?)</template>`))
  return match === null ? null : match[1]
}

describe('as seis fases nomeiam o ícone por chave', () => {
  it('pipeline — definição — traz as seis fases', () => {
    expect(pipeline).toHaveLength(phaseIconKeys.length)
  })

  it.each(named)('pipeline — fase %s — usa uma chave do alfabeto de traço', (_k, step) => {
    expect(phaseIconKeys).toContain(step.icon)
  })

  it.each(named)('pipeline — fase %s — nomeia o ícone por chave, não por emoji', (_k, step) => {
    expect(step.icon).toMatch(/^[a-z][a-z-]*$/)
  })

  it('pipeline — todas as fases — cobrem as chaves de fase sem repetir', () => {
    expect([...pipeline.map((step) => step.icon)].sort()).toEqual([...phaseIconKeys].sort())
  })
})

describe('nenhum emoji sobrou nas fases', () => {
  const fields = pipeline.flatMap((step): Array<[string, string]> => [
    [`${step.k} · icon`, step.icon],
    [`${step.k} · k`, step.k],
    [`${step.k} · d`, step.d],
  ])

  it.each(fields)('pipeline — campo %s — não casa com a faixa de emoji', (_label, value) => {
    expect(value).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it('pipeline.ts — o fonte inteiro — não contém emoji', () => {
    expect(pipelineSource).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })
})

describe('cada fase renderiza o ramo de SVG da sua chave', () => {
  it.each(named)('StrokeIcon.vue — fase %s — tem ramo para a sua chave', (_k, step) => {
    expect(handled).toContain(step.icon)
  })

  it.each(named)('StrokeIcon.vue — fase %s — desenha traço, não um ramo vazio', (_k, step) => {
    expect(branchOf(step.icon)).toMatch(/<(path|rect|line)\b/)
  })

  it.each(named)('StrokeIcon.vue — fase %s — corre o traço por --iso-hover', (_k, step) => {
    expect(branchOf(step.icon)).toContain('stroke-icon-flow')
  })

  it('StrokeIcon.vue — as seis fases — têm desenhos distintos entre si', () => {
    const drawings = pipeline.map((step) => branchOf(step.icon))
    expect(new Set(drawings).size).toBe(drawings.length)
  })

  it('StrokeIcon.vue — os ramos — cobrem o alfabeto inteiro e nenhuma chave a mais', () => {
    expect([...handled].sort()).toEqual([...strokeIconKeys].sort())
  })

  it('StrokeIcon.vue — chave fora do alfabeto — cai num v-else visível, não num SVG vazio', () => {
    const fallback = iconSource.match(/<template v-else>([\s\S]*?)<\/template>/)
    expect(fallback).not.toBeNull()
    expect(fallback?.[1]).toMatch(/<(path|rect|line)\b/)
  })
})

describe('o card de fase responde a mouse e a teclado', () => {
  const card = appSource.match(/<ol class="steps">([\s\S]*?)<\/ol>/)

  it('App.vue — o card de fase — foi encontrado', () => {
    expect(card).not.toBeNull()
    expect(card?.[1]).toContain('in pipeline')
  })

  it('App.vue — o card de fase — renderiza StrokeIcon em vez de glifo do SO', () => {
    expect(card?.[1]).toContain('<StrokeIcon :icon="s.icon" />')
    expect(card?.[1]).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it('App.vue — o card de fase — é alcançável por teclado', () => {
    expect(card?.[1]).toMatch(/tabindex="0"/)
  })

  it('App.vue — o card de fase — dá ao foco o mesmo estado visual do hover', () => {
    const shared = appSource.match(/\.steps li:hover, \.steps li:focus-visible \{([^}]*)\}/)
    expect(shared).not.toBeNull()
    expect(shared?.[1]).toContain('--iso-hover: 1')
  })

  it('App.vue — o foco do card — tem anel visível apesar do clip-path', () => {
    const focusRule = appSource.match(/\n\.steps li:focus-visible \{([^}]*)\}/)
    expect(focusRule).not.toBeNull()
    expect(focusRule?.[1]).toContain('box-shadow: inset')
  })
})

const VUE_BUILTIN_TAGS = ['Transition', 'TransitionGroup', 'KeepAlive', 'Teleport', 'Suspense']

const componentNames = readdirSync(`${rootDir}/src/components`)
  .filter((file) => file.endsWith('.vue'))
  .map((file) => file.slice(0, -'.vue'.length))

function templateOf(source: string): string {
  const template = source.match(/\n<template>([\s\S]*)\n<\/template>/)
  if (template === null) throw new Error('o fonte não tem bloco <template> de nível de arquivo')
  return template[1]
}

function componentTagsOf(template: string): string[] {
  const tags = [...template.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)].map((match) => match[1])
  return [...new Set(tags)]
}

const appTemplate = templateOf(appSource)
const referencedComponents = componentTagsOf(appTemplate).filter(
  (tag) => !VUE_BUILTIN_TAGS.includes(tag),
)

function textOf(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function elementTextById(html: string, id: string): string {
  const element = html.match(new RegExp(`<([a-z]+)[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)</\\1>`))
  if (element === null) throw new Error(`nenhum elemento com id ${id} dentro do card`)
  return textOf(element[2])
}

function accessibleNameOf(card: string): string {
  const label = card.match(/\baria-label="([^"]*)"/)
  if (label !== null) return label[1].trim()

  const labelledby = card.match(/\baria-labelledby="([^"]*)"/)
  if (labelledby === null) throw new Error('o card não tem aria-label nem aria-labelledby')

  const ids = labelledby[1].split(/\s+/).filter((id) => id.length > 0)
  if (ids.length === 0) throw new Error('o aria-labelledby do card não aponta para id nenhum')

  return ids
    .map((id) => elementTextById(card, id))
    .join(' ')
    .trim()
}

function stepsListOf(html: string): string {
  const list = html.match(/<ol class="steps"[^>]*>[\s\S]*?<\/ol>/)
  if (list === null) throw new Error('a lista de fases não foi renderizada')
  return list[0]
}

function openingTagOf(chunk: string, tagName: string): string {
  const tag = chunk.match(new RegExp(`^<${tagName}[^>]*>`))
  if (tag === null) throw new Error(`o trecho não abre como <${tagName}>`)
  return tag[0]
}

function phaseCardsOf(list: string): string[] {
  return list.split(/(?=<li[\s>])/).filter((chunk) => chunk.startsWith('<li'))
}

function roleOf(openingTag: string): string | null {
  const role = openingTag.match(/\brole="([^"]*)"/)
  return role === null ? null : role[1]
}

function isFocusable(openingTag: string): boolean {
  return /\btabindex="0"/.test(openingTag)
}

const appHtml = await renderToString(createSSRApp(App))
const stepsList = stepsListOf(appHtml)
const phaseCards = phaseCardsOf(stepsList)
const indexedPhases = pipeline.map((step, index): [string, PipelineStep, number] => [
  step.k,
  step,
  index,
])

describe('o App.vue montado só cita componente que existe em src/components', () => {
  it('src/components — o diretório — entrega os componentes que o App.vue pode citar', () => {
    expect(componentNames.length).toBeGreaterThan(0)
  })

  it('App.vue — o template — cita pelo menos um componente', () => {
    expect(referencedComponents.length).toBeGreaterThan(0)
  })

  it.each(referencedComponents.map((name): [string] => [name]))(
    'App.vue — componente %s — tem arquivo em src/components',
    (name) => {
      expect(componentNames).toContain(name)
    },
  )

  it.each(referencedComponents.map((name): [string] => [name]))(
    'App.vue — componente %s — é importado pelo próprio <script setup>',
    (name) => {
      expect(appSource).toMatch(new RegExp(`import ${name} from '\\./components/${name}\\.vue'`))
    },
  )

  it('App.vue — o painel "Por que loops" — não abriga tag de componente nenhuma', () => {
    const panel = appTemplate.match(/<Panel id="por-que-loops"[\s\S]*?<\/Panel>/)
    expect(panel).not.toBeNull()
    expect(componentTagsOf(panel?.[0] ?? '')).toEqual(['Panel'])
  })
})

describe('cada card de fase montado anuncia o nome da própria fase', () => {
  it('a lista de fases — traz um card por fase', () => {
    expect(phaseCards).toHaveLength(pipeline.length)
  })

  it.each(indexedPhases)('fase %s — o card é focável', (_k, _s, i) => {
    expect(isFocusable(openingTagOf(phaseCards[i], 'li'))).toBe(true)
  })

  it.each(indexedPhases)('fase %s — o nome acessível sai do nome e da descrição', (_k, step, i) => {
    expect(accessibleNameOf(phaseCards[i])).toBe(`${step.k} ${step.d}`)
  })

  it.each(indexedPhases)('fase %s — o nome acessível não é vazio', (_k, _s, i) => {
    expect(accessibleNameOf(phaseCards[i]).length).toBeGreaterThan(0)
  })

  it('as seis fases — não repetem nome acessível entre si', () => {
    const names = phaseCards.map((card) => accessibleNameOf(card))
    expect(new Set(names).size).toBe(names.length)
  })

  it.each(indexedPhases)('fase %s — o card não aponta para id que não existe', (_k, _s, i) => {
    expect(() => accessibleNameOf(phaseCards[i])).not.toThrow()
  })
})

describe('a lista de fases montada continua uma lista', () => {
  it('a <ol class="steps"> — não troca o papel de lista', () => {
    expect(roleOf(openingTagOf(stepsList, 'ol'))).toBeNull()
  })

  it('a <ol class="steps"> — traz os seis itens', () => {
    expect(phaseCards).toHaveLength(phaseIconKeys.length)
  })

  it.each(indexedPhases)('fase %s — o card abre como <li>', (_k, _s, i) => {
    expect(() => openingTagOf(phaseCards[i], 'li')).not.toThrow()
  })

  it.each(indexedPhases)('fase %s — o card não ganha papel que o tire da lista', (_k, _s, i) => {
    const role = roleOf(openingTagOf(phaseCards[i], 'li'))
    expect(role === null || role === 'listitem').toBe(true)
  })

  it('a lista de fases — não esconde nenhum item do leitor', () => {
    expect(stepsList).not.toMatch(/<li[^>]*\baria-hidden="true"/)
  })
})

describe('o leitor do nome acessível reclama de entrada e de saída inválidas', () => {
  it('accessibleNameOf — card sem aria nenhum — recusa em vez de devolver nome vazio', () => {
    expect(() => accessibleNameOf('<li tabindex="0"><b>Executar</b></li>')).toThrow(
      /aria-label nem aria-labelledby/,
    )
  })

  it('accessibleNameOf — aria-labelledby vazio — recusa por não apontar para id nenhum', () => {
    expect(() => accessibleNameOf('<li aria-labelledby="  "><b>Executar</b></li>')).toThrow(
      /não aponta para id nenhum/,
    )
  })

  it('accessibleNameOf — id apontado que não existe — recusa nomeando o id', () => {
    expect(() => accessibleNameOf('<li aria-labelledby="fase-9-nome"><b>Executar</b></li>')).toThrow(
      /fase-9-nome/,
    )
  })

  it('accessibleNameOf — card com aria-label — usa o rótulo direto', () => {
    expect(accessibleNameOf('<li aria-label="Executar o card"><b>x</b></li>')).toBe(
      'Executar o card',
    )
  })

  it('accessibleNameOf — ids em sequência — junta os textos na ordem declarada', () => {
    const card =
      '<li aria-labelledby="a b"><b id="a">Executar</b><span id="b">roda o card</span></li>'

    expect(accessibleNameOf(card)).toBe('Executar roda o card')
  })

  it('textOf — marcação com comentário de SSR — devolve só o texto', () => {
    expect(textOf('<b><!--[-->Executar<!--]--></b>')).toBe('Executar')
  })

  it('stepsListOf — html sem a lista — recusa em vez de devolver trecho vazio', () => {
    expect(() => stepsListOf('<main></main>')).toThrow(/não foi renderizada/)
  })

  it('templateOf — fonte sem <template> — recusa em vez de devolver string vazia', () => {
    expect(() => templateOf('<script setup lang="ts"></script>')).toThrow(/<template>/)
  })

  it('componentTagsOf — template sem componente — devolve lista vazia', () => {
    expect(componentTagsOf('<div class="x"><p>texto</p></div>')).toEqual([])
  })
})
