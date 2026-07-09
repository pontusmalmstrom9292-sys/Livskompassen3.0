import { useState } from "react";
import {
  Compass,
  Star,
  ChevronDown,
  ChevronRight,
  Plus,
  BookOpen,
  Target,
  Anchor,
  MessageSquare,
  Send,
  BarChart2,
  Library,
  Settings,
  Home,
  PenLine,
  Check,
  Bell,
  Shield,
  Menu,
  User,
  UtensilsCrossed,
  NotebookPen,
  Users2,
  Landmark,
  Inbox,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  FileText,
  Sun,
  Moon,
  Leaf,
  Zap,
  Heart,
  Brain,
  Dumbbell,
  Users,
  DollarSign,
  Wallet,
  CreditCard,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const economyData = [
  { m: "Jan", v: 98000 },
  { m: "Feb", v: 105000 },
  { m: "Mar", v: 112000 },
  { m: "Apr", v: 108000 },
  { m: "Maj", v: 119000 },
  { m: "Jun", v: 124560 },
];

function GoldDivider() {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      className="text-[10px] tracking-[0.2em] uppercase font-medium mb-2"
      style={{ color: "#c9a435", fontFamily: "Cinzel, serif" }}
    >
      {children}
    </p>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{
        background: "#10131e",
        borderColor: "rgba(201,164,53,0.15)",
      }}
    >
      {children}
    </div>
  );
}

/* ── HOME SCREEN ─────────────────────────────────────────── */
function HomeScreen() {
  const [focusTab, setFocusTab] = useState("barnfokus");
  const [planTab, setPlanTab] = useState("handling");
  const [chatMsg, setChatMsg] = useState("");
  const [anchor, setAnchor] = useState(
    "Din ankarmening kan skrivas här...",
  );
  const [editAnchor, setEditAnchor] = useState(false);

  const focusTabs = [
    { id: "barnfokus", label: "Barnfokus" },
    { id: "ky-stund", label: "Ky stund" },
    { id: "fysiologi", label: "Fysiologi" },
    { id: "meg", label: "Meg" },
  ];

  const planTabs = [
    { id: "handling", label: "Handling" },
    { id: "projekt", label: "Projekt" },
    { id: "habig", label: "Habig" },
    { id: "makro", label: "Makro" },
  ];

  const tasks = [
    { id: 1, text: "Planera veckans måltider", done: true },
    { id: 2, text: "Ring till föräldrar", done: false },
    { id: 3, text: "30 min promenad utomhus", done: false },
  ];

  const notes = [
    {
      date: "22 Jun",
      type: "Spint",
      title: "Reflektioner om prioritering",
    },
    {
      date: "20 Jun",
      type: "Tron",
      title: "Varför gör jag det här?",
    },
    {
      date: "18 Jun",
      type: "Tacksan",
      title: "Tre saker jag är tacksam för",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* HERO REFLECTION */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ minHeight: 200 }}
      >
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&auto=format"
          alt="Solnedgång över berg och vatten"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,10,18,0.85) 0%, rgba(8,10,18,0.3) 50%, rgba(8,10,18,0.7) 100%)",
          }}
        />
        <div className="relative z-10 p-5 flex gap-4">
          <div className="flex-1">
            <SectionLabel>Dagens reflektion</SectionLabel>
            <h2
              className="text-2xl font-semibold leading-tight mb-3"
              style={{
                fontFamily: "Lora, serif",
                color: "#f0ead8",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              Stanna upp.
              <br />
              <em>Känn efter.</em>
            </h2>
            <p
              className="text-xs mb-4"
              style={{ color: "#b8b0a0" }}
            >
              En stund för dig själv,
              <br />
              är aldrig bortkastad.
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{
                background: "#c9a435",
                color: "#080a12",
                fontFamily: "Cinzel, serif",
                letterSpacing: "0.05em",
              }}
            >
              <PenLine size={12} />
              Skriv nu
            </button>
          </div>
          <div
            className="w-36 rounded-xl p-3 flex flex-col gap-2 text-xs"
            style={{
              background: "rgba(8,10,18,0.75)",
              borderLeft: "1px solid rgba(201,164,53,0.3)",
            }}
          >
            <p
              style={{
                color: "#c9a435",
                fontSize: 10,
                letterSpacing: "0.1em",
              }}
            >
              Reflektionsfråga
            </p>
            <p style={{ color: "#d8d0c0", lineHeight: 1.5 }}>
              Du är lite trygga hamnen — även när våren känns
              splittrad.
            </p>
            <GoldDivider />
            <p
              style={{
                color: "#c9a435",
                fontSize: 10,
                letterSpacing: "0.1em",
              }}
            >
              Vad vill din inre Kasper säga — en sak?
            </p>
            <p
              style={{
                color: "#7a7a9a",
                lineHeight: 1.5,
                fontSize: 10,
              }}
            >
              Skriv det första som dyker upp...
            </p>
          </div>
        </div>
      </div>

      {/* FOCUS + LIVSCOACH row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* DAGENS FOKUS */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} style={{ color: "#c9a435" }} />
            <SectionLabel>Dagens fokus</SectionLabel>
          </div>
          <h3
            className="text-lg font-semibold mb-1"
            style={{
              fontFamily: "Lora, serif",
              color: "#f0ead8",
            }}
          >
            Barnfokus
          </h3>
          <p
            className="text-xs mb-3"
            style={{ color: "#7a7a9a" }}
          >
            Dagern Fokus — Högt, sista, lika kärna
          </p>
          <div className="flex gap-1 mb-3 flex-wrap">
            {focusTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setFocusTab(t.id)}
                className="px-2 py-1 rounded text-[10px] font-medium transition-all"
                style={
                  focusTab === t.id
                    ? {
                        background: "#c9a435",
                        color: "#080a12",
                        fontFamily: "Cinzel, serif",
                        letterSpacing: "0.05em",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#7a7a9a",
                      }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
            style={{ color: "#c9a435" }}
          >
            Lär känna <ChevronRight size={12} />
          </button>
        </Card>

        {/* FRÅGA LIVSCOACHEN */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare
              size={14}
              style={{ color: "#c9a435" }}
            />
            <SectionLabel>Fråga livscoachen</SectionLabel>
          </div>
          <p
            className="text-xs mb-3"
            style={{ color: "#7a7a9a" }}
          >
            Har du någon fråga du vill ställa?
          </p>
          <div
            className="rounded-lg p-2 text-xs mb-3"
            style={{
              background: "rgba(201,164,53,0.12)",
              border: "1px solid rgba(201,164,53,0.25)",
              color: "#c9a435",
            }}
          >
            Hur har det gått sedan senast veckoden?
          </div>
          <p
            className="text-xs mb-3"
            style={{ color: "#7a7a9a" }}
          >
            Har det gäller välmående och hur?
          </p>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: "#c9a435",
                color: "#080a12",
              }}
            >
              Fråga
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#7a7a9a",
              }}
            >
              Utforska
            </button>
          </div>
        </Card>
      </div>

      {/* DAGENS ANKAR */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Anchor size={14} style={{ color: "#c9a435" }} />
            <SectionLabel>Dagens ankar</SectionLabel>
          </div>
          <Star size={14} style={{ color: "#c9a435" }} />
        </div>
        {editAnchor ? (
          <textarea
            className="w-full text-sm rounded-lg p-2 resize-none outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#f0ead8",
              border: "1px solid rgba(201,164,53,0.3)",
              minHeight: 60,
            }}
            value={anchor}
            onChange={(e) => setAnchor(e.target.value)}
            onBlur={() => setEditAnchor(false)}
            autoFocus
          />
        ) : (
          <p
            className="text-sm italic cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              color: "#d8d0c0",
              fontFamily: "Lora, serif",
            }}
            onClick={() => setEditAnchor(true)}
          >
            {anchor}
          </p>
        )}
        <button
          className="mt-3 text-xs flex items-center gap-1 transition-opacity hover:opacity-80"
          style={{ color: "#c9a435" }}
          onClick={() => setEditAnchor(true)}
        >
          <Plus size={10} /> Spara ankar
        </button>
      </Card>

      {/* PLANERING */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} style={{ color: "#c9a435" }} />
          <SectionLabel>Planering</SectionLabel>
        </div>
        <div className="flex gap-1 mb-4 flex-wrap">
          {planTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setPlanTab(t.id)}
              className="px-2 py-1 rounded text-[10px] font-medium transition-all"
              style={
                planTab === t.id
                  ? {
                      background: "#c9a435",
                      color: "#080a12",
                      fontFamily: "Cinzel, serif",
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      color: "#7a7a9a",
                    }
              }
            >
              {t.label.toUpperCase()}
            </button>
          ))}
          <span
            className="ml-auto text-[10px]"
            style={{ color: "#7a7a9a" }}
          >
            Tisdag
          </span>
        </div>

        <p
          className="text-xs mb-3"
          style={{
            color: "#c9a435",
            fontFamily: "Cinzel, serif",
            letterSpacing: "0.1em",
          }}
        >
          Dagens uppgifter
        </p>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3"
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  border: task.done
                    ? "none"
                    : "1px solid rgba(201,164,53,0.4)",
                  background: task.done
                    ? "#c9a435"
                    : "transparent",
                }}
              >
                {task.done && (
                  <Check size={10} color="#080a12" />
                )}
              </div>
              <span
                className="text-xs"
                style={{
                  color: task.done ? "#7a7a9a" : "#d8d0c0",
                  textDecoration: task.done
                    ? "line-through"
                    : "none",
                }}
              >
                {task.text}
              </span>
            </div>
          ))}
        </div>
        <button
          className="mt-3 flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
          style={{ color: "#c9a435" }}
        >
          <Plus size={10} /> Lägg till uppgift
        </button>
      </Card>

      {/* TIDIGARE ANTECKNINGAR */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Tidigare anteckningar</SectionLabel>
          <button
            className="text-[10px]"
            style={{ color: "#c9a435" }}
          >
            Visa alla →
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {notes.map((n, i) => (
            <Card
              key={i}
              className="flex items-center justify-between py-3 px-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(201,164,53,0.15)",
                    color: "#c9a435",
                    fontFamily: "Cinzel, serif",
                  }}
                >
                  {n.type}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "#d8d0c0" }}
                >
                  {n.title}
                </span>
              </div>
              <span
                className="text-[10px]"
                style={{ color: "#7a7a9a" }}
              >
                {n.date}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── EKONOMI SCREEN ──────────────────────────────────────── */
function EkonomScreen() {
  const expenses = [
    { label: "Boende", amount: "18 500 kr", pct: 62 },
    { label: "Planering", amount: "4 200 kr", pct: 28 },
    { label: "Hälsa", amount: "2 800 kr", pct: 18 },
    { label: "Nöje", amount: "1 560 kr", pct: 10 },
    { label: "Sparkonto", amount: "12 000 kr", pct: 80 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <SectionLabel>Totalt / Augusti</SectionLabel>
        <div className="flex items-end gap-2 mb-1">
          <span
            className="text-3xl font-semibold"
            style={{
              color: "#c9a435",
              fontFamily: "Cinzel, serif",
            }}
          >
            124 560
          </span>
          <span
            className="text-sm mb-1"
            style={{ color: "#7a7a9a" }}
          >
            kr
          </span>
          <span
            className="ml-auto text-xs flex items-center gap-1"
            style={{ color: "#4ade80" }}
          >
            <TrendingUp size={12} /> +8,3%
          </span>
        </div>
        <p
          className="text-xs mb-4"
          style={{ color: "#7a7a9a" }}
        >
          Jämfört med förra månaden
        </p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={economyData}>
              <defs>
                <linearGradient
                  id="lkGoldGrad1"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#c9a435"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#c9a435"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="m"
                tick={{ fill: "#7a7a9a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#10131e",
                  border: "1px solid rgba(201,164,53,0.3)",
                  borderRadius: 8,
                  color: "#f0ead8",
                  fontSize: 11,
                }}
                formatter={(v: number) => [
                  `${v.toLocaleString()} kr`,
                  "Saldo",
                ]}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="#c9a435"
                strokeWidth={2}
                fill="url(#lkGoldGrad1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <SectionLabel>Fördelning</SectionLabel>
      <div className="flex flex-col gap-2">
        {expenses.map((e, i) => (
          <Card key={i} className="py-3">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-sm"
                style={{ color: "#d8d0c0" }}
              >
                {e.label}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "#c9a435" }}
              >
                {e.amount}
              </span>
            </div>
            <div
              className="h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${e.pct}%`,
                  background:
                    "linear-gradient(90deg, #c9a435, #f0c060)",
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={14} style={{ color: "#4ade80" }} />
            <span
              className="text-[10px]"
              style={{ color: "#7a7a9a" }}
            >
              Inkomst
            </span>
          </div>
          <span
            className="text-lg font-semibold"
            style={{ color: "#4ade80" }}
          >
            42 000 kr
          </span>
          <span
            className="text-[10px]"
            style={{ color: "#7a7a9a" }}
          >
            denna månaden
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard
              size={14}
              style={{ color: "#f87171" }}
            />
            <span
              className="text-[10px]"
              style={{ color: "#7a7a9a" }}
            >
              Utgifter
            </span>
          </div>
          <span
            className="text-lg font-semibold"
            style={{ color: "#f87171" }}
          >
            29 440 kr
          </span>
          <span
            className="text-[10px]"
            style={{ color: "#7a7a9a" }}
          >
            denna månaden
          </span>
        </Card>
      </div>
    </div>
  );
}

/* ── RESURSER SCREEN ─────────────────────────────────────── */
function ResurserScreen() {
  const categories = [
    { icon: <Brain size={16} />, label: "Ekonomi", count: 8 },
    { icon: <Heart size={16} />, label: "Planering", count: 5 },
    { icon: <Leaf size={16} />, label: "Hälsokost", count: 12 },
    {
      icon: <Dumbbell size={16} />,
      label: "Rörelse",
      count: 7,
    },
    { icon: <BookOpen size={16} />, label: "Dagbok", count: 3 },
    { icon: <Users size={16} />, label: "Familjen", count: 6 },
    { icon: <Sun size={16} />, label: "Välmående", count: 9 },
    { icon: <Zap size={16} />, label: "Motivation", count: 4 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ minHeight: 140 }}
      >
        <img
          src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=300&fit=crop&auto=format"
          alt="Solnedgång"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(8,10,18,0.75)" }}
        />
        <div className="relative z-10">
          <SectionLabel>Dina resurser</SectionLabel>
          <p
            className="text-xl font-semibold"
            style={{
              fontFamily: "Lora, serif",
              color: "#f0ead8",
            }}
          >
            Hitta din styrka
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "#b8b0a0" }}
          >
            Verktyg och inspiration för varje område i ditt liv
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((c, i) => (
          <Card
            key={i}
            className="flex flex-col items-center gap-2 py-5 cursor-pointer hover:border-amber-600/40 transition-colors"
          >
            <div style={{ color: "#c9a435" }}>{c.icon}</div>
            <span
              className="text-xs font-medium"
              style={{ color: "#d8d0c0" }}
            >
              {c.label}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(201,164,53,0.12)",
                color: "#c9a435",
              }}
            >
              {c.count} resurser
            </span>
          </Card>
        ))}
      </div>

      <SectionLabel>Ny resurs</SectionLabel>
      <Card className="flex items-center gap-3 cursor-pointer hover:border-amber-600/40 transition-colors">
        <Plus size={16} style={{ color: "#c9a435" }} />
        <span className="text-sm" style={{ color: "#d8d0c0" }}>
          Lägg till ny resurs
        </span>
      </Card>
    </div>
  );
}

/* ── DAGBOK SCREEN ───────────────────────────────────────── */
function DagbokScreen() {
  const [entry, setEntry] = useState("");
  const entries = [
    {
      date: "22 Jun 2026",
      title: "En lugn tisdag",
      preview:
        "Idag kände jag mig mer centrerad än på länge. Tog en lång promenad och...",
    },
    {
      date: "19 Jun 2026",
      title: "Reflektioner kring förändring",
      preview:
        "Det är märkligt hur snabbt livet kan förändras när man börjar ta ansvar...",
    },
    {
      date: "15 Jun 2026",
      title: "Tacksamhetslista",
      preview:
        "1. Min hälsa. 2. Min familj. 3. Möjligheten att växa som person...",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <PenLine size={14} style={{ color: "#c9a435" }} />
          <SectionLabel>Ny anteckning</SectionLabel>
          <span
            className="ml-auto text-[10px]"
            style={{ color: "#7a7a9a" }}
          >
            {new Date().toLocaleDateString("sv-SE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
        <textarea
          className="w-full text-sm rounded-lg p-3 resize-none outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "#f0ead8",
            border: "1px solid rgba(201,164,53,0.2)",
            minHeight: 120,
            fontFamily: "Lora, serif",
            lineHeight: 1.7,
          }}
          placeholder="Hur är du idag? Skriv fritt..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3">
          <span
            className="text-[10px]"
            style={{ color: "#7a7a9a" }}
          >
            {entry.length} tecken
          </span>
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ background: "#c9a435", color: "#080a12" }}
          >
            <Send size={11} /> Spara
          </button>
        </div>
      </Card>

      <SectionLabel>Tidigare inlägg</SectionLabel>
      <div className="flex flex-col gap-3">
        {entries.map((e, i) => (
          <Card
            key={i}
            className="cursor-pointer hover:border-amber-600/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-1">
              <span
                className="text-sm font-medium"
                style={{
                  color: "#f0ead8",
                  fontFamily: "Lora, serif",
                }}
              >
                {e.title}
              </span>
              <span
                className="text-[10px] ml-3 flex-shrink-0"
                style={{ color: "#7a7a9a" }}
              >
                {e.date}
              </span>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "#7a7a9a" }}
            >
              {e.preview}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── INSTÄLLNINGAR SCREEN ────────────────────────────────── */
function InstallningarScreen() {
  const sections = [
    {
      title: "Konto & Profil",
      items: ["Profil", "Prenumeration", "Säkerhet & lösenord"],
    },
    {
      title: "Upplevelse",
      items: ["Notifikationer", "Tema", "Språk & region"],
    },
    {
      title: "Data & Sync",
      items: [
        "Exportera data",
        "Importera data",
        "Säkerhetskopiering",
      ],
    },
    {
      title: "Support",
      items: [
        "Hjälpcenter",
        "Kontakta oss",
        "Om Livskompassen",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Profile card */}
      <Card className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, #c9a435, #8a6a20)",
          }}
        >
          <Compass size={24} color="#080a12" />
        </div>
        <div>
          <p
            className="font-semibold"
            style={{
              color: "#f0ead8",
              fontFamily: "Cinzel, serif",
            }}
          >
            Kasper Livsson
          </p>
          <p className="text-xs" style={{ color: "#7a7a9a" }}>
            kasper@livskompassen.se
          </p>
          <span
            className="text-[10px] px-2 py-0.5 rounded mt-1 inline-block"
            style={{
              background: "rgba(201,164,53,0.15)",
              color: "#c9a435",
            }}
          >
            Premium
          </span>
        </div>
      </Card>

      {sections.map((s, si) => (
        <div key={si}>
          <SectionLabel>{s.title}</SectionLabel>
          <div className="flex flex-col">
            {s.items.map((item, ii) => (
              <button
                key={ii}
                className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-white/5"
                style={{
                  color: "#d8d0c0",
                  borderBottom:
                    ii < s.items.length - 1
                      ? "1px solid rgba(201,164,53,0.08)"
                      : "none",
                  background: ii === 0 ? "#10131e" : "#10131e",
                  borderRadius:
                    ii === 0 && s.items.length === 1
                      ? "0.75rem"
                      : ii === 0
                        ? "0.75rem 0.75rem 0 0"
                        : ii === s.items.length - 1
                          ? "0 0 0.75rem 0.75rem"
                          : "0",
                }}
              >
                {item}
                <ChevronRight
                  size={14}
                  style={{ color: "#7a7a9a" }}
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── MAIN APP ────────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState("hem");

  const tabs = [
    { id: "hem", label: "Hem", icon: Home },
    { id: "ekonomi", label: "Ekonomi", icon: BarChart2 },
    { id: "resurser", label: "Resurser", icon: Library },
    { id: "dagbok", label: "Dagbok", icon: BookOpen },
    {
      id: "installningar",
      label: "Inställningar",
      icon: Settings,
    },
  ];

  const screens: Record<string, React.ReactNode> = {
    hem: <HomeScreen />,
    ekonomi: <EkonomScreen />,
    resurser: <ResurserScreen />,
    dagbok: <DagbokScreen />,
    installningar: <InstallningarScreen />,
  };

  const titles: Record<string, string> = {
    hem: "Livskompassen",
    ekonomi: "Ekonomi",
    resurser: "Resurser",
    dagbok: "Dagbok",
    installningar: "Inställningar",
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#080a12",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Top nav */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(8,10,18,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201,164,53,0.15)",
        }}
      >
        {/* Hamburger */}
        <button
          className="p-1.5 rounded-lg"
          style={{ color: "#c9a435" }}
        >
          <Menu size={20} />
        </button>

        {/* Logo + ornament */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="text-sm tracking-[0.3em] uppercase"
            style={{
              color: "#c9a435",
              fontFamily: "Cinzel, serif",
              fontWeight: 600,
            }}
          >
            Livskompassen
          </h1>
          {/* Decorative diamond-dot ornament */}
          <div className="flex items-center gap-1">
            <div
              className="w-6 h-px"
              style={{ background: "rgba(201,164,53,0.4)" }}
            />
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <polygon
                points="5,0 8,3 5,6 2,3"
                fill="#c9a435"
                opacity="0.7"
              />
            </svg>
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              fill="none"
            >
              <circle
                cx="2.5"
                cy="2.5"
                r="1.5"
                fill="#c9a435"
                opacity="0.5"
              />
            </svg>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <polygon
                points="5,0 8,3 5,6 2,3"
                fill="#c9a435"
                opacity="0.7"
              />
            </svg>
            <div
              className="w-6 h-px"
              style={{ background: "rgba(201,164,53,0.4)" }}
            />
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(201,164,53,0.12)",
              color: "#c9a435",
            }}
          >
            <Settings size={14} />
          </button>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(201,164,53,0.12)",
              color: "#c9a435",
            }}
          >
            <User size={14} />
          </button>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(201,164,53,0.12)",
              color: "#c9a435",
            }}
          >
            <Bell size={14} />
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-36">
        <div className="max-w-2xl mx-auto">
          {screens[activeTab]}
        </div>
      </main>

      {/* Bottom dock */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30"
        style={{ height: 80, background: "#090c16", borderTop: "1px solid rgba(201,164,53,0.35)" }}
      >
        {/* Single flex row — all items bottom-aligned so compass rises above */}
        <div className="flex items-end justify-around h-full max-w-2xl mx-auto" style={{ paddingBottom: 8, paddingLeft: 8, paddingRight: 8 }}>

          {/* ANTECKNING */}
          <button onClick={() => setActiveTab("dagbok")} className="flex flex-col items-center gap-[3px]">
            <PenLine size={20} style={{ color: activeTab === "dagbok" ? "#c9a435" : "#44445a" }} />
            <span style={{ fontFamily: "Cinzel, serif", fontSize: 7, letterSpacing: "0.07em", color: activeTab === "dagbok" ? "#c9a435" : "#44445a" }}>ANTECKNING</span>
          </button>

          {/* FAMILJ */}
          <button onClick={() => setActiveTab("installningar")} className="flex flex-col items-center gap-[3px]">
            <Users2 size={20} style={{ color: activeTab === "installningar" ? "#c9a435" : "#44445a" }} />
            <span style={{ fontFamily: "Cinzel, serif", fontSize: 7, letterSpacing: "0.07em", color: activeTab === "installningar" ? "#c9a435" : "#44445a" }}>FAMILJ</span>
          </button>

          {/* COMPASS — taller, rises above bar via align-items:end */}
          <button onClick={() => setActiveTab("hem")} className="flex flex-col items-center" style={{ marginBottom: -8 }}>
            <svg width="76" height="76" viewBox="0 0 180 180" fill="none">
              <defs>
                <radialGradient id="cg1" cx="38%" cy="32%" r="65%">
                  <stop offset="0%" stopColor="#F7D774" />
                  <stop offset="100%" stopColor="#9A6E10" />
                </radialGradient>
                <radialGradient id="cg2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1c2438" />
                  <stop offset="100%" stopColor="#080b14" />
                </radialGradient>
              </defs>
              <circle cx="90" cy="90" r="89" fill="url(#cg2)" />
              <circle cx="90" cy="90" r="85" stroke="url(#cg1)" strokeWidth="3" fill="none" />
              <circle cx="90" cy="90" r="65" stroke="rgba(247,215,116,0.28)" strokeWidth="1" fill="none" />
              <polygon points="90,18 104,76 162,90 104,104 90,162 76,104 18,90 76,76" fill="url(#cg1)" />
              <polygon points="90,36 100,80 144,90 100,100 90,144 80,100 36,90 80,80" fill="#080b14" />
              <circle cx="90" cy="90" r="12" fill="url(#cg1)" />
              <circle cx="90" cy="90" r="5" fill="#080b14" />
            </svg>
          </button>

          {/* MENTIL */}
          <button onClick={() => setActiveTab("ekonomi")} className="flex flex-col items-center gap-[3px]">
            <Landmark size={20} style={{ color: activeTab === "ekonomi" ? "#c9a435" : "#44445a" }} />
            <span style={{ fontFamily: "Cinzel, serif", fontSize: 7, letterSpacing: "0.07em", color: activeTab === "ekonomi" ? "#c9a435" : "#44445a" }}>MENTIL</span>
          </button>

          {/* INKAST */}
          <button onClick={() => setActiveTab("resurser")} className="flex flex-col items-center gap-[3px]">
            <Inbox size={20} style={{ color: activeTab === "resurser" ? "#c9a435" : "#44445a" }} />
            <span style={{ fontFamily: "Cinzel, serif", fontSize: 7, letterSpacing: "0.07em", color: activeTab === "resurser" ? "#c9a435" : "#44445a" }}>INKAST</span>
          </button>

        </div>
      </nav>
    </div>
  );
}