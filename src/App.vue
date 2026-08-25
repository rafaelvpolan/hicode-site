<script setup lang="ts">
import { repoUrl, sponsorUrl, starUrl } from './lib/github'
import { pipeline, stepStyle } from './pipeline'
import { useGithubStars } from './useGithubStars'
import { useScrollTop } from './useScrollTop'
import { useClock } from './useClock'
import { sectionTag } from './sectionTag'
import Button from './components/Button.vue'
import Card from './components/Card.vue'
import Container from './components/Container.vue'
import IsoBlock from './components/IsoBlock.vue'
import Panel from './components/Panel.vue'
import EngineConsole from './components/EngineConsole.vue'
import FeatureBelt from './components/FeatureBelt.vue'
import TelemetryHud from './components/TelemetryHud.vue'
import CardLifecycle from './components/CardLifecycle.vue'
import AgentGrid from './components/AgentGrid.vue'
import LoopVsPrompt from './components/LoopVsPrompt.vue'
import FinalCta from './components/FinalCta.vue'
import FaqList from './components/FaqList.vue'

const { stars, loadingStars, fmtStars } = useGithubStars()
const { showScrollTop, scrollToTop } = useScrollTop()
const { time, date, weekday } = useClock()

const tabs = [
  { href: '#sobre', label: 'O que é' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#telemetria', label: 'Telemetria' },
  { href: '#anatomia', label: 'Card' },
  { href: '#agentes', label: 'Agentes' },
  { href: '#faq', label: 'FAQ' },
  { href: '#open', label: 'Open source' },
]

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
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>

  <header class="hud">
    <Container class="hudwrap">
      <div class="hud-row">
        <a class="brand" href="#topo" aria-label="hicode">
          <span class="brand-mark" aria-hidden="true">⟳</span>
          <span class="brand-name">hicode</span>
        </a>

        <p class="banner">
          <span class="wing" aria-hidden="true" />
          <span class="banner-txt">Motor autônomo de entrega</span>
          <span class="wing wing-r" aria-hidden="true" />
        </p>

        <p class="clock" aria-hidden="true">
          <span class="clock-time">{{ time }}</span>
          <span class="clock-date">{{ date }} · {{ weekday }}</span>
        </p>
      </div>

      <nav class="tabs" aria-label="Navegação principal">
        <a v-for="t in tabs" :key="t.href" :href="t.href">{{ t.label }}</a>
        <a class="tab-gh" :href="repoUrl" target="_blank" rel="noopener noreferrer">
          ⭐ <span v-if="loadingStars">…</span><span v-else>{{ stars === null ? 'GitHub' : fmtStars(stars) }}</span>
        </a>
      </nav>
    </Container>
  </header>

  <main id="conteudo">
    <section id="topo" class="stage">
      <span class="stage-floor" aria-hidden="true" />
      <span class="stage-core" aria-hidden="true" />
      <Container class="stage-inner">
        <ul class="chips">
          <li class="chip is-ok">open source · MIT</li>
          <li class="chip">merge sempre humano</li>
          <li class="chip is-warn">loop determinístico</li>
        </ul>
        <h1>
          Prompts resolvem tarefas.<br />
          <span class="grad">Loops inteligentes constroem sistemas.</span>
        </h1>
        <p class="sub">
          <strong>hicode</strong> é um gerenciador de projetos autônomo com IA. Cada tarefa vira um
          card que percorre <em>executar → preview → aprovar → PR → deploy</em> — com agentes
          especializados fazendo o trabalho e um gate adversarial garantindo a qualidade.
        </p>
        <div class="cta">
          <Button variant="primary" :href="repoUrl" target="_blank" rel="noopener noreferrer">Ver no GitHub →</Button>
          <Button :href="starUrl" target="_blank" rel="noopener noreferrer">⭐ Dar uma estrela</Button>
          <Button variant="pink" :href="sponsorUrl" target="_blank" rel="noopener noreferrer">💖 Apoiar</Button>
        </div>
        <p class="starline" aria-live="polite">
          <template v-if="loadingStars">Carregando estrelas…</template>
          <template v-else-if="stars === null">⭐ Seja a primeira estrela do projeto.</template>
          <template v-else>⭐ {{ fmtStars(stars) }} {{ stars === 1 ? 'estrela' : 'estrelas' }} no GitHub</template>
        </p>
      </Container>
    </section>

    <div class="rail" aria-hidden="true"><span /></div>

    <Container class="deck">
      <Panel class="col-3" tag="SYS_01" title="Sinais" meta="live" heading-level="h3">
        <FeatureBelt />
      </Panel>

      <Panel class="col-6" tag="IGN_00" title="Ignição do motor" meta="console" heading-level="h3">
        <EngineConsole />
      </Panel>

      <Panel class="col-3" tag="OSS_00" title="Repositório" meta="github" heading-level="h3">
        <Card as="div" variant="star" class="starcard" aria-label="Estrelas no GitHub">
          <span class="stars-ic" aria-hidden="true">⭐⭐⭐</span>
          <span class="big">{{ loadingStars ? '…' : (stars === null ? '★' : fmtStars(stars)) }}</span>
          <span class="lbl">estrelas no GitHub</span>
          <Button variant="star" size="sm" :href="starUrl" target="_blank" rel="noopener noreferrer">Apoiar com 1 clique</Button>
        </Card>
      </Panel>

      <Panel id="sobre" class="col-12" :tag="sectionTag('CH', 0)" title="O que é o hicode" meta="conceito">
        <p class="lead">
          Funde <strong>Loop Engineering</strong> com o framework de agentes <strong>Nexus</strong>:
          um loop determinístico descobre o trabalho, executa por card, mostra o resultado e abre o PR.
          A única porta humana obrigatória é o merge.
        </p>
        <div class="cards">
          <Card v-for="(p, i) in pillars" :key="p.title">
            <span class="card-tag" aria-hidden="true">{{ sectionTag('PILLAR', i) }}</span>
            <IsoBlock class="ic" size="lg" aria-hidden="true">{{ p.icon }}</IsoBlock>
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
          </Card>
        </div>
      </Panel>

      <Panel id="pipeline" class="col-12" :tag="sectionTag('CH', 1)" title="O pipeline" meta="fases">
        <p class="lead">Executar primeiro, polir depois. Você vê o resultado antes de gastar esforço com testes e limpeza.</p>
        <ol class="steps">
          <li v-for="(s, i) in pipeline" :key="s.k" :style="'--stage-color: ' + s.color">
            <span class="stage-tag" aria-hidden="true">{{ sectionTag('STAGE', i) }}</span>
            <IsoBlock class="n" :style="stepStyle(s)" aria-hidden="true">{{ s.icon }}</IsoBlock>
            <div><b>{{ s.k }}</b><span>{{ s.d }}</span></div>
          </li>
        </ol>
      </Panel>

      <Panel id="telemetria" class="col-12" :tag="sectionTag('CH', 2)" title="Telemetria do motor" meta="status do loop">
        <p class="lead">
          O que o pipeline está fazendo agora: quanto do loop roda sozinho no motor, quantas
          fases faltam até você ver o resultado e quem está de olho na revisão do Crivo.
        </p>
        <TelemetryHud />
      </Panel>

      <Panel id="anatomia" class="col-12" :tag="sectionTag('CH', 3)" title="Anatomia de um card" meta="estado real">
        <p class="lead">
          Cada card nasce em <code>cards/&lt;NNN-slug&gt;.md</code> e atravessa dez estados até o merge.
          Nenhum é carimbado pela fala do modelo — quem decide é o harness, lendo o exit code real em disco.
        </p>
        <CardLifecycle />
      </Panel>

      <Panel id="agentes" class="col-7" :tag="sectionTag('CH', 4)" title="Os agentes Nexus" meta="time">
        <p class="lead">
          Escopo estreito, um dono por preocupação. Ninguém entrega "pronto" sem passar pelo
          <strong>Crivo</strong> — a revisão adversarial que aprova ou bloqueia o trabalho.
        </p>
        <AgentGrid />
      </Panel>

      <Panel id="faq" class="col-5" :tag="sectionTag('CH', 5)" title="Perguntas frequentes" meta="dúvidas">
        <p class="lead">
          O essencial sobre merge, spec e o que o pipeline decide sozinho — sem precisar ler
          o código do motor.
        </p>
        <FaqList />
      </Panel>

      <Panel id="por-que-loops" class="col-12" :tag="sectionTag('CH', 6)" title="Por que loops, não prompts" meta="tese">
        <p class="lead">
          Um prompt é sessão. Um loop é sistema. A diferença aparece na segunda vez que você
          precisa da mesma coisa — e não quer explicar tudo de novo.
        </p>
        <LoopVsPrompt />
      </Panel>

      <Panel id="open" class="col-12" :tag="sectionTag('CH', 7)" title="Projeto open source" meta="comunidade">
        <p class="lead">
          O hicode é livre e construído à vista de todos. Se ele te ajuda, a melhor forma de
          retribuir é <strong>deixar uma estrela</strong> (ajuda outras pessoas a encontrarem) e,
          se puder, <strong>apoiar o desenvolvimento</strong>.
        </p>
        <div class="cta">
          <Button variant="star" :href="starUrl" target="_blank" rel="noopener noreferrer">
            ⭐ Star <span v-if="!loadingStars && stars !== null">· {{ fmtStars(stars) }}</span>
          </Button>
          <Button variant="pink" :href="sponsorUrl" target="_blank" rel="noopener noreferrer">💖 Doar / Sponsor</Button>
          <Button :href="repoUrl" target="_blank" rel="noopener noreferrer">Contribuir no repo</Button>
        </div>
      </Panel>

      <div id="comece" class="col-12">
        <FinalCta />
      </div>
    </Container>
  </main>

  <button
    v-show="showScrollTop"
    class="scroll-top"
    aria-label="Voltar ao topo"
    @click="scrollToTop"
  >↑</button>

  <footer class="statusbar">
    <Container class="statuswrap">
      <span class="status-id">⟳ hicode <i>v0.1.0</i></span>
      <span class="status-links">
        <a :href="repoUrl" target="_blank" rel="noopener noreferrer">GitHub</a> ·
        <a :href="sponsorUrl" target="_blank" rel="noopener noreferrer">Apoiar</a> ·
        open source · MIT
      </span>
      <span class="status-live"><i class="dot" aria-hidden="true" />feito com hicode</span>
    </Container>
  </footer>
</template>

<style scoped>
.skip { position: absolute; left: -999px; }
.skip:focus { left: 12px; top: 12px; background: var(--acc); color: var(--white); padding: var(--space-2) var(--space-4); z-index: 50; }

/* ---- barra de comando ---- */
.hud {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: linear-gradient(180deg, color-mix(in srgb, var(--acc) 12%, var(--bg)) 0%, color-mix(in srgb, var(--bg) 88%, transparent) 100%);
  border-bottom: 1px solid color-mix(in srgb, var(--acc) 35%, var(--bd));
}
/* seletor descendente: vence o padding do primitivo Container sem depender da ordem do bundle */
.hud .hudwrap { padding-top: var(--space-2); padding-bottom: var(--space-2); }
.hud-row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--space-6); min-height: var(--hud-h); }

.brand { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-7) var(--space-2) var(--space-4); background: linear-gradient(90deg, color-mix(in srgb, var(--acc) 34%, transparent), transparent); border-left: 3px solid var(--acc); color: var(--tx); }
.brand:hover { text-decoration: none; }
.brand-mark { color: var(--acc2); font-size: var(--fs-2xl); }
.brand-name { font-family: var(--font-display); font-size: var(--fs-4xl); font-weight: var(--fw-700); letter-spacing: .04em; }

.banner { display: flex; align-items: center; justify-content: center; gap: var(--space-4); margin: 0; }
.banner-txt { font-family: var(--font-display); font-size: var(--fs-lg); font-weight: var(--fw-700); letter-spacing: var(--track-ls); text-transform: uppercase; color: var(--acc2); text-shadow: 0 0 18px color-mix(in srgb, var(--acc) 65%, transparent); white-space: nowrap; }
.wing { flex: 1 1 auto; max-width: 190px; height: 1px; background: linear-gradient(90deg, transparent, var(--acc)); position: relative; }
.wing::after { content: ''; position: absolute; right: -3px; top: -3px; width: 6px; height: 6px; background: var(--acc2); transform: rotate(45deg); }
.wing-r { background: linear-gradient(90deg, var(--acc), transparent); }
.wing-r::after { right: auto; left: -3px; }

.clock { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; margin: 0; font-family: var(--font-mono); }
.clock-time { font-size: var(--fs-4xl); font-weight: var(--fw-700); line-height: 1; color: var(--acc2); letter-spacing: .06em; text-shadow: 0 0 18px color-mix(in srgb, var(--acc) 60%, transparent); font-variant-numeric: tabular-nums; }
.clock-date { font-size: var(--fs-2xs); letter-spacing: .12em; text-transform: uppercase; color: var(--mut); }

.tabs { display: flex; align-items: stretch; gap: 2px; overflow-x: auto; padding-bottom: 2px; }
.tabs a { flex: 0 0 auto; padding: var(--space-2) var(--space-7); font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: .1em; text-transform: uppercase; color: var(--mut); background: color-mix(in srgb, var(--panel2) 70%, transparent); border: 1px solid var(--bd); border-bottom: none; clip-path: polygon(var(--cut) 0, 100% 0, 100% 100%, 0 100%); }
.tabs a:hover { color: var(--tx); text-decoration: none; background: color-mix(in srgb, var(--acc) 20%, var(--panel2)); border-color: var(--bd-acc); }
.tab-gh { margin-left: auto; color: var(--tx) !important; border-color: var(--bd-acc) !important; background: color-mix(in srgb, var(--acc) 18%, transparent) !important; }

/* ---- palco ---- */
.stage { position: relative; overflow: hidden; padding: clamp(48px, 9vw, 104px) 0 clamp(56px, 9vw, 96px); text-align: center; }
.stage-floor {
  position: absolute;
  left: -25%;
  right: -25%;
  bottom: -30px;
  height: 420px;
  background:
    linear-gradient(color-mix(in srgb, var(--acc) 26%, transparent) 1px, transparent 1px) 0 0 / 60px 60px,
    linear-gradient(90deg, color-mix(in srgb, var(--acc) 26%, transparent) 1px, transparent 1px) 0 0 / 60px 60px;
  transform: perspective(520px) rotateX(66deg);
  transform-origin: bottom center;
  mask-image: radial-gradient(70% 90% at 50% 100%, var(--black) 0%, transparent 78%);
  pointer-events: none;
}
.stage-core {
  position: absolute;
  left: 50%;
  top: 46%;
  width: min(560px, 78vw);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border: 1px dashed color-mix(in srgb, var(--acc) 30%, transparent);
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--acc) 20%, transparent) 0%, transparent 62%);
  animation: coreSpin 46s linear infinite;
  pointer-events: none;
}
@keyframes coreSpin { to { transform: translate(-50%, -50%) rotate(360deg); } }

.stage-inner { position: relative; }
.chips { list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-2); margin: 0 0 var(--space-11); padding: 0; }
.chip { font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: .16em; text-transform: uppercase; color: var(--acc2); border: 1px solid color-mix(in srgb, var(--acc) 45%, transparent); background: color-mix(in srgb, var(--acc) 10%, transparent); padding: 3px 12px; clip-path: polygon(7px 0, 100% 0, calc(100% - 7px) 100%, 0 100%); }
.chip.is-ok { color: var(--ok); border-color: color-mix(in srgb, var(--ok) 45%, transparent); background: color-mix(in srgb, var(--ok) 10%, transparent); }
.chip.is-warn { color: var(--hazard); border-color: color-mix(in srgb, var(--hazard) 45%, transparent); background: color-mix(in srgb, var(--hazard) 10%, transparent); }

.stage h1 { font-family: var(--font-display); font-size: var(--fs-hero); font-weight: var(--fw-800); letter-spacing: .04em; text-transform: uppercase; margin: 0 0 var(--space-8); }
.grad { background: linear-gradient(90deg, var(--acc), var(--acc2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.sub { max-width: 660px; margin: 0 auto var(--space-11); color: var(--tx-soft); font-size: var(--fs-sub); }
.stage .cta { justify-content: center; }
.starline { margin-top: var(--space-9); color: var(--mut); font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: .1em; }

.rail { display: flex; align-items: center; justify-content: center; height: 1px; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--acc) 55%, transparent), transparent); }
.rail span { width: 10px; height: 10px; background: var(--acc); transform: rotate(45deg); box-shadow: 0 0 18px var(--acc); }

/* ---- grade de painéis ---- */
main .deck { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--deck-gap); align-items: start; padding-top: clamp(28px, 4vw, 46px); padding-bottom: clamp(28px, 4vw, 46px); }
.deck > * { grid-column: span 12; }
@media (min-width: 1100px) {
  .col-3 { grid-column: span 3; }
  .col-5 { grid-column: span 5; }
  .col-6 { grid-column: span 6; }
  .col-7 { grid-column: span 7; }
}

.lead { color: var(--mut); max-width: var(--lead-maxw); margin: 0 0 var(--space-11); font-size: var(--fs-xl); }
.lead code { font-family: var(--font-mono); background: var(--panel2); border: 1px solid var(--bd); border-radius: var(--radius-sm); padding: 1px 6px; font-size: .88em; color: var(--tx); }

.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--deck-gap); }
@media (max-width: 820px) { .cards { grid-template-columns: 1fr; } }
.card-tag { display: block; font-family: var(--font-mono); font-size: var(--fs-2xs); letter-spacing: var(--track-ls); color: var(--acc2); margin-bottom: var(--space-3); }
.card .ic { font-size: var(--fs-4xl); margin-left: calc(var(--space-2) * -1); }
.card h3 { margin: var(--space-4) 0 var(--space-2); font-family: var(--font-display); font-size: var(--fs-2xl); letter-spacing: .06em; text-transform: uppercase; }
.card h3::after { content: ''; display: block; width: 100%; height: 1px; margin-top: var(--space-3); background: var(--scan-line); opacity: .55; }
.card p { margin: var(--space-4) 0 0; color: var(--mut); }

.starcard { text-align: center; }
.starcard .stars-ic { display: block; font-size: var(--fs-xl); letter-spacing: 4px; margin: 0 -4px 6px 0; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--gold-bright) 70%, transparent)); }
.starcard .big { display: block; font-family: var(--font-mono); font-size: var(--fs-6xl); font-weight: var(--fw-800); color: var(--gold-bright); line-height: 1; text-shadow: 0 0 24px color-mix(in srgb, var(--gold-bright) 55%, transparent); }
.starcard .lbl { display: block; color: var(--mut); margin: var(--space-1) 0 var(--space-7); font-size: var(--fs-sm); text-transform: uppercase; letter-spacing: .1em; }

.steps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
@media (max-width: 820px) { .steps { grid-template-columns: 1fr; } }
.steps li { position: relative; display: flex; gap: var(--space-5); align-items: flex-start; background: var(--panel); background-image: linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px); background-size: var(--grid-cell) var(--grid-cell); border: 1px solid var(--bd); border-left: 3px solid var(--stage-color, var(--acc)); clip-path: polygon(var(--notch) 0, 100% 0, 100% calc(100% - var(--notch)), calc(100% - var(--notch)) 100%, 0 100%, 0 var(--notch)); padding: var(--space-7) var(--space-8); transition: transform var(--dur-soft) var(--ease-soft), border-color var(--dur-micro) ease; }
.steps li:hover { --iso-hover: 1; transform: translateY(-3px); border-color: color-mix(in srgb, var(--stage-color, var(--acc)) 50%, var(--bd)); }
.stage-tag { position: absolute; top: 10px; right: 16px; font-family: var(--font-mono); font-size: var(--fs-2xs); letter-spacing: .14em; color: var(--stage-color, var(--acc)); }
.steps .n { border: 1px solid; border-radius: var(--radius-md); font-size: var(--fs-lg); }
.steps b { display: block; }
.steps span { color: var(--mut); font-size: var(--fs-base); }

/* ---- barra de status ---- */
.statusbar { border-top: 1px solid color-mix(in srgb, var(--acc) 30%, var(--bd)); background: linear-gradient(0deg, color-mix(in srgb, var(--acc) 10%, var(--bg)) 0%, transparent 100%); }
.statuswrap { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; min-height: 46px; font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: .1em; text-transform: uppercase; color: var(--mut); }
.status-id { color: var(--tx); }
.status-id i { color: var(--mut); font-style: normal; }
.statusbar a { color: var(--mut); }
.status-links a:hover { color: var(--acc2); }
.status-live { display: inline-flex; align-items: center; gap: var(--space-2); }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 10px var(--ok); }

.scroll-top { position: fixed; bottom: 28px; right: 28px; z-index: 30; width: 44px; height: 44px; border: 1px solid var(--bd-acc); background: var(--panel2); color: var(--acc2); font-size: var(--fs-2xl); cursor: pointer; display: grid; place-items: center; clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); transition: border-color .15s ease, transform .06s ease; }
.scroll-top:hover { border-color: var(--acc); transform: translateY(-2px); }

@media (max-width: 900px) {
  .hud-row { grid-template-columns: auto auto; }
  .banner { display: none; }
}
@media (max-width: 520px) {
  .clock-time { font-size: var(--fs-2xl); }
  .brand-name { font-size: var(--fs-2xl); }
}

@media (prefers-reduced-motion: reduce) {
  .stage-core { animation: none; }
}
</style>
