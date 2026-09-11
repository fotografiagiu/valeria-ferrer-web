import { useCallback, useEffect, useState } from 'react';
import { ActivityFeed } from './components/ActivityFeed';
import { CatalogScreen } from './components/CatalogScreen';
import { LoginScreen } from './components/LoginScreen';
import { Toast } from './components/Toast';
import {
  ApiError,
  getCatalog,
  getMe,
  logout,
  type StaffCatalogModel,
  type StaffUser,
} from './lib/api';

type ToastState = { message: string; tone: 'success' | 'error' } | null;

export function App() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [bootError, setBootError] = useState<string | null>(null);
  const [bootRetry, setBootRetry] = useState(0);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [models, setModels] = useState<StaffCatalogModel[]>([]);
  const [orderVersion, setOrderVersion] = useState(1);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [catalogKey, setCatalogKey] = useState(0);

  const showToast = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setCatalogError(null);
    try {
      const catalog = await getCatalog();
      setModels(catalog.models);
      setOrderVersion(catalog.orderVersion);
      setCatalogKey((k) => k + 1);
      if (catalog.missingOverrides.length > 0) {
        showToast(`Faltan overrides: ${catalog.missingOverrides.join(', ')}`, 'error');
      }
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
    }
  }, [showToast]);

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
          <button type="button" className="ghost-btn" onClick={loadCatalog} disabled={loadingCatalog}>
            Recargar
          </button>
          <button type="button" className="ghost-btn" onClick={onLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className="main">
        {loadingCatalog && models.length === 0 ? (
          <div className="loading-center">Cargando fichas…</div>
        ) : null}

        {catalogError ? (
          <div className="conflict-banner">
            {catalogError}
            <br />
            <button type="button" onClick={loadCatalog}>
              Reintentar
            </button>
          </div>
        ) : null}

        {!catalogError && models.length > 0 ? (
          <CatalogScreen
            key={catalogKey}
            initialModels={models}
            orderVersion={orderVersion}
            onOrderVersion={setOrderVersion}
            onModelsChange={setModels}
            onToast={showToast}
            onReload={loadCatalog}
          />
        ) : null}

        {!loadingCatalog && !catalogError && models.length === 0 ? (
          <div className="loading-center">No hay fichas activas</div>
        ) : null}

        <ActivityFeed />
      </main>
    </div>
  );
}
