type SaldoHeroProps = {
  label: string;
  amount: string;
  hint?: string;
};

export function SaldoHero({ label, amount, hint }: SaldoHeroProps) {
  return (
    <div className="glass-hero p-6 text-center">
      <p className="text-[10px] uppercase tracking-widest text-text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl font-light tabular-nums text-accent">{amount}</p>
      {hint && <p className="mt-2 text-sm text-text-muted">{hint}</p>}
    </div>
  );
}
