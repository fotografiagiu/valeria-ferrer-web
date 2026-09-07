import { useEffect, useState } from 'react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

declare global {
  interface Window {
    __vfInstallPrompt: InstallPromptEvent | null;
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

/** Android install prompt. Renders nothing where the browser can't install. */
export function InstallButton() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(
    () => window.__vfInstallPrompt
  );
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onReady = () => setPromptEvent(window.__vfInstallPrompt);
    const onInstalled = () => {
      window.__vfInstallPrompt = null;
      setPromptEvent(null);
      setInstalled(true);
    };
    window.addEventListener('vf-install-ready', onReady);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('vf-install-ready', onReady);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (isStandalone()) return null;
  if (installed) {
    return <p className="install-hint">App instalada. Ábrela desde el icono del móvil.</p>;
  }
  if (!promptEvent) return null;

  async function onInstall() {
    await promptEvent!.prompt();
    const { outcome } = await promptEvent!.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    window.__vfInstallPrompt = null;
    setPromptEvent(null);
  }

  return (
    <button type="button" className="install-btn" onClick={onInstall}>
      Instalar app en este móvil
    </button>
  );
}
