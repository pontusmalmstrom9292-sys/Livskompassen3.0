import { memo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/design-system';
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
        <Button variant="ghost" className="mt-4" onClick={returnToHub}>
          Tillbaka
        </Button>
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
