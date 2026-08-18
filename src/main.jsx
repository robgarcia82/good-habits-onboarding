import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const GOALS = [
  { id: 'higiene', icon: '🪥', label: 'Higiene e autocuidado' },
  { id: 'organizacao', icon: '🧸', label: 'Organização' },
  { id: 'estudos', icon: '📚', label: 'Estudos' },
  { id: 'sono', icon: '🌙', label: 'Sono e rotina' },
  { id: 'alimentacao', icon: '🍎', label: 'Alimentação' },
  { id: 'autonomia', icon: '🌱', label: 'Autonomia' },
];

const HABITS = {
  higiene: [
    ['Escovar os dentes pela manhã', '🪥'],
    ['Tomar banho', '🛁'],
    ['Vestir-se', '👕'],
  ],
  organizacao: [
    ['Guardar os brinquedos', '🧸'],
    ['Preparar a mochila', '🎒'],
    ['Arrumar a cama', '🛏️'],
  ],
  estudos: [
    ['Começar a tarefa no horário', '✏️'],
    ['Organizar o material', '📒'],
    ['Ler por alguns minutos', '📖'],
  ],
  sono: [
    ['Guardar as telas antes de dormir', '📵'],
    ['Colocar o pijama', '🌙'],
    ['Deitar no horário combinado', '⏰'],
  ],
  alimentacao: [
    ['Beber água ao longo do dia', '💧'],
    ['Experimentar um alimento novo', '🥕'],
    ['Levar o prato após a refeição', '🍽️'],
  ],
  autonomia: [
    ['Escolher a roupa do dia', '👟'],
    ['Cuidar dos próprios pertences', '🎒'],
    ['Ajudar em uma tarefa da casa', '🏡'],
  ],
};

const MOTIVATIONS = [
  { id: 'together', icon: '🤝', title: 'Tempo juntos', text: 'Brincar, cozinhar ou passear em família' },
  { id: 'choice', icon: '⭐', title: 'Poder escolher', text: 'Filme, sobremesa ou brincadeira' },
  { id: 'experience', icon: '🎈', title: 'Experiências', text: 'Parque, cinema ou noite especial' },
  { id: 'screen', icon: '🎮', title: 'Tempo de tela', text: 'Minutos extras com limites definidos' },
];

const PLANS = [
  { id: 'monthly', name: 'Mensal', cadence: '/mês', price: '39,90', total: 'Cobrança mensal', save: null },
  { id: 'quarterly', name: 'Trimestral', cadence: '/mês', price: '29,90', total: 'R$ 89,70 a cada 3 meses', save: 'Economize 25%' },
  { id: 'annual', name: 'Anual', cadence: '/mês', price: '19,90', total: 'R$ 238,80 por ano', save: 'Economize 50%', recommended: true },
];

function Icon({ children, tone = 'violet' }) {
  return <span className={`icon-badge ${tone}`}>{children}</span>;
}

function BackButton({ onClick }) {
  return (
    <button className="icon-button" type="button" onClick={onClick} aria-label="Voltar">
      <span aria-hidden="true">←</span>
    </button>
  );
}

function Check({ active }) {
  return <span className={`check ${active ? 'active' : ''}`}>{active ? '✓' : ''}</span>;
}

function StepShell({ step, title, eyebrow, subtitle, children, onBack, onNext, nextLabel = 'Continuar', nextDisabled = false, helper }) {
  const progress = Math.max(0, Math.min(100, (step / 5) * 100));
  return (
    <main className="app-shell">
      <div className="topbar">
        <BackButton onClick={onBack} />
        <span className="step-count">Etapa {step} de 5</span>
        <button className="text-button" type="button" onClick={onNext}>Responder depois</button>
      </div>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <section className="screen-content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {children}
      </section>
      <footer className="sticky-footer">
        {helper && <span className="footer-helper">{helper}</span>}
        <button className="primary-button" type="button" onClick={onNext} disabled={nextDisabled}>{nextLabel}</button>
      </footer>
    </main>
  );
}

function Welcome({ onNext }) {
  return (
    <main className="welcome-screen">
      <div className="ambient one" />
      <div className="ambient two" />
      <div className="brand"><span className="brand-mark">Z</span><span>Zica</span></div>
      <section className="welcome-copy">
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one"><span>⭐</span></div>
          <div className="orbit orbit-two"><span>🌱</span></div>
          <div className="mascot">🐱</div>
          <div className="streak-card"><strong>4 dias</strong><span>de sequência!</span></div>
          <div className="points-card"><strong>+12</strong><span>pontos</span></div>
        </div>
        <p className="eyebrow light">Bons hábitos começam pequenos</p>
        <h1>Uma rotina mais leve para toda a família.</h1>
        <p>Conte um pouco sobre sua criança e receba uma primeira rotina personalizada em cerca de 2 minutos.</p>
        <div className="benefit-row">
          <span>✓ Sem julgamentos</span><span>✓ Feito para a idade</span><span>✓ Você controla tudo</span>
        </div>
      </section>
      <button className="primary-button welcome-cta" type="button" onClick={onNext}>Criar nossa primeira rotina <span>→</span></button>
    </main>
  );
}

function Goals({ selected, setSelected, onNext, onBack }) {
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  return (
    <StepShell step={1} eyebrow="Vamos começar pelo que importa" title="O que deixaria a rotina mais leve hoje?" subtitle="Escolha até três áreas. Você poderá adicionar outras quando quiser." onBack={onBack} onNext={onNext} nextDisabled={!selected.length} helper={`${selected.length} de 3 selecionadas`}>
      <div className="goal-grid">
        {GOALS.map((goal) => {
          const active = selected.includes(goal.id);
          return <button type="button" className={`choice-card goal-card ${active ? 'selected' : ''}`} onClick={() => toggle(goal.id)} key={goal.id}><Icon>{goal.icon}</Icon><span>{goal.label}</span><Check active={active} /></button>;
        })}
      </div>
      <div className="insight-box"><span>✨</span><p><strong>Uma coisa de cada vez.</strong><br />Começar com poucas áreas aumenta as chances de a nova rotina funcionar.</p></div>
    </StepShell>
  );
}

function ChildProfile({ profile, setProfile, onNext, onBack }) {
  return (
    <StepShell step={2} eyebrow="Sobre sua criança" title="Quem vai construir esses hábitos?" subtitle="Usaremos a idade apenas para criar sugestões adequadas." onBack={onBack} onNext={onNext} nextDisabled={!profile.name.trim() || !profile.age}>
      <label className="field-label">Como podemos chamá-la?</label>
      <input className="text-input" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="Ex.: Zica" />
      <label className="field-label field-gap">Qual é a idade?</label>
      <div className="age-row">
        {['3–5', '6–8', '9–11', '12+'].map((age) => <button type="button" key={age} className={`pill ${profile.age === age ? 'selected' : ''}`} onClick={() => setProfile({ ...profile, age })}>{age} anos</button>)}
      </div>
    </StepShell>
  );
}

function QuickScan({ goals, answers, setAnswers, profile, onNext, onBack }) {
  const habits = useMemo(() => goals.flatMap((goal) => HABITS[goal] || []).slice(0, 6), [goals]);
  const options = [
    { id: 'not-yet', label: 'Ainda não' },
    { id: 'help', label: 'Com ajuda' },
    { id: 'alone', label: 'Sozinho' },
  ];
  const answered = habits.filter(([habit]) => answers[habit]).length;
  return (
    <StepShell step={3} eyebrow="Diagnóstico rápido" title={`Como estão esses hábitos de ${profile.name || 'sua criança'}?`} subtitle="Esta etapa é essencial para criarmos uma rotina que respeite o momento e o nível de autonomia do seu filho. Não existe resposta certa ou errada — em menos de 1 minuto, você nos ajuda a personalizar cada hábito." onBack={onBack} onNext={onNext} nextDisabled={answered < Math.min(3, habits.length)} helper={`${answered} de ${habits.length} respondidos`}>
      <div className="scan-list">
        {habits.map(([habit, icon]) => {
          const selected = answers[habit];

          return <div className={`habit-row ${selected ? 'answered' : ''}`} key={habit}>
            <div className="habit-title"><span>{icon}</span><strong>{habit}</strong></div>
            <div className="segment-control" role="group" aria-label={`Nível de autonomia para ${habit}`}>
              {options.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={selected === option.id ? 'selected' : ''}
                  aria-pressed={selected === option.id}
                  onClick={() => setAnswers({ ...answers, [habit]: option.id })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>;
        })}
      </div>
    </StepShell>
  );
}

function Motivation({ selected, setSelected, onNext, onBack, profile }) {
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return (
    <StepShell step={4} eyebrow="Motivação positiva" title={`O que costuma animar ${profile.name || 'sua criança'}?`} subtitle="Escolha todas as opções que combinam com sua criança. As recompensas serão sempre aprovadas por você." onBack={onBack} onNext={onNext} nextDisabled={!selected.length} helper={`${selected.length} ${selected.length === 1 ? 'selecionada' : 'selecionadas'}`}>
      <div className="motivation-list">
        {MOTIVATIONS.map((item) => { const active = selected.includes(item.id); return <button type="button" className={`choice-card motivation-card ${active ? 'selected' : ''}`} key={item.id} onClick={() => toggle(item.id)}><Icon tone="mint">{item.icon}</Icon><span className="choice-copy"><strong>{item.title}</strong><small>{item.text}</small></span><Check active={active} /></button>; })}
      </div>
      <p className="reassurance">Você poderá definir limites de tela e recompensas pagas depois.</p>
    </StepShell>
  );
}

function Routine({ goals, answers, profile, onNext, onBack }) {
  const routine = useMemo(() => goals.flatMap((goal) => HABITS[goal] || []).slice(0, 4).map(([name, icon], index) => ({ name, icon, points: answers[name] === 'alone' ? 2 : index < 2 ? 4 : 3, time: index < 2 ? 'Manhã' : 'Fim do dia' })), [goals, answers]);
  return (
    <StepShell step={5} eyebrow="Pronto para começar" title={`Criamos uma primeira rotina para ${profile.name || 'sua criança'}`} subtitle="Baseada nas suas respostas, ela começa simples e evolui com a família." onBack={onBack} onNext={onNext} nextLabel="Aprovar esta rotina">
      <div className="routine-summary"><div><span className="big-avatar">{profile.avatar}</span><span><strong>{routine.length} hábitos</strong><small>aprox. 15 min por dia</small></span></div><span className="status-pill">Equilibrada</span></div>
      <div className="routine-list">
        {routine.map((item) => <div className="routine-item" key={item.name}><span className="routine-icon">{item.icon}</span><span className="routine-copy"><strong>{item.name}</strong><small>{item.time} · Todos os dias</small></span><span className="points">+{item.points} pts</span><button className="edit-button" type="button" aria-label={`Editar ${item.name}`} title={`Editar ${item.name}`}><span aria-hidden="true">✎</span></button></div>)}
      </div>
      <button type="button" className="add-button">＋ Adicionar outro hábito</button>
      <div className="insight-box mint"><span>🌱</span><p><strong>Comece pequeno.</strong><br />Você poderá ajustar a rotina a qualquer momento.</p></div>
    </StepShell>
  );
}

function Paywall({ selectedPlan, setSelectedPlan, trial, setTrial, onBack, onFinish }) {
  const plan = PLANS.find((item) => item.id === selectedPlan) || PLANS[2];
  return (
    <main className="paywall-screen">
      <div className="paywall-top"><BackButton onClick={onBack} /><div className="mini-brand"><span className="brand-mark">Z</span><span>Zica</span></div><span className="secure-label">🔒 Seguro</span></div>
      <section className="paywall-content">
        <div className="celebration-mark">✨</div>
        <p className="eyebrow">Sua rotina está pronta</p>
        <h1>Escolha como continuar essa jornada em família.</h1>
        <p className="subtitle">Acesso completo às rotinas, pontos, recompensas e acompanhamento dos hábitos.</p>
        <div className="plan-grid">
          {PLANS.map((item) => <button type="button" key={item.id} className={`plan-card ${selectedPlan === item.id ? 'selected' : ''}`} onClick={() => setSelectedPlan(item.id)}>{item.recommended && <span className="recommended">Melhor escolha</span>}<div className="plan-heading"><Check active={selectedPlan === item.id} /><strong>{item.name}</strong>{item.save && <span className="save-tag">{item.save}</span>}</div><div className="price-line"><span>R$</span><b>{item.price}</b><small>{item.cadence}</small></div><p>{item.total}</p></button>)}
        </div>
        <button type="button" className={`trial-card ${trial ? 'selected' : ''}`} onClick={() => setTrial(!trial)}><div className="gift-icon">🎁</div><span><strong>Experimentar grátis por 7 dias</strong><small>Acesso completo. Cancele quando quiser.</small></span><span className={`toggle ${trial ? 'on' : ''}`}><i /></span></button>
        <div className="included"><strong>Incluído em todos os planos</strong><div><span>✓ Rotinas personalizadas</span><span>✓ Perfis para toda a família</span><span>✓ Relatórios de evolução</span><span>✓ Recompensas e limites</span></div></div>
      </section>
      <footer className="paywall-footer"><button className="primary-button" type="button" onClick={onFinish}>{trial ? 'Começar meus 7 dias grátis' : `Assinar plano ${plan.name.toLowerCase()}`}</button><p>{trial ? `Depois, ${plan.total.toLowerCase()}. Você receberá um lembrete antes da cobrança.` : `${plan.total}. Cancele quando quiser.`}</p><span>Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.</span></footer>
    </main>
  );
}

function Complete({ profile, plan, trial, onRestart }) {
  return (
    <main className="complete-screen">
      <div className="confetti" aria-hidden="true">✦　·　✧　•　✦</div>
      <div className="complete-icon">✓</div>
      <p className="eyebrow">Tudo pronto</p>
      <h1>A jornada de {profile.name || 'sua família'} começa agora!</h1>
      <p>{trial ? 'Seus 7 dias gratuitos já começaram.' : `O plano ${plan} está ativo.`} A primeira rotina está esperando por vocês.</p>
      <div className="complete-card"><span className="big-avatar">{profile.avatar}</span><span><strong>Primeira rotina</strong><small>4 hábitos · pronta para hoje</small></span><span className="status-pill">Ativa</span></div>
      <button className="primary-button" type="button">Ver a rotina de hoje →</button>
      <button className="link-button" type="button" onClick={onRestart}>Reiniciar protótipo</button>
    </main>
  );
}

function App() {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState(['higiene']);
  const [profile, setProfile] = useState({ name: 'Zica', age: '6–8', avatar: '🐱' });
  const [answers, setAnswers] = useState({});
  const [motivations, setMotivations] = useState(['together']);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [trial, setTrial] = useState(true);
  const transitionTo = (target, direction = 'forward', afterTransition) => {
    const commit = () => {
      setStep(target);
      afterTransition?.();
    };

    document.documentElement.dataset.direction = direction;
    if (document.startViewTransition) {
      document.startViewTransition(commit);
    } else {
      commit();
    }
  };
  const next = () => transitionTo(Math.min(step + 1, 7), 'forward');
  const back = () => transitionTo(Math.max(step - 1, 0), 'backward');
  const restart = () => transitionTo(0, 'backward', () => setAnswers({}));
  const screens = [
    <Welcome onNext={next} />,
    <Goals selected={goals} setSelected={setGoals} onNext={next} onBack={back} />,
    <ChildProfile profile={profile} setProfile={setProfile} onNext={next} onBack={back} />,
    <QuickScan goals={goals} answers={answers} setAnswers={setAnswers} profile={profile} onNext={next} onBack={back} />,
    <Motivation selected={motivations} setSelected={setMotivations} profile={profile} onNext={next} onBack={back} />,
    <Routine goals={goals} answers={answers} profile={profile} onNext={next} onBack={back} />,
    <Paywall selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} trial={trial} setTrial={setTrial} onBack={back} onFinish={next} />,
    <Complete profile={profile} plan={PLANS.find((item) => item.id === selectedPlan)?.name} trial={trial} onRestart={restart} />,
  ];
  return <div className="prototype-canvas"><div className="web-app-frame"><div className="screen-stage" key={step}>{screens[step]}</div></div></div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
