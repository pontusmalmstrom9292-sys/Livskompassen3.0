import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Compass,
  Star,
  ChevronRight,
  Plus,
  BookOpen,
  Target,
  Anchor,
  MessageSquare,
  Send,
  Library,
  Settings,
  PenLine,
  Check,
  Bell,
  Menu,
  User,
  UtensilsCrossed,
  NotebookPen,
  Users2,
  TrendingUp,
  Wallet,
  CreditCard,
  Brain,
  Heart,
  Leaf,
  Dumbbell,
  Users,
  Sun,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useBastaDesignMotion } from './bastaDesignMotion';

const economyData = [
  { m: 'Jan', v: 98000 },
  { m: 'Feb', v: 105000 },
  { m: 'Mar', v: 112000 },
  { m: 'Apr', v: 108000 },
  { m: 'Maj', v: 119000 },
  { m: 'Jun', v: 124560 },
];

type TabId = 'hem' | 'ekonomi' | 'resurser' | 'dagbok' | 'installningar';

function GoldDivider() {
  return <div className="basta-design__gold-divider" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="basta-design__section-label">{children}</p>;
}

function Card({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`basta-design__card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

function HomeScreen() {
  const { reduced, staggerContainer, staggerItem } = useBastaDesignMotion();
  const [focusTab, setFocusTab] = useState('barnfokus');
  const [planTab, setPlanTab] = useState('handling');
  const [anchor, setAnchor] = useState('Din ankarmening kan skrivas här...');
  const [editAnchor, setEditAnchor] = useState(false);

  const staggerRoot = reduced
    ? {}
    : { variants: staggerContainer, initial: 'hidden' as const, animate: 'visible' as const };
  const staggerChild = reduced ? {} : { variants: staggerItem };

  const focusTabs = [
    { id: 'barnfokus', label: 'Barnfokus' },
    { id: 'ny-stund', label: 'Ny stund' },
    { id: 'fysiologi', label: 'Fysiologi' },
    { id: 'mer', label: 'Mer…' },
  ];

  const planTabs = [
    { id: 'handling', label: 'Handling' },
    { id: 'projekt', label: 'Projekt' },
    { id: 'vanor', label: 'Vanor' },
    { id: 'makro', label: 'Makro' },
  ];

  const tasks = [
    { id: 1, text: 'Planera veckans måltider', done: true },
    { id: 2, text: 'Ring till föräldrar', done: false },
    { id: 3, text: '30 min promenad utomhus', done: false },
  ];

  const notes = [
    { date: '22 Jun', type: 'Spint', title: 'Reflektioner om prioritering' },
    { date: '20 Jun', type: 'Tron', title: 'Varför gör jag det här?' },
    { date: '18 Jun', type: 'Tacksan', title: 'Tre saker jag är tacksam för' },
  ];

  return (
    <motion.div className="basta-design__main-inner" {...staggerRoot}>
      <motion.div className="basta-design__hero" {...staggerChild}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&auto=format"
          alt="Solnedgång över berg och vatten"
          className="basta-design__hero-img"
        />
        <div className="basta-design__hero-overlay" />
        <div className="basta-design__hero-content">
          <div className="basta-design__hero-main">
            <SectionLabel>Dagens reflektion</SectionLabel>
            <h2 className="basta-design__hero-title">
              Stanna upp.
              <br />
              <em>Känn efter.</em>
            </h2>
            <p className="basta-design__hero-lead">
              En stund för dig själv,
              <br />
              är aldrig bortkastad.
            </p>
            <button type="button" className="basta-design__btn-gold">
              <PenLine size={12} />
              Skriv nu
            </button>
          </div>
          <aside className="basta-design__hero-aside">
            <p className="basta-design__hero-aside-label">Reflektionsfråga</p>
            <p>Du är den trygga hamnen — även när våren känns splittrad.</p>
            <GoldDivider />
            <p className="basta-design__hero-aside-label">Vad vill din inre Kasper säga — en sak?</p>
            <p className="basta-design__hero-aside-foot">Skriv det första som dyker upp...</p>
          </aside>
        </div>
      </motion.div>

      <motion.div className="basta-design__grid-2" {...staggerChild}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Target size={14} color="var(--bd-accent)" />
            <SectionLabel>Dagens fokus</SectionLabel>
          </div>
          <h3 className="basta-design__card-title">Barnfokus</h3>
          <p className="basta-design__card-meta">Dagens fokus — Högt, sista, lika kärna</p>
          <div className="basta-design__tabs-row">
            {focusTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFocusTab(t.id)}
                className={`basta-design__tab ${focusTab === t.id ? 'basta-design__tab--on' : 'basta-design__tab--off'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className="basta-design__link">
            Lär känna <ChevronRight size={12} />
          </button>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <MessageSquare size={14} color="var(--bd-accent)" />
            <SectionLabel>Fråga livscoachen</SectionLabel>
          </div>
          <p className="basta-design__card-meta">Har du någon fråga du vill ställa?</p>
          <div className="basta-design__coach-bubble">Hur har det gått den senaste veckan?</div>
          <p className="basta-design__card-meta">Gäller välmående och hur?</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="basta-design__btn-gold">
              Fråga
            </button>
            <button type="button" className="basta-design__btn-ghost">
              Utforska
            </button>
          </div>
        </Card>
      </motion.div>

      <motion.div {...staggerChild}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Anchor size={14} color="var(--bd-accent)" />
            <SectionLabel>Dagens ankare</SectionLabel>
          </div>
          <Star size={14} color="var(--bd-accent)" />
        </div>
        {editAnchor ? (
          <textarea
            className="basta-design__textarea"
            value={anchor}
            onChange={(e) => setAnchor(e.target.value)}
            onBlur={() => setEditAnchor(false)}
            autoFocus
          />
        ) : (
          <p
            className="basta-design__card-meta"
            style={{ fontFamily: 'var(--bd-font-serif)', fontStyle: 'italic', cursor: 'pointer' }}
            onClick={() => setEditAnchor(true)}
            onKeyDown={(e) => e.key === 'Enter' && setEditAnchor(true)}
            role="button"
            tabIndex={0}
          >
            {anchor}
          </p>
        )}
        <button type="button" className="basta-design__link" style={{ marginTop: '0.75rem' }} onClick={() => setEditAnchor(true)}>
          <Plus size={10} /> Spara ankare
        </button>
      </Card>
      </motion.div>

      <motion.div {...staggerChild}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Target size={14} color="var(--bd-accent)" />
          <SectionLabel>Planering</SectionLabel>
        </div>
        <div className="basta-design__tabs-row">
          {planTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setPlanTab(t.id)}
              className={`basta-design__tab ${planTab === t.id ? 'basta-design__tab--on' : 'basta-design__tab--off'}`}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>Tisdag</span>
        </div>
        <SectionLabel>Dagens uppgifter</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.map((task) => (
            <div key={task.id} className="basta-design__check-row">
              <div
                className={`basta-design__checkbox ${task.done ? 'basta-design__checkbox--done' : 'basta-design__checkbox--open'}`}
              >
                {task.done ? <Check size={10} color="var(--bd-accent-fg)" /> : null}
              </div>
              <span className={`basta-design__task-text ${task.done ? 'basta-design__task-text--done' : ''}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
        <button type="button" className="basta-design__link" style={{ marginTop: '0.75rem' }}>
          <Plus size={10} /> Lägg till uppgift
        </button>
      </Card>
      </motion.div>

      <motion.div {...staggerChild}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <SectionLabel>Tidigare anteckningar</SectionLabel>
          <button type="button" className="basta-design__link" style={{ fontSize: '0.625rem' }}>
            Visa alla →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {notes.map((n) => (
            <Card key={n.title} className="basta-design__note-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="basta-design__badge">{n.type}</span>
                <span className="basta-design__task-text">{n.title}</span>
              </div>
              <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>{n.date}</span>
            </Card>
          ))}
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}

function EkonomScreen() {
  const expenses = [
    { label: 'Boende', amount: '18 500 kr', pct: 62 },
    { label: 'Planering', amount: '4 200 kr', pct: 28 },
    { label: 'Hälsa', amount: '2 800 kr', pct: 18 },
    { label: 'Nöje', amount: '1 560 kr', pct: 10 },
    { label: 'Sparkonto', amount: '12 000 kr', pct: 80 },
  ];

  return (
    <div className="basta-design__main-inner">
      <Card>
        <SectionLabel>Totalt / Augusti</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="basta-design__stat-big">124 560</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--bd-text-muted)', marginBottom: '0.25rem' }}>kr</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--bd-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={12} /> +8,3%
          </span>
        </div>
        <p className="basta-design__card-meta">Jämfört med förra månaden</p>
        <div style={{ height: '10rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={economyData}>
              <defs>
                <linearGradient id="bdGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a435" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a435" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fill: '#7a7a9a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: '#10131e',
                  border: '1px solid rgba(201,164,53,0.3)',
                  borderRadius: 8,
                  color: '#f0ead8',
                  fontSize: 11,
                }}
                formatter={(v) => [`${Number(v).toLocaleString()} kr`, 'Saldo']}
              />
              <Area type="monotone" dataKey="v" stroke="#c9a435" strokeWidth={2} fill="url(#bdGoldGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <SectionLabel>Fördelning</SectionLabel>
      {expenses.map((e) => (
        <Card key={e.label} style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ color: 'var(--bd-text-body)', fontSize: '0.875rem' }}>{e.label}</span>
            <span style={{ color: 'var(--bd-accent)', fontSize: '0.875rem', fontWeight: 500 }}>{e.amount}</span>
          </div>
          <div className="basta-design__progress-track">
            <div className="basta-design__progress-fill" style={{ width: `${e.pct}%` }} />
          </div>
        </Card>
      ))}

      <div className="basta-design__stat-grid">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Wallet size={14} color="var(--bd-success)" />
            <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>Inkomst</span>
          </div>
          <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--bd-success)' }}>42 000 kr</span>
          <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>denna månaden</span>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <CreditCard size={14} color="var(--bd-danger)" />
            <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>Utgifter</span>
          </div>
          <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--bd-danger)' }}>29 440 kr</span>
          <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>denna månaden</span>
        </Card>
      </div>
    </div>
  );
}

function ResurserScreen() {
  const categories = [
    { icon: Brain, label: 'Ekonomi', count: 8 },
    { icon: Heart, label: 'Planering', count: 5 },
    { icon: Leaf, label: 'Hälsokost', count: 12 },
    { icon: Dumbbell, label: 'Rörelse', count: 7 },
    { icon: BookOpen, label: 'Dagbok', count: 3 },
    { icon: Users, label: 'Familjen', count: 6 },
    { icon: Sun, label: 'Välmående', count: 9 },
    { icon: Zap, label: 'Motivation', count: 4 },
  ];

  return (
    <div className="basta-design__main-inner">
      <div className="basta-design__res-hero">
        <img
          src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=300&fit=crop&auto=format"
          alt="Solnedgång"
          className="basta-design__hero-img"
        />
        <div className="basta-design__hero-overlay" style={{ background: 'rgba(8,10,18,0.75)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <SectionLabel>Dina resurser</SectionLabel>
          <p className="basta-design__card-title">Hitta din styrka</p>
          <p className="basta-design__card-meta">Verktyg och inspiration för varje område i ditt liv</p>
        </div>
      </div>

      <div className="basta-design__res-grid">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="basta-design__res-tile">
              <Icon size={16} color="var(--bd-accent)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--bd-text-body)' }}>{c.label}</span>
              <span className="basta-design__badge">{c.count} resurser</span>
            </Card>
          );
        })}
      </div>

      <SectionLabel>Ny resurs</SectionLabel>
      <Card style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
        <Plus size={16} color="var(--bd-accent)" />
        <span style={{ fontSize: '0.875rem', color: 'var(--bd-text-body)' }}>Lägg till ny resurs</span>
      </Card>
    </div>
  );
}

function DagbokScreen() {
  const [entry, setEntry] = useState('');
  const entries = [
    { date: '22 Jun 2026', title: 'En lugn tisdag', preview: 'Idag kände jag mig mer centrerad än på länge. Tog en lång promenad och...' },
    { date: '19 Jun 2026', title: 'Reflektioner kring förändring', preview: 'Det är märkligt hur snabbt livet kan förändras när man börjar ta ansvar...' },
    { date: '15 Jun 2026', title: 'Tacksamhetslista', preview: '1. Min hälsa. 2. Min familj. 3. Möjligheten att växa som person...' },
  ];

  return (
    <div className="basta-design__main-inner">
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <PenLine size={14} color="var(--bd-accent)" />
          <SectionLabel>Ny anteckning</SectionLabel>
          <span style={{ marginLeft: 'auto', fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>
            {new Date().toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <textarea
          className="basta-design__textarea basta-design__textarea--large"
          placeholder="Hur är du idag? Skriv fritt..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)' }}>{entry.length} tecken</span>
          <button type="button" className="basta-design__btn-gold">
            <Send size={11} /> Spara
          </button>
        </div>
      </Card>

      <SectionLabel>Tidigare inlägg</SectionLabel>
      {entries.map((e) => (
        <Card key={e.title} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--bd-font-serif)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--bd-text)' }}>
              {e.title}
            </span>
            <span style={{ fontSize: '0.625rem', color: 'var(--bd-text-muted)', flexShrink: 0, marginLeft: '0.75rem' }}>{e.date}</span>
          </div>
          <p style={{ fontSize: '0.75rem', lineHeight: 1.6, color: 'var(--bd-text-muted)', margin: 0 }}>{e.preview}</p>
        </Card>
      ))}
    </div>
  );
}

function InstallningarScreen() {
  const sections = [
    { title: 'Konto & Profil', items: ['Profil', 'Prenumeration', 'Säkerhet & lösenord'] },
    { title: 'Upplevelse', items: ['Notifikationer', 'Tema', 'Språk & region'] },
    { title: 'Data & Sync', items: ['Exportera data', 'Importera data', 'Säkerhetskopiering'] },
    { title: 'Support', items: ['Hjälpcenter', 'Kontakta oss', 'Om Livskompassen'] },
  ];

  return (
    <div className="basta-design__main-inner">
      <Card className="basta-design__profile">
        <div className="basta-design__avatar">
          <Compass size={24} color="var(--bd-accent-fg)" />
        </div>
        <div>
          <p style={{ margin: 0, fontFamily: 'var(--bd-font-display)', fontWeight: 600, color: 'var(--bd-text)' }}>Pontus</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--bd-text-muted)' }}>pontus@livskompassen.se</p>
          <span className="basta-design__badge" style={{ marginTop: '0.25rem', display: 'inline-block' }}>
            Premium
          </span>
        </div>
      </Card>

      {sections.map((s) => (
        <div key={s.title}>
          <SectionLabel>{s.title}</SectionLabel>
          {s.items.map((item) => (
            <button key={item} type="button" className="basta-design__settings-row">
              {item}
              <ChevronRight size={14} color="var(--bd-text-muted)" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function DockCompass() {
  return (
    <svg width="64" height="64" viewBox="0 0 180 180" fill="none" aria-hidden>
      <defs>
        <radialGradient id="bdDockGoldGlow">
          <stop offset="0%" stopColor="#F7D774" />
          <stop offset="100%" stopColor="#A77A16" />
        </radialGradient>
        <radialGradient id="bdDockCenterGlow">
          <stop offset="0%" stopColor="#FFD76A" />
          <stop offset="100%" stopColor="#2D1B00" />
        </radialGradient>
        <filter id="bdDockShadow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <circle cx="90" cy="90" r="78" fill="url(#bdDockCenterGlow)" opacity="0.25" filter="url(#bdDockShadow)" />
      <circle cx="90" cy="90" r="72" stroke="url(#bdDockGoldGlow)" strokeWidth="3" />
      <circle cx="90" cy="90" r="58" stroke="rgba(247,215,116,0.45)" strokeWidth="1.5" />
      <polygon points="90,22 102,78 158,90 102,102 90,158 78,102 22,90 78,78" fill="url(#bdDockGoldGlow)" />
      <polygon points="90,40 98,82 140,90 98,98 90,140 82,98 40,90 82,82" fill="#06101B" />
      <circle cx="90" cy="90" r="10" fill="url(#bdDockGoldGlow)" />
    </svg>
  );
}

/** Full interaktiv Figma-ref från mappen «bästa design». Mockdata only. */
export function BastaDesignApp() {
  const { screen, screenTransition } = useBastaDesignMotion();
  const [activeTab, setActiveTab] = useState<TabId>('hem');

  const screens: Record<TabId, React.ReactNode> = {
    hem: <HomeScreen />,
    ekonomi: <EkonomScreen />,
    resurser: <ResurserScreen />,
    dagbok: <DagbokScreen />,
    installningar: <InstallningarScreen />,
  };

  const dockItems: { id: TabId; label: string; icon: React.ReactNode; fab?: boolean }[] = [
    { id: 'dagbok', label: 'ANTECKNINGAR', icon: <NotebookPen size={18} /> },
    { id: 'installningar', label: 'FAMILJ', icon: <Users2 size={18} /> },
    { id: 'hem', label: 'KOMPASSEN', icon: <DockCompass />, fab: true },
    { id: 'ekonomi', label: 'RECEPT', icon: <UtensilsCrossed size={18} /> },
    { id: 'resurser', label: 'RESURSER', icon: <Library size={18} /> },
  ];

  return (
    <div className="basta-design">
      <header className="basta-design__header">
        <button type="button" className="basta-design__header-btn" aria-label="Meny">
          <Menu size={20} />
        </button>
        <div className="basta-design__header-brand">
          <h1 className="basta-design__header-title">Livskompassen</h1>
          <div className="basta-design__header-ornament" aria-hidden>
            <div className="basta-design__header-ornament-line" />
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <polygon points="5,0 8,3 5,6 2,3" fill="#c9a435" opacity="0.7" />
            </svg>
            <svg width="5" height="5" viewBox="0 0 5 5" fill="none" className="basta-design__header-ornament-gem">
              <circle cx="2.5" cy="2.5" r="1.5" fill="#c9a435" opacity="0.5" />
            </svg>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <polygon points="5,0 8,3 5,6 2,3" fill="#c9a435" opacity="0.7" />
            </svg>
            <div className="basta-design__header-ornament-line" />
          </div>
        </div>
        <div className="basta-design__header-actions">
          <button type="button" className="basta-design__header-icon-btn" aria-label="Inställningar">
            <Settings size={14} />
          </button>
          <button type="button" className="basta-design__header-icon-btn" aria-label="Profil">
            <User size={14} />
          </button>
          <button type="button" className="basta-design__header-icon-btn" aria-label="Notiser">
            <Bell size={14} />
          </button>
        </div>
      </header>

      <main className="basta-design__main">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} {...screen} transition={screenTransition}>
            {screens[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="basta-design__dock" aria-label="Huvudnavigering">
        <div className="basta-design__dock-inner">
          {dockItems.map((item) => {
            const isOn = activeTab === item.id;
            const color = isOn ? 'var(--bd-accent)' : 'var(--bd-text-muted)';
            if (item.fab) {
              return (
                <button
                  key={item.id}
                  type="button"
                  className="basta-design__dock-item basta-design__dock-item--fab"
                  onClick={() => setActiveTab(item.id)}
                  aria-label={item.label}
                >
                  <div className="basta-design__dock-fab">{item.icon}</div>
                  <span className={`basta-design__dock-label ${isOn ? 'basta-design__dock-label--on' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            }
            return (
              <button key={item.id} type="button" className="basta-design__dock-item" onClick={() => setActiveTab(item.id)}>
                <span style={{ color }}>{item.icon}</span>
                <span className={`basta-design__dock-label ${isOn ? 'basta-design__dock-label--on' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default BastaDesignApp;
