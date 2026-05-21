import { ClusterGrid } from '../ui/ClusterGrid';
import { AccountSecureBanner } from '../auth/AccountSecureBanner';

export function HomePage() {
  return (
    <div className="home-page space-y-5">
      <AccountSecureBanner />

      <header className="home-page__hero">
        <p className="home-page__eyebrow">Klusteröversikt</p>
        <h2 className="home-page__title">Välkommen Hem</h2>
        <p className="home-page__lead">
          Välj ett livsområde nedan — eller använd menyn längst ner.
        </p>
      </header>

      <ClusterGrid />
    </div>
  );
}
