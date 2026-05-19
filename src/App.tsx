import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <MainLayout>
      <div className="text-center py-20">
        <h2 className="text-3xl text-[#FDE68A] font-light mb-4">
          Välkommen Hem
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto italic">
          "En trygg plats för din sanning, din ekonomi och din återhämtning."
        </p>
      </div>
    </MainLayout>
  );
}
