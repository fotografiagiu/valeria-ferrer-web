import { InstallButton } from './InstallButton';

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

function isIos(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMac(): boolean {
  return /Macintosh|Mac OS X/i.test(navigator.userAgent);
}

export function InstallScreen() {
  const android = isAndroid();
  const ios = isIos();
  const desktop = !android && !ios;
  const mac = isMac();

  return (
    <div className="login-page">
      <div className="login-card install-card">
        <div className="brand-mark">
          <img className="install-icon" src="/icons/icon-192-v3.png" alt="" width={72} height={72} />
          <div className="vf">Valeria Ferrer</div>
          <div className="label">Panel de control</div>
        </div>

        <h1 className="install-title">{desktop ? 'Instalar en el ordenador' : 'Instalar el panel'}</h1>
        <p className="hint-text">
          Instala <strong>VF Panel</strong> como aplicación. Tendrás un icono propio
          para abrir Publicidad, Catálogo y Fotografías sin entrar en Vercel.
          La gestión seguirá solicitando las credenciales de la aplicación.
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

        {desktop ? (
          <ol className="install-steps">
            <li>Abre esta página en <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>.</li>
            <li>Pulsa <strong>Instalar en este ordenador</strong> cuando aparezca el botón de arriba.</li>
            <li>
              Si no aparece, utiliza el icono de instalación de la barra de direcciones
              o la opción <strong>Instalar aplicación</strong> del menú del navegador.
            </li>
            {mac ? <li>En Safari también puedes utilizar <strong>Archivo → Añadir al Dock</strong>.</li> : null}
            <li>Abre <strong>VF Panel</strong> desde el escritorio, Dock o menú de aplicaciones.</li>
          </ol>
        ) : null}

        <a className="install-login-link" href="/">
          Ir al acceso
        </a>
      </div>
    </div>
  );
}
