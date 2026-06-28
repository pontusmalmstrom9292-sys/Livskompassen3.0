import { memo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/core/store';
import { useMabraStore } from '../store/mabraStore';
import { VitHubPreview } from '../components/VitHubPreview';
import { MABRA_PROJECTS } from '../constants/mabraProjects';

export const MabraProjectView = memo(function MabraProjectView() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  
  const { selectedPlan, setSelectedPlan, setHubOpenCategory, setHubFocusToken } = useMabraStore(
    useShallow((state) => ({
      selectedPlan: state.selectedPlan,
      setSelectedPlan: state.setSelectedPlan,
      setHubOpenCategory: state.setHubOpenCategory,
      setHubFocusToken: state.setHubFocusToken,
    }))
  );

  const activeProject = MABRA_PROJECTS.find((p) => p.id === projectId) ?? null;

  const returnToHub = useCallback(() => {
    setSelectedPlan(null);
    setHubOpenCategory('projekt');
    setHubFocusToken((n) => n + 1);
    navigate('/mabra');
  }, [navigate, setSelectedPlan, setHubOpenCategory, setHubFocusToken]);

  if (!activeProject) {
    return (
      <div className="p-4 text-center">
        <p className="text-text-muted">Okänt projekt: {projectId}</p>
        <button type="button" onClick={returnToHub} className="ds-btn ds-btn--ghost mt-4">
          Tillbaka
        </button>
      </div>
    );
  }

  return (
    <VitHubPreview
      project={activeProject}
      selectedPlan={selectedPlan}
      onSelectPlan={setSelectedPlan}
      userId={user?.uid}
      onBack={returnToHub}
    />
  );
});
