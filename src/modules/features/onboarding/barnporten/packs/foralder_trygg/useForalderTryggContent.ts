import { useState, useEffect } from 'react';
import type { ForalderTryggTip } from './types';
import manifestData from './manifest.json';

export const useForalderTryggContent = () => {
  const [tips, setTips] = useState<ForalderTryggTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulerar ett asynkront hämtande för att likna riktiga dynamiska modulladdningar
    const loadContent = () => {
      try {
        setTips(manifestData.tips as ForalderTryggTip[]);
      } catch (error) {
        console.error('Kunde inte ladda manifest för foralder_trygg:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  return { tips, isLoading };
};
