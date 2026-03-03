'use client';

import { useEffect } from 'react';
import useNavigationContext from '@/context/navigationContext';

interface PageSettingsProps {
  isLogoVisible?: boolean;
}

export function PageSettings({ isLogoVisible }: PageSettingsProps) {
  const { setIsLogoVisible } = useNavigationContext();

  useEffect(() => {
    setIsLogoVisible(isLogoVisible ?? true);
  }, [isLogoVisible, setIsLogoVisible]);

  return null;
}
