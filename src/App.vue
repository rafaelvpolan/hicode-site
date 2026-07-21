<script setup lang="ts">
import { pipeline, stepStyle } from './pipeline'
import { useGithubStars } from './useGithubStars'
import { useScrollTop } from './useScrollTop'
import EngineConsole from './components/EngineConsole.vue'

const repoUrl = 'https://github.com/rafaelvpolan/hicode'
const starUrl = `${repoUrl}/stargazers`
const sponsorUrl = 'https://github.com/sponsors/rafaelvpolan'

const { stars, loadingStars, fmtStars } = useGithubStars()
const { showScrollTop, scrollToTop } = useScrollTop()

const pillars = [
  {
    icon: '🔁',
    title: 'Loop Engineering',
    text: 'Você para de promptar o agente e passa a desenhar o loop que o prompta. O estado vive em disco: o agente esquece, o repo lembra.',
  },
  {
    icon: '🧩',
    title: 'Agentes Nexus',
    text: '15 agentes de escopo estreito (código, testes, segurança, banco, frontend…) e um gate adversarial, o Crivo, que aprova ou bloqueia o trabalho.',
  },
  {
    icon: '👁️',
    title: 'Executar primeiro',
    text: 'Primeiro a tarefa funciona e você vê o preview; só depois vêm arquitetura, testes e limpeza. Valida-se a intenção cedo.',
  },
]

function pillarTag(index: number): string {
  return `PILLAR_${String(index + 1).padStart(2, '0')}`
}

function stageTag(index: number): string {
  return `STAGE_${String(index + 1).padStart(2, '0')}`
}
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>

  <div class="topbar">
    <div class="test-banner" role="status" aria-live="polite">versao de testes</div>

    <header class="nav">
    <div class="wrap navwrap">
      <a class="brand" href="#topo" aria-label="hiignation">
        <span class="logo" aria-hidden="true">⟳</span> hiignation<span class="beta">beta</span>
      </a>
      <nav class="navlinks" aria-label="Navegação principal">
        <a href="#sobre">O que é</a>
        <a href="#pipeline">Pipeline</a>
        <a href="#open">Open source</a>
        <a :href="`${repoUrl}#readme`" target="_blank" rel="noopener noreferrer">Docs</a>
        <a class="ghbtn" :href="repoUrl" target="_blank" rel="noopener noreferrer">
          ⭐ <span v-if="loadingStars">…</span><span v-else>{{ stars === null ? 'GitHub' : fmtStars(stars) }}</span>
        </a>
      </nav>
    </div>
  </header>
  </div>

  <main id="conteudo">
    <section id="topo" class="hero">
      <div class="wrap">
        <p class="badge">open source · MIT</p>
        <h1>Prompts resolvem tarefas.<br /><span class="grad">Loops inteligentes constroem sistemas.</span></h1>
        <p class="sub">
          <strong>hiignation</strong> é um gerenciador de projetos autônomo com IA. Cada tarefa vira um
          card que percorre <em>executar → preview → aprovar → PR → deploy</em> — com agentes
          especializados fazendo o trabalho e um gate adversarial garantindo a qualidade.
        </p>
        <div class="cta">
          <a class="btn primary" :href="repoUrl" target="_blank" rel="noopener noreferrer">Ver no GitHub →</a>
          <a class="btn" :href="starUrl" target="_blank" rel="noopener noreferrer">⭐ Dar uma estrela</a>
          <a class="btn pink" :href="sponsorUrl" target="_blank" rel="noopener noreferrer">💖 Apoiar</a>
        </div>
        <p class="starline" aria-live="polite">
          <template v-if="loadingStars">Carregando estrelas…</template>
          <template v-else-if="stars === null">⭐ Seja a primeira estrela do projeto.</template>
          <template v-else>⭐ {{ fmtStars(stars) }} {{ stars === 1 ? 'estrela' : 'estrelas' }} no GitHub</template>
        </p>

        <EngineConsole />
      </div>
    </section>

    <div class="hazard-strip" aria-hidden="true"></div>

    <section id="sobre" class="block">
      <div class="wrap">
        <h2>O que é o hiignation</h2>
        <p class="lead">
          Funde <strong>Loop Engineering</strong> com o framework de agentes <strong>Nexus</strong>:
          um loop determinístico descobre o trabalho, executa por card, mostra o resultado e abre o PR.
          A única porta humana obrigatória é o merge.
        </p>
        <div class="cards">
          <article v-for="(p, i) in pillars" :key="p.title" class="card">
            <span class="card-tag" aria-hidden="true">{{ pillarTag(i) }}</span>
            <span class="ic" aria-hidden="true">{{ p.icon }}</span>
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="pipeline" class="block alt">
      <div class="wrap">
        <h2>O pipeline</h2>
        <p class="lead">Executar primeiro, polir depois. Você vê o resultado antes de gastar esforço com testes e limpeza.</p>
        <ol class="steps">
          <li v-for="(s, i) in pipeline" :key="s.k" :style="'--stage-color: ' + s.color">
            <span class="stage-tag" aria-hidden="true">{{ stageTag(i) }}</span>
            <span
              class="n"
              :style="stepStyle(s)"
              aria-hidden="true"
            >{{ s.icon }}</span>
            <div><b>{{ s.k }}</b><span>{{ s.d }}</span></div>
          </li>
        </ol>
      </div>
    </section>

    <section id="open" class="block">
      <div class="wrap donate">
        <div class="donate-text">
          <h2>Projeto open source</h2>
          <p>
            O hiignation é livre e construído à vista de todos. Se ele te ajuda, a melhor forma de
            retribuir é <strong>deixar uma estrela</strong> (ajuda outras pessoas a encontrarem) e,
            se puder, <strong>apoiar o desenvolvimento</strong>.
          </p>
          <div class="cta">
            <a class="btn star" :href="starUrl" target="_blank" rel="noopener noreferrer">
              ⭐ Star <span v-if="!loadingStars && stars !== null">· {{ fmtStars(stars) }}</span>
            </a>
            <a class="btn pink" :href="sponsorUrl" target="_blank" rel="noopener noreferrer">💖 Doar / Sponsor</a>
            <a class="btn" :href="repoUrl" target="_blank" rel="noopener noreferrer">Contribuir no repo</a>
          </div>
        </div>
        <aside class="starcard" aria-label="Estrelas no GitHub">
          <span class="stars-ic" aria-hidden="true">⭐⭐⭐</span>
          <span class="big">{{ loadingStars ? '…' : (stars === null ? '★' : fmtStars(stars)) }}</span>
          <span class="lbl">estrelas no GitHub</span>
          <a class="btn star sm" :href="starUrl" target="_blank" rel="noopener noreferrer">Apoiar com 1 clique</a>
        </aside>
      </div>
    </section>
  </main>

  <button
    v-show="showScrollTop"
    class="scroll-top"
    aria-label="Voltar ao topo"
    @click="scrollToTop"
  >↑</button>

  <footer class="foot">
    <div class="wrap footwrap">
      <span>⟳ <strong>hiignation</strong> — gerenciador de projetos autônomo</span>
      <span class="dim">
        <a :href="repoUrl" target="_blank" rel="noopener noreferrer">GitHub</a> ·
        <a :href="sponsorUrl" target="_blank" rel="noopener noreferrer">Apoiar</a> ·
        open source
      </span>
    </div>
    <p class="made">feito com hiignation</p>
  </footer>
</template>

<style scoped>
.wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 20px; width: 100%; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

.topbar { position: sticky; top: 0; z-index: 20; }
.test-banner { position: relative; background: var(--hazard); color: #1a1206; font-family: var(--font-mono); font-weight: 800; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; text-align: center; padding: 7px 0; }
.test-banner::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 4px; background: repeating-linear-gradient(135deg, #1a1206 0 8px, transparent 8px 16px); opacity: .5; }

.skip { position: absolute; left: -999px; }
.skip:focus { left: 12px; top: 12px; background: var(--acc); color: #fff; padding: 8px 12px; border-radius: 8px; z-index: 50; }

.nav { backdrop-filter: blur(10px); background: rgba(8, 9, 12, .78); border-bottom: 1px solid var(--bd); }
.navwrap { display: flex; align-items: center; justify-content: space-between; height: 60px; }
.brand { color: var(--tx); font-weight: 700; font-size: 18px; }
.brand:hover { text-decoration: none; }
.logo { color: var(--acc); }
.beta { margin-left: 7px; font-family: var(--font-mono); font-size: 11px; font-weight: 400; letter-spacing: .06em; text-transform: uppercase; color: var(--mut); background: var(--panel2); border: 1px solid var(--bd); border-radius: 3px; padding: 1px 6px; vertical-align: middle; }
.navlinks { display: flex; align-items: center; gap: 18px; }
.navlinks a { color: var(--mut); font-size: 14px; }
.navlinks a:hover { color: var(--tx); text-decoration: none; }
.ghbtn { display: inline-flex; gap: 6px; align-items: center; background: var(--panel2); border: 1px solid var(--bd); color: var(--tx) !important; padding: 6px 12px; border-radius: 3px; font-weight: 600; }
@media (max-width: 620px) { .navlinks a:not(.ghbtn) { display: none; } }

.hero { padding: clamp(56px, 12vw, 120px) 0 clamp(40px, 8vw, 80px); text-align: center; }
.badge { display: inline-block; font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--ok); border: 1px solid color-mix(in srgb, var(--ok) 40%, transparent); border-radius: 3px; padding: 4px 12px; margin: 0 0 22px; }
.hero h1 { font-size: clamp(30px, 6vw, 56px); margin: 0 0 18px; letter-spacing: -.02em; }
.grad { background: linear-gradient(90deg, var(--acc), var(--acc2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.sub { max-width: 680px; margin: 0 auto 28px; color: #c9d1d9; font-size: clamp(15px, 2.4vw, 19px); }
.cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.btn { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .04em; background: var(--panel2); border: 1px solid var(--bd); color: var(--tx); padding: 11px 18px; clip-path: polygon(9px 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 9px); font-weight: 700; font-size: 14px; transition: transform .06s ease, border-color .15s ease; }
.btn:hover { text-decoration: none; border-color: var(--acc); transform: translateY(-1px); }
.btn.primary { background: linear-gradient(180deg, var(--acc2), var(--acc)); border-color: var(--acc); color: #1a0b02; }
.btn.primary:hover { filter: brightness(1.08); }
.btn.pink { border-color: color-mix(in srgb, var(--pink) 55%, transparent); color: #ffd9e2; }
.btn.pink:hover { border-color: var(--pink); }
.btn.star { --star-glow-rest: 0 0 0 2px color-mix(in srgb, var(--gold-bright) 75%, transparent), 0 6px 28px color-mix(in srgb, var(--gold-bright) 65%, transparent), 0 0 40px color-mix(in srgb, var(--gold-bright) 35%, transparent); --star-glow-peak: 0 0 0 2px color-mix(in srgb, var(--gold-bright) 95%, transparent), 0 6px 34px color-mix(in srgb, var(--gold-bright) 80%, transparent), 0 0 60px color-mix(in srgb, var(--gold-bright) 55%, transparent); clip-path: none; border-radius: 10px; background: linear-gradient(180deg, var(--gold-bright2), var(--gold-bright)); border-color: var(--gold-bright); color: #2b1d00; box-shadow: var(--star-glow-rest); animation: starBtnGlow 2.4s ease-in-out infinite; }
.btn.star:hover { background: linear-gradient(180deg, #fff2b8, var(--gold-bright2)); border-color: var(--gold-bright2); box-shadow: 0 0 0 2px var(--gold-bright2), 0 8px 34px color-mix(in srgb, var(--gold-bright) 85%, transparent), 0 0 50px color-mix(in srgb, var(--gold-bright) 50%, transparent); animation-play-state: paused; }
.btn.sm { padding: 8px 14px; font-size: 13px; }
.starline { margin-top: 22px; color: var(--mut); font-size: 14px; }

.hazard-strip { height: 6px; background: repeating-linear-gradient(135deg, var(--hazard) 0 14px, #000 14px 28px); opacity: .5; }

.block { padding: clamp(48px, 9vw, 88px) 0; }
.block.alt { background: var(--bg2); border-top: 1px solid var(--bd); border-bottom: 1px solid var(--bd); }
.block h2 { font-size: clamp(24px, 4vw, 34px); margin: 0 0 10px; }
.lead { color: var(--mut); max-width: 720px; margin: 0 0 32px; font-size: 17px; }

.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 820px) { .cards { grid-template-columns: 1fr; } }
.card { position: relative; background: var(--panel); border: 1px solid var(--bd); clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut)); padding: 24px 22px 22px; }
.card-tag { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: .18em; color: var(--mut); margin-bottom: 10px; }
.card .ic { font-size: 26px; }
.card h3 { margin: 12px 0 8px; font-size: 19px; }
.card p { margin: 0; color: var(--mut); }

.steps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 820px) { .steps { grid-template-columns: 1fr; } }
.steps li { position: relative; display: flex; gap: 14px; align-items: flex-start; background: var(--panel); border: 1px solid var(--bd); border-left: 3px solid var(--stage-color, var(--acc)); clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut)); padding: 18px 20px; }
.stage-tag { position: absolute; top: 10px; right: 16px; font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em; color: var(--stage-color, var(--acc)); }
.steps .n { flex: 0 0 auto; width: 30px; height: 30px; border-radius: 6px; border: 1px solid transparent; font-size: 15px; line-height: 1; display: grid; place-items: center; }
.steps b { display: block; }
.steps span { color: var(--mut); font-size: 14px; }

.donate { display: grid; grid-template-columns: 1.6fr 1fr; gap: 28px; align-items: center; }
@media (max-width: 820px) { .donate { grid-template-columns: 1fr; } }
.donate-text p { color: var(--mut); max-width: 560px; }
.starcard { --starcard-glow-rest: 0 0 0 1px color-mix(in srgb, var(--gold-bright) 45%, transparent), 0 0 70px color-mix(in srgb, var(--gold-bright) 40%, transparent), 0 0 130px color-mix(in srgb, var(--gold-bright) 20%, transparent); --starcard-glow-peak: 0 0 0 1px color-mix(in srgb, var(--gold-bright) 65%, transparent), 0 0 90px color-mix(in srgb, var(--gold-bright) 60%, transparent), 0 0 160px color-mix(in srgb, var(--gold-bright) 32%, transparent); position: relative; background: linear-gradient(180deg, var(--panel), var(--panel2)); border: 1px solid color-mix(in srgb, var(--gold-bright) 75%, var(--bd)); border-radius: 18px; padding: 28px; text-align: center; box-shadow: var(--starcard-glow-rest); animation: starcardGlow 3.2s ease-in-out infinite; }
.starcard .stars-ic { display: block; font-size: 18px; letter-spacing: 4px; margin: 0 -4px 6px 0; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--gold-bright) 70%, transparent)); }
.starcard .big { display: block; font-size: 64px; font-weight: 800; color: var(--gold-bright); line-height: 1; text-shadow: 0 0 24px color-mix(in srgb, var(--gold-bright) 55%, transparent); }
.starcard .lbl { display: block; color: var(--mut); margin: 6px 0 18px; font-size: 14px; text-transform: uppercase; letter-spacing: .06em; }

@keyframes starcardGlow {
  0%, 100% { box-shadow: var(--starcard-glow-rest); }
  50% { box-shadow: var(--starcard-glow-peak); }
}
@keyframes starBtnGlow {
  0%, 100% { box-shadow: var(--star-glow-rest); }
  50% { box-shadow: var(--star-glow-peak); }
}
@media (prefers-reduced-motion: reduce) {
  .starcard, .btn.star { animation: none; }
}

.foot { border-top: 1px solid var(--bd); padding: 28px 0; }
.footwrap { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; color: var(--mut); font-size: 14px; }
.foot a { color: var(--mut); }
.dim a:hover { color: var(--tx); }
.made { margin: 16px 0 0; text-align: center; color: var(--mut); font-size: 12px; opacity: .6; }

.scroll-top { position: fixed; bottom: 28px; right: 28px; z-index: 30; width: 44px; height: 44px; border: 1px solid var(--bd); background: var(--panel2); color: var(--tx); font-size: 18px; cursor: pointer; display: grid; place-items: center; clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); transition: border-color .15s ease, transform .06s ease; }
.scroll-top:hover { border-color: var(--acc); transform: translateY(-2px); }
</style>
