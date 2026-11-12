import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { InstallScreen } from './components/InstallScreen';
import { LoginScreen } from './components/LoginScreen';
import { Toast } from './components/Toast';
import {
  ApiError,
  ensureCatalog,
  getCatalog,
  getMe,
  logout,
  type StaffCatalogModel,
  type StaffUser,
} from './lib/api';

const CatalogScreen = lazy(() =>
  import('./components/CatalogScreen').then((m) => ({ default: m.CatalogScreen }))
);
const ActivityFeed = lazy(() =>
  import('./components/ActivityFeed').then((m) => ({ default: m.ActivityFeed }))
);
const PromotionScreen = lazy(() =>
  import('./components/PromotionScreen').then((m) => ({ default: m.PromotionScreen }))
);

type ToastState = { message: string; tone: 'success' | 'error' } | null;

export function App() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [bootError, setBootError] = useState<string | null>(null);
  const [bootRetry, setBootRetry] = useState(0);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [models, setModels] = useState<StaffCatalogModel[]>([]);
  const [orderVersion, setOrderVersion] = useState(1);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [ensuring, setEnsuring] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [catalogKey, setCatalogKey] = useState(0);
  const ensureInFlight = useRef(false);

  const showToast = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  const applyCatalog = useCallback(
    (catalog: { models: StaffCatalogModel[]; orderVersion: number }) => {
      setModels(catalog.models);
      setOrderVersion(catalog.orderVersion);
      setCatalogKey((k) => k + 1);
    },
    []
  );

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setCatalogError(null);
    try {
      let catalog = await getCatalog();

      const needsEnsure =
        catalog.needsEnsure === true || (catalog.missingOverrides?.length ?? 0) > 0;

      if (needsEnsure && !ensureInFlight.current) {
        ensureInFlight.current = true;
        setEnsuring(true);
        try {
          const ensured = await ensureCatalog();
          catalog = ensured.catalog;
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            setUser(null);
            setCatalogError(null);
            return;
          }
          const message =
            err instanceof ApiError ? err.message : 'No se pudo sincronizar el catálogo';
          setCatalogError(message);
          showToast(message, 'error');
          return;
        } finally {
          ensureInFlight.current = false;
          setEnsuring(false);
        }
      }

      applyCatalog(catalog);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        setCatalogError(null);
      } else if (err instanceof ApiError) {
        setCatalogError(err.message);
      } else {
        setCatalogError('No se pudo cargar el catálogo');
      }
    } finally {
      setLoadingCatalog(false);
      setEnsuring(false);
    }
  }, [applyCatalog, showToast]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.replace(/\/$/, '') === '/instalar') {
      setBootstrapping(false);
      return;
    }
    let cancelled = false;
    setBootstrapping(true);
    setBootError(null);
    (async () => {
      try {
        const me = await getMe();
        if (cancelled) return;
        setUser(me);
        setBootError(null);
        // Show shell immediately after session check — do not wait for catalog.
        setBootstrapping(false);
        await loadCatalog();
      } catch (err) {
        if (cancelled) return;
        setUser(null);
        // 401 / unauthorized → show login (not an error screen)
        if (err instanceof ApiError && err.status === 401) {
          setBootError(null);
        } else if (err instanceof ApiError) {
          const detail =
            err.status > 0
              ? `No se pudo verificar la sesión (HTTP ${err.status}).`
              : err.message;
          setBootError(detail);
        } else {
          setBootError('No se pudo verificar la sesión.');
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadCatalog, bootRetry]);

  async function onLogout() {
    try {
      await logout();
    } catch {
      // still clear local session UI
    }
    setUser(null);
    setModels([]);
  }

  const onInstallPage =
    typeof window !== 'undefined' &&
    window.location.pathname.replace(/\/$/, '') === '/instalar';

  if (onInstallPage) {
    return <InstallScreen />;
  }

  if (bootstrapping) {
    return <div className="loading-center">Cargando…</div>;
  }

  if (bootError) {
    return (
      <div className="loading-center boot-error">
        <p>{bootError}</p>
        <button type="button" className="ghost-btn" onClick={() => setBootRetry((n) => n + 1)}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toast message={toast?.message ?? null} tone={toast?.tone} />
        <LoginScreen
          onLoggedIn={async (nextUser) => {
            setUser(nextUser);
            setBootError(null);
            await loadCatalog();
          }}
        />
      </>
    );
  }

  return (
    <div className="app-shell">
      <Toast message={toast?.message ?? null} tone={toast?.tone} />
      <header className="app-header">
        <div className="app-header__identity">
          <span className="app-header__eyebrow">Panel privado · Gestión web</span>
          <h1>Valeria Ferrer</h1>
          <div className="sub">Panel de control <span aria-hidden="true">·</span> {user.displayName}</div>
        </div>
        <nav className="panel-nav" aria-label="Secciones del panel">
          <a href="#publicidad">Publicidad</a>
          <a href="#catalogo">Orden y fichas</a>
          <a href="#actividad">Actividad</a>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={loadCatalog}
            disabled={loadingCatalog || ensuring}
          >
            Recargar
          </button>
          <button type="button" className="ghost-btn" onClick={onLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className="main">
        <div className="panel-intro">
          <div>
            <span className="panel-intro__eyebrow">CENTRO DE GESTIÓN</span>
            <h2>Tu web, bajo control.</h2>
            <p>Publicidades, posición de las chicas y portadas desde un único lugar.</p>
          </div>
          <div className="panel-intro__count"><strong>{models.length}</strong><span>Fichas en el catálogo</span></div>
        </div>
        <Suspense fallback={<div className="loading-center">Cargando publicidad…</div>}>
          <PromotionScreen
            onToast={showToast}
            onUnauthorized={() => {
              setUser(null);
              setModels([]);
            }}
          />
        </Suspense>

        <section className="catalog-workspace" id="catalogo" aria-labelledby="catalog-workspace-title">
          <div className="catalog-workspace__heading">
            <div>
              <span className="section-eyebrow">CATÁLOGO / POSICIONAMIENTO</span>
              <h2 id="catalog-workspace-title">Orden y fotografías</h2>
              <p>Arrastra cada ficha por el icono de líneas. Pulsa sobre una foto para cambiar portada y galería.</p>
            </div>
            <span className="catalog-workspace__counter">{models.length} perfiles</span>
          </div>
        {(loadingCatalog || ensuring) && models.length === 0 ? (
          <div className="loading-center">
            {ensuring ? 'Incorporando fichas nuevas…' : 'Cargando fichas…'}
          </div>
        ) : null}

        {ensuring && models.length > 0 ? (
          <div className="conflict-banner">Incorporando fichas del catálogo…</div>
        ) : null}

        {catalogError ? (
          <div className="conflict-banner">
            {catalogError}
            <br />
            <button type="button" onClick={loadCatalog} disabled={ensuring}>
              Reintentar
            </button>
          </div>
        ) : null}

        {!catalogError && models.length > 0 ? (
          <Suspense fallback={<div className="loading-center">Cargando fichas…</div>}>
            <CatalogScreen
              key={catalogKey}
              initialModels={models}
              orderVersion={orderVersion}
              orderSaveLocked={ensuring}
              onOrderVersion={setOrderVersion}
              onModelsChange={setModels}
              onToast={showToast}
              onReload={loadCatalog}
              onUnauthorized={() => {
                setUser(null);
                setModels([]);
              }}
            />
          </Suspense>
        ) : null}

        {!loadingCatalog && !ensuring && !catalogError && models.length === 0 ? (
          <div className="loading-center">No hay fichas activas</div>
        ) : null}

        </section>
        <section id="actividad" className="activity-workspace" aria-label="Actividad reciente">
          <Suspense fallback={null}>
            <ActivityFeed />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
