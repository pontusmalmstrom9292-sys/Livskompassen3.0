import { MainLayout } from './components/layout/MainLayout';
import KnowledgeVaultChat from './components/KnowledgeVaultChat';
import { DashboardPage, EconomyPage, SafeHarborPage, VaultPage } from './pages/vault';

export default function App() {
  return (
    <MainLayout>
      <div className="text-center py-20 space-y-8">
        <h2 className="text-3xl text-[#FDE68A] font-light mb-4">
          Välkommen Hem
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto italic">
          "En trygg plats för din sanning, din ekonomi och din återhämtning."
        </p>
        <div className="max-w-2xl mx-auto">
          <KnowledgeVaultChat />
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          <DashboardPage />
          <VaultPage />
          <SafeHarborPage />
          <EconomyPage />
        </div>
      </div>
    </MainLayout>
  );
}
