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

function isDesktop(): boolean {
  return !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isSafariMac(): boolean {
  const ua = navigator.userAgent;
  return /Macintosh|Mac OS X/i.test(ua) && /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);
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
        {busy ? 'Instalando…' : isDesktop() ? 'Instalar en este ordenador' : 'Instalar en este dispositivo'}
      </button>
    );
  }

  if (variant === 'compact') return null;

  if (isSafariMac()) {
    return (
      <p className="install-fallback" role="status">
        Safari en Mac: abre el menú <strong>Archivo</strong> y elige <strong>Añadir al Dock</strong>.
        La aplicación aparecerá en el Dock y en Launchpad.
      </p>
    );
  }

  if (isDesktop()) {
    return (
      <p className="install-fallback" role="status">
        Para instalar en el ordenador, abre este enlace en <strong>Chrome o Edge</strong>.
        Si el navegador no ofrece el botón, pulsa el icono <strong>Instalar</strong> de la barra
        de direcciones o busca <strong>Instalar aplicación</strong> en el menú del navegador.
      </p>
    );
  }

  if (isAndroidChrome()) {
    return (
      <p className="install-fallback" role="status">
        Chrome está comprobando la app. Si no aparece el botón, abre el menú (⋮) y pulsa
        <strong> Instalar aplicación</strong>.
      </p>
    );
  }

  return null;
}
