import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { OFFICIAL_PHONE_TEL } from '../lib/officialContact';

type NoirNavbarProps = { isScrolled: boolean; openMembers: () => void };

const primary = [
  { label: 'Inicio', href: '/' },
  { label: 'Chicas', href: '/models' },
  { label: 'Novedades', href: '/novedades' },
  { label: 'Tarifas', href: '/fees' },
  { label: 'Agencia', href: '/about' },
  { label: 'Contacto', href: '/contact' },
];

const additional = [
  { label: 'Escorts de lujo en Valencia', href: '/escorts-de-lujo-valencia' },
  { label: 'Modelos VIP', href: '/vip' },
  { label: 'Modelos colombianas', href: '/colombianas' },
  { label: 'Blog', href: '/blog' },
  { label: 'Casting', href: '/casting' },
];

const NavbarNoir: React.FC<NoirNavbarProps> = ({ isScrolled, openMembers }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const close = () => { setMenuOpen(false); setMoreOpen(false); };

  return (
    <header className={'vf-noir-nav' + (isScrolled ? ' vf-noir-nav--scrolled' : '')}>
      <div className="vf-noir-nav__inner">
        <Link to="/" className="vf-noir-nav__brand" aria-label="Valeria Ferrer, inicio" onClick={close}>
          <span className="vf-noir-nav__brand-title">Valeria Ferrer</span>
          <span className="vf-noir-nav__brand-subtitle">ESCORTS EN VALENCIA</span>
        </Link>

        <nav className="vf-noir-nav__desktop" aria-label="Navegación principal">
          {primary.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) => 'vf-noir-nav__link' + (isActive ? ' is-active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="vf-noir-nav__more">
            <button type="button" aria-expanded={moreOpen} aria-controls="vf-noir-nav-extras" onClick={() => setMoreOpen((value) => !value)}>
              Más <ChevronDown size={13} aria-hidden="true" />
            </button>
            <div id="vf-noir-nav-extras" className="vf-noir-nav__dropdown" data-open={moreOpen}>
                {additional.map((item) => <Link key={item.href} to={item.href} onClick={close}>{item.label}</Link>)}
                <button type="button" onClick={() => { close(); openMembers(); }}>Lounge de miembros</button>
              </div>
          </div>
        </nav>

        <div className="vf-noir-nav__actions">
          <a href={OFFICIAL_PHONE_TEL} className="vf-noir-nav__phone" aria-label="Llamar a Valeria Ferrer">
            <Phone size={19} strokeWidth={1.5} aria-hidden="true" />
          </a>
          <Link to="/booking" className="vf-noir-nav__book" onClick={close}>
            Reservar <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="vf-noir-nav__mobile-toggle"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="vf-noir-mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="vf-noir-mobile-menu" className="vf-noir-nav__mobile" aria-label="Navegación móvil">
          <p className="vf-noir-nav__mobile-kicker">Valeria Ferrer · Valencia</p>
          {[...primary, ...additional].map((item) => (
            <Link key={item.href} to={item.href} onClick={close} className="vf-noir-nav__mobile-link">
              {item.label} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ))}
          <button type="button" onClick={() => { close(); openMembers(); }} className="vf-noir-nav__mobile-link">Lounge de miembros <ArrowUpRight size={16} aria-hidden="true" /></button>
          <div className="vf-noir-nav__mobile-actions">
            <a href={OFFICIAL_PHONE_TEL} onClick={close}><Phone size={16} /> Llamar</a>
            <Link to="/booking" onClick={close}>Reservar ahora <ArrowUpRight size={17} /></Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default NavbarNoir;
