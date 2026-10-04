import { InstallButton } from './InstallButton';

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

function isIos(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function InstallScreen() {
  const android = isAndroid();
  const ios = isIos();

  return (
    <div className="login-page">
      <div className="login-card install-card">
        <div className="brand-mark">
          <img className="install-icon" src="/icons/icon-192.png" alt="" width={72} height={72} />
          <div className="vf">Valeria Ferrer</div>
          <div className="label">Gestión de fichas</div>
        </div>

        <h1 className="install-title">Instalar el panel</h1>
        <p className="hint-text">
          Pasa este enlace a la tablet Android. Al abrirlo en Chrome se puede instalar como app
          (icono en el escritorio). No es la web pública.
        </p>

        <InstallButton variant="hero" />

        {android ? (
          <ol className="install-steps">
            <li>
              Abre este enlace en <strong>Chrome</strong> (si llega por WhatsApp, pulsa el menú ⋮ →
              Abrir en Chrome).
            </li>
            <li>Pulsa <strong>Instalar</strong> cuando aparezca el botón.</li>
            <li>
              Si no aparece: menú de Chrome (⋮) → <strong>Instalar app</strong> / Añadir a pantalla de
              inicio.
            </li>
          </ol>
        ) : null}

        {ios ? (
          <ol className="install-steps">
            <li>Abre este enlace en Safari.</li>
            <li>Pulsa el botón de compartir.</li>
            <li>Elige <strong>Añadir a pantalla de inicio</strong>.</li>
          </ol>
        ) : null}

        {!android && !ios ? (
          <p className="hint-text">
            En la tablet Android, abre este mismo enlace con Chrome para instalar la app.
          </p>
        ) : null}

        <a className="install-login-link" href="/">
          Ir al acceso
        </a>
      </div>
    </div>
  );
}
