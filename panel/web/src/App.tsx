import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
        <div>
          <h1>Valeria Ferrer · Gestión de fichas</h1>
          <div className="sub">{user.displayName}</div>
        </div>
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

        <Suspense fallback={null}>
          <ActivityFeed />
        </Suspense>
      </main>
    </div>
  );
}
