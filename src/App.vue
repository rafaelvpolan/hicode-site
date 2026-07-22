<script setup lang="ts">
import { pipeline, stepStyle } from './pipeline'
import { useGithubStars } from './useGithubStars'
import { useScrollTop } from './useScrollTop'
import { sectionTag } from './sectionTag'
import Button from './components/Button.vue'
import Card from './components/Card.vue'
import Container from './components/Container.vue'
import Section from './components/Section.vue'
import EngineConsole from './components/EngineConsole.vue'
import FeatureBelt from './components/FeatureBelt.vue'
import TelemetryHud from './components/TelemetryHud.vue'
import CardLifecycle from './components/CardLifecycle.vue'
import AgentGrid from './components/AgentGrid.vue'
import LoopVsPrompt from './components/LoopVsPrompt.vue'
import FinalCta from './components/FinalCta.vue'
import FaqList from './components/FaqList.vue'

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
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>

  <div class="topbar">
    <div class="test-banner" role="status" aria-live="polite">versao de testes</div>

    <header class="nav">
    <Container class="navwrap">
      <a class="brand" href="#topo" aria-label="hiignation">
        <span class="logo" aria-hidden="true">⟳</span> hiignation<span class="beta">beta</span>
      </a>
      <nav class="navlinks" aria-label="Navegação principal">
        <a href="#sobre">O que é</a>
        <a href="#pipeline">Pipeline</a>
        <a href="#telemetria">Telemetria</a>
        <a href="#agentes">Agentes</a>
        <a href="#faq">FAQ</a>
        <a href="#open">Open source</a>
        <a :href="`${repoUrl}#readme`" target="_blank" rel="noopener noreferrer">Docs</a>
        <a class="ghbtn" :href="repoUrl" target="_blank" rel="noopener noreferrer">
          ⭐ <span v-if="loadingStars">…</span><span v-else>{{ stars === null ? 'GitHub' : fmtStars(stars) }}</span>
        </a>
      </nav>
    </Container>
  </header>
  </div>

  <main id="conteudo">
    <section id="topo" class="hero">
      <Container>
        <p class="badge">open source · MIT</p>
        <h1>Prompts resolvem tarefas.<br /><span class="grad">Loops inteligentes constroem sistemas.</span></h1>
        <p class="sub">
          <strong>hiignation</strong> é um gerenciador de projetos autônomo com IA. Cada tarefa vira um
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

        <EngineConsole />
      </Container>
    </section>

    <div class="hazard-strip" aria-hidden="true"></div>

    <section aria-label="Diferenciais do hiignation" class="belt-section">
      <Container>
        <FeatureBelt />
      </Container>
    </section>

    <Section id="sobre">
      <Container>
        <p class="eyebrow">{{ sectionTag('CH', 0) }} · CONCEITO</p>
        <h2>O que é o hiignation</h2>
        <p class="lead">
          Funde <strong>Loop Engineering</strong> com o framework de agentes <strong>Nexus</strong>:
          um loop determinístico descobre o trabalho, executa por card, mostra o resultado e abre o PR.
          A única porta humana obrigatória é o merge.
        </p>
        <div class="cards">
          <Card v-for="(p, i) in pillars" :key="p.title">
            <span class="card-tag" aria-hidden="true">{{ sectionTag('PILLAR', i) }}</span>
            <span class="ic" aria-hidden="true">{{ p.icon }}</span>
            <h3>{{ p.title }}</h3>
            <p>{{ p.text }}</p>
          </Card>
        </div>
      </Container>
    </Section>

    <Section id="pipeline" alt>
      <Container>
        <p class="eyebrow">{{ sectionTag('CH', 1) }} · FASES</p>
        <h2>O pipeline</h2>
        <p class="lead">Executar primeiro, polir depois. Você vê o resultado antes de gastar esforço com testes e limpeza.</p>
        <ol class="steps">
          <li v-for="(s, i) in pipeline" :key="s.k" :style="'--stage-color: ' + s.color">
            <span class="stage-tag" aria-hidden="true">{{ sectionTag('STAGE', i) }}</span>
            <span
              class="n"
              :style="stepStyle(s)"
              aria-hidden="true"
            >{{ s.icon }}</span>
            <div><b>{{ s.k }}</b><span>{{ s.d }}</span></div>
          </li>
        </ol>
      </Container>
    </Section>

    <Section id="telemetria">
      <Container>
        <p class="eyebrow">{{ sectionTag('CH', 2) }} · STATUS DO LOOP</p>
        <h2>Telemetria do motor</h2>
        <p class="lead">
          O que o pipeline está fazendo agora: quanto do loop roda sozinho no motor, quantas
          fases faltam até você ver o resultado e quem está de olho na revisão do Crivo.
        </p>
        <TelemetryHud />
      </Container>
    </Section>

    <Section id="anatomia" alt>
      <Container>
        <p class="eyebrow">{{ sectionTag('CH', 3) }} · ESTADO REAL</p>
        <h2>Anatomia de um card</h2>
        <p class="lead">
          Cada card nasce em <code>cards/&lt;NNN-slug&gt;.md</code> e atravessa dez estados até o merge.
          Nenhum é carimbado pela fala do modelo — quem decide é o harness, lendo o exit code real em disco.
        </p>
        <CardLifecycle />
      </Container>
    </Section>

    <Section id="agentes">
      <Container>
        <p class="eyebrow">{{ sectionTag('CH', 4) }} · TIME</p>
        <h2>Os agentes Nexus</h2>
        <p class="lead">
          Escopo estreito, um dono por preocupação. Ninguém entrega "pronto" sem passar pelo
          <strong>Crivo</strong> — a revisão adversarial que aprova ou bloqueia o trabalho.
        </p>
        <AgentGrid />
      </Container>
    </Section>

    <Section id="por-que-loops" alt>
      <Container>
        <p class="eyebrow">{{ sectionTag('CH', 5) }} · TESE</p>
        <h2>Por que loops, não prompts</h2>
        <p class="lead">
          Um prompt é sessão. Um loop é sistema. A diferença aparece na segunda vez que você
          precisa da mesma coisa — e não quer explicar tudo de novo.
        </p>
        <LoopVsPrompt />
      </Container>
    </Section>

    <Section id="open">
      <Container class="donate">
        <div class="donate-text">
          <p class="eyebrow">{{ sectionTag('CH', 6) }} · COMUNIDADE</p>
          <h2>Projeto open source</h2>
          <p>
            O hiignation é livre e construído à vista de todos. Se ele te ajuda, a melhor forma de
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
        </div>
        <Card as="aside" class="starcard" aria-label="Estrelas no GitHub">
          <span class="card-tag" aria-hidden="true">{{ sectionTag('STARS', 0) }}</span>
          <span class="stars-ic" aria-hidden="true">⭐⭐⭐</span>
          <span class="big">{{ loadingStars ? '…' : (stars === null ? '★' : fmtStars(stars)) }}</span>
          <span class="lbl">estrelas no GitHub</span>
          <Button variant="star" size="sm" :href="starUrl" target="_blank" rel="noopener noreferrer">Apoiar com 1 clique</Button>
        </Card>
      </Container>
    </Section>

    <Section id="faq" alt>
      <Container>
        <p class="eyebrow">{{ sectionTag('CH', 7) }} · DÚVIDAS</p>
        <h2>Perguntas frequentes</h2>
        <p class="lead">
          O essencial sobre merge, spec e o que o pipeline decide sozinho — sem precisar ler
          o código do motor.
        </p>
        <FaqList />
      </Container>
    </Section>

    <Section id="comece">
      <Container>
        <FinalCta :repo-url="repoUrl" :star-url="starUrl" :sponsor-url="sponsorUrl" />
      </Container>
    </Section>
  </main>

  <button
    v-show="showScrollTop"
    class="scroll-top"
    aria-label="Voltar ao topo"
    @click="scrollToTop"
  >↑</button>

  <footer class="foot">
    <Container class="footwrap">
      <span>⟳ <strong>hiignation</strong> — gerenciador de projetos autônomo</span>
      <span class="dim">
        <a :href="repoUrl" target="_blank" rel="noopener noreferrer">GitHub</a> ·
        <a :href="sponsorUrl" target="_blank" rel="noopener noreferrer">Apoiar</a> ·
        open source
      </span>
    </Container>
    <p class="made">feito com hiignation</p>
  </footer>
</template>

<style scoped>
.topbar { position: sticky; top: 0; z-index: 20; }
.test-banner { position: relative; background: var(--hazard); color: var(--ink-hazard); font-family: var(--font-mono); font-weight: var(--fw-800); font-size: var(--fs-sm); letter-spacing: .14em; text-transform: uppercase; text-align: center; padding: 7px 0; }
.test-banner::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 4px; background: repeating-linear-gradient(135deg, var(--ink-hazard) 0 8px, transparent 8px 16px); opacity: .5; }

.skip { position: absolute; left: -999px; }
.skip:focus { left: 12px; top: 12px; background: var(--acc); color: var(--white); padding: var(--space-2) var(--space-4); border-radius: var(--radius-lg); z-index: 50; }

.nav { backdrop-filter: blur(10px); background: color-mix(in srgb, var(--bg) 78%, transparent); border-bottom: 1px solid var(--bd); }
.navwrap { display: flex; align-items: center; justify-content: space-between; height: 60px; }
.brand { color: var(--acc); font-weight: var(--fw-700); font-size: var(--fs-2xl); }
.brand:hover { text-decoration: none; }
.logo { color: var(--acc); }
.beta { margin-left: 7px; font-family: var(--font-mono); font-size: var(--fs-xs); font-weight: var(--fw-400); letter-spacing: .06em; text-transform: uppercase; color: var(--mut); background: var(--panel2); border: 1px solid var(--bd); border-radius: var(--radius-sm); padding: 1px 6px; vertical-align: middle; }
.navlinks { display: flex; align-items: center; gap: var(--space-7); }
.navlinks a { color: var(--mut); font-size: var(--fs-base); }
.navlinks a:hover { color: var(--tx); text-decoration: none; }
.ghbtn { display: inline-flex; gap: var(--space-1); align-items: center; background: var(--panel2); border: 1px solid var(--bd); color: var(--tx) !important; padding: var(--space-1) var(--space-4); border-radius: var(--radius-sm); font-weight: var(--fw-600); }
@media (max-width: 620px) { .navlinks a:not(.ghbtn) { display: none; } }

.hero { padding: clamp(56px, 12vw, 120px) 0 clamp(40px, 8vw, 80px); text-align: center; }
.badge { display: inline-block; font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: .1em; text-transform: uppercase; color: var(--ok); border: 1px solid color-mix(in srgb, var(--ok) 40%, transparent); border-radius: var(--radius-sm); padding: 4px var(--space-4); margin: 0 0 var(--space-9); }
.hero h1 { font-size: var(--fs-hero); margin: 0 0 var(--space-7); letter-spacing: -.02em; }
.grad { background: linear-gradient(90deg, var(--acc), var(--acc2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.sub { max-width: 680px; margin: 0 auto var(--space-11); color: var(--tx-soft); font-size: var(--fs-sub); }
.starline { margin-top: var(--space-9); color: var(--mut); font-size: var(--fs-base); }

.hazard-strip { height: 6px; background: repeating-linear-gradient(135deg, var(--hazard) 0 14px, var(--black) 14px 28px); opacity: .5; }

.belt-section { padding: clamp(22px, 4vw, 34px) 0; }

.eyebrow { font-family: var(--font-mono); font-size: var(--fs-sm); letter-spacing: .18em; text-transform: uppercase; color: var(--acc2); margin: 0 0 var(--space-4); text-shadow: 0 0 16px color-mix(in srgb, var(--acc) 40%, transparent); }

.block h2 { font-size: var(--fs-h2); margin: 0 0 var(--space-3); }
.block h2::after { content: ''; display: block; width: 52px; height: 3px; margin-top: var(--space-5); background: linear-gradient(90deg, var(--acc), var(--acc2)); border-radius: 2px; }
.lead { color: var(--mut); max-width: 720px; margin: 0 0 var(--space-12); font-size: var(--fs-xl); }
.lead code { font-family: var(--font-mono); background: var(--panel2); border: 1px solid var(--bd); border-radius: 4px; padding: 1px 6px; font-size: .88em; color: var(--tx); }

.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-7); }
@media (max-width: 820px) { .cards { grid-template-columns: 1fr; } }
.card-tag { display: block; font-family: var(--font-mono); font-size: var(--fs-2xs); letter-spacing: .18em; color: var(--acc2); margin-bottom: var(--space-3); }
.card .ic { font-size: var(--fs-4xl); }
.card h3 { margin: var(--space-4) 0 var(--space-2); font-size: var(--fs-3xl); }
.card h3::after { content: ''; display: block; width: 100%; height: 1px; margin-top: var(--space-3); background: var(--scan-line); opacity: .55; }
.card p { margin: var(--space-4) 0 0; color: var(--mut); }

.steps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
@media (max-width: 820px) { .steps { grid-template-columns: 1fr; } }
.steps li { position: relative; display: flex; gap: var(--space-5); align-items: flex-start; background: var(--panel); border: 1px solid var(--bd); border-left: 3px solid var(--stage-color, var(--acc)); clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut)); padding: var(--space-7) var(--space-8); }
.stage-tag { position: absolute; top: 10px; right: 16px; font-family: var(--font-mono); font-size: var(--fs-2xs); letter-spacing: .14em; color: var(--stage-color, var(--acc)); }
.steps .n { flex: 0 0 auto; width: 30px; height: 30px; border-radius: var(--radius-md); border: 1px solid transparent; font-size: var(--fs-lg); line-height: 1; display: grid; place-items: center; }
.steps b { display: block; }
.steps span { color: var(--mut); font-size: var(--fs-base); }

.donate { display: grid; grid-template-columns: 1.6fr 1fr; gap: var(--space-11); align-items: center; }
@media (max-width: 820px) { .donate { grid-template-columns: 1fr; } }
.donate-text p { color: var(--mut); max-width: 560px; }
.starcard { text-align: center; }
.starcard .stars-ic { display: block; font-size: var(--fs-2xl); letter-spacing: 4px; margin: 0 -4px 6px 0; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--gold-bright) 70%, transparent)); }
.starcard .big { display: block; font-size: 64px; font-weight: var(--fw-800); color: var(--gold-bright); line-height: 1; text-shadow: 0 0 24px color-mix(in srgb, var(--gold-bright) 55%, transparent); }
.starcard .lbl { display: block; color: var(--mut); margin: 6px 0 var(--space-7); font-size: var(--fs-base); text-transform: uppercase; letter-spacing: .06em; }

.foot { border-top: 1px solid var(--bd); padding: var(--space-11) 0; }
.footwrap { display: flex; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; color: var(--mut); font-size: var(--fs-base); }
.foot a { color: var(--mut); }
.dim a:hover { color: var(--tx); }
.made { margin: var(--space-6) 0 0; text-align: center; color: var(--mut); font-size: var(--fs-sm); opacity: .6; }

.scroll-top { position: fixed; bottom: 28px; right: 28px; z-index: 30; width: 44px; height: 44px; border: 1px solid var(--bd); background: var(--panel2); color: var(--tx); font-size: var(--fs-2xl); cursor: pointer; display: grid; place-items: center; clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); transition: border-color .15s ease, transform .06s ease; }
.scroll-top:hover { border-color: var(--acc); transform: translateY(-2px); }
</style>
