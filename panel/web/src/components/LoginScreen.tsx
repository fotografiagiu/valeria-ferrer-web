import { FormEvent, useState } from 'react';
import { ApiError, login, type StaffUser } from '../lib/api';
import { InstallButton } from './InstallButton';

type Props = {
  onLoggedIn: (user: StaffUser) => void;
};

export function LoginScreen({ onLoggedIn }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user = await login(username.trim(), password);
      onLoggedIn(user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? 'Usuario o contraseña incorrectos' : err.message);
      } else {
        setError('No se pudo conectar con el servidor');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <div className="brand-mark">
          <div className="vf">Valeria Ferrer</div>
          <div className="label">Gestión de fichas</div>
        </div>

        <p className="hint-text">Acceso exclusivo para encargadas. Solo orden y portadas.</p>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="field">
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="primary-btn" type="submit" disabled={busy || !username || !password}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>

        <InstallButton />
      </form>
    </div>
  );
}
