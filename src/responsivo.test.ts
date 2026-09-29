import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

function readSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf-8')
}

const styleSource = readSource('./style.css')
const appSource = readSource('./App.vue')
const finalCtaSource = readSource('./components/FinalCta.vue')

/** o corpo de uma regra ou media query, contando as chaves internas: `[^}]*` pararia na primeira chave aninhada */
function bodyOf(source: string, header: string): string {
  const at = source.indexOf(header)
  if (at === -1) return ''
  const open = source.indexOf('{', at + header.length)
  if (open === -1) return ''
  let depth = 0
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1
    else if (source[i] === '}') {
      depth -= 1
      if (depth === 0) return source.slice(open + 1, i)
    }
  }
  return ''
}

function sliceBetween(source: string, from: string, to: string): string {
  const start = source.indexOf(from)
  if (start === -1) return ''
  const end = source.indexOf(to, start + from.length)
  if (end === -1) return ''
  return source.slice(start, end)
}

describe('telefone — a pilha de botões é declarada uma vez, no global', () => {
  const phoneBlock = bodyOf(styleSource, '@media (max-width: 620px)')

  it('a varredura — encontra a media query de telefone em style.css', () => {
    expect(phoneBlock).not.toBe('')
  })

  it('.cta.is-stacked — no telefone — empilha os botões em coluna', () => {
    expect(phoneBlock).toMatch(/\.cta\.is-stacked\s*\{[^}]*flex-direction:\s*column/)
  })

  it('.cta.is-stacked — no telefone — estica cada botão de ponta a ponta', () => {
    expect(phoneBlock).toMatch(/\.cta\.is-stacked\s*>\s*\*\s*\{[^}]*width:\s*100%/)
  })

  it('.cta — sem o modificador — não empilha em largura nenhuma: a pilha é opt-in', () => {
    expect(bodyOf(styleSource, '\n.cta ')).not.toMatch(/flex-direction:\s*column/)
  })
})

describe('telefone — quem opta pela pilha, e quem fica de fora', () => {
  const openPanel = sliceBetween(appSource, 'id="open"', 'id="comece"')
  const stageSection = sliceBetween(appSource, 'id="topo"', '<div class="rail"')

  it('a varredura — encontra o painel #open e a seção do palco em App.vue', () => {
    expect(openPanel).not.toBe('')
    expect(stageSection).not.toBe('')
  })

  it('painel #open — penúltimo bloco do deck — opta pela pilha', () => {
    expect(openPanel).toMatch(/<div class="cta is-stacked">/)
  })

  it('FinalCta — último bloco do deck — opta pela pilha', () => {
    expect(finalCtaSource).toMatch(/<div class="cta is-stacked">/)
  })

  it('palco — primeiro bloco da página — fica de fora: o pedido era sobre os dois últimos', () => {
    expect(stageSection).toMatch(/<div class="cta">/)
    expect(stageSection).not.toMatch(/is-stacked/)
  })

  // conta só os empilhados: congelar o total de .cta faria um bloco novo e sem relação com a pilha reprovar sem haver regressão
  it('App.vue — no total — empilha um .cta e nenhum outro', () => {
    const stacked = [...appSource.matchAll(/<div class="cta[^"]*\bis-stacked\b[^"]*">/g)]

    expect(stacked).toHaveLength(1)
  })
})

describe('desktop — o menu encosta na direita sem quebrar a rolagem da nav', () => {
  const cmdbarRow = bodyOf(appSource, '\n.cmdbar-row')
  const phoneBlock = bodyOf(appSource, '@media (max-width: 900px)')

  it('a varredura — encontra a regra base do .cmdbar-row e o bloco estreito em App.vue', () => {
    expect(cmdbarRow).not.toBe('')
    expect(phoneBlock).not.toBe('')
  })

  it('.cmdbar-row — no desktop — dá à nav uma trilha do tamanho do conteúdo, que cede a zero quando aperta', () => {
    expect(cmdbarRow).toMatch(/grid-template-columns:\s*auto\s+minmax\(0,\s*max-content\)/)
  })

  it('.cmdbar-row — no desktop — joga a nav para a outra ponta da barra', () => {
    expect(cmdbarRow).toMatch(/justify-content:\s*space-between/)
  })

  it('.tabs — em largura nenhuma — usa flex-end: ele deixaria as primeiras abas inalcançáveis pela rolagem', () => {
    expect(appSource).not.toMatch(/\.tabs[^{]*\{[^}]*justify-content:\s*flex-end/)
  })

  it('.tab-gh — em largura nenhuma — carrega margem automática: a nav inteira já está na direita', () => {
    expect(appSource).not.toMatch(/\.tab-gh[^{]*\{[^}]*margin-left/)
  })

  it('.cmdbar-row — abaixo de 901px — volta a duas trilhas, com a marca e o hambúrguer nas pontas', () => {
    expect(phoneBlock).toMatch(/\.cmdbar-row\s*\{[^}]*grid-template-columns:\s*auto\s+auto/)
  })
})
