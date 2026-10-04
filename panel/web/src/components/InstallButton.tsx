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

type Props = {
  variant?: 'compact' | 'hero';
};

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function isAndroidChrome(): boolean {
  const ua = navigator.userAgent;
  return /Android/i.test(ua) && /Chrome/i.test(ua) && !/EdgA|OPR|SamsungBrowser|Firefox/i.test(ua);
}

/** Install prompt for Android and desktop. Always visible on the install page. */
export function InstallButton({ variant = 'compact' }: Props) {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(
    () => window.__vfInstallPrompt
  );
  const [installed, setInstalled] = useState(() => isStandalone());
  const [busy, setBusy] = useState(false);

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

  if (isStandalone() || installed) {
    return <p className="install-hint">App instalada. Ábrela desde su icono.</p>;
  }

  async function onInstall() {
    if (!promptEvent) return;
    setBusy(true);
    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      window.__vfInstallPrompt = null;
      setPromptEvent(null);
    } finally {
      setBusy(false);
    }
  }

  const className = variant === 'hero' ? 'primary-btn install-hero-btn' : 'install-btn';

  if (promptEvent) {
    return (
      <button type="button" className={className} onClick={() => void onInstall()} disabled={busy}>
        {busy ? 'Instalando…' : 'Instalar en esta tablet'}
      </button>
    );
  }

  if (variant === 'hero' && isAndroidChrome()) {
    return (
      <p className="hint-text">
        Chrome está comprobando la app. Si no aparece el botón, abre el menú (⋮) y pulsa{' '}
        <strong>Instalar app</strong>.
      </p>
    );
  }

  if (variant === 'compact') return null;

  return null;
}
