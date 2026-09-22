import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
}

const NAV_LINKS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
];
const DONATE: NavItem = { label: 'Donate', to: '/donate' };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [open]);

  function closeMenu() {
    setVisible(false);
    window.setTimeout(() => setOpen(false), 450);
  }

  return (
    <>
      <header className="site-header">
        <nav className="site-nav">
          <NavLink to="/" end className="logo">
            <span className="logo-badge">
              <img src="/logo.png" alt="Road Safety Academy (RSA)" />
            </span>
          </NavLink>

          <div className="nav-right">
            <ul className="nav-links">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <NavLink to={DONATE.to} className="nav-donate">
              {DONATE.label}
            </NavLink>

            <button
              className={`burger${open ? ' open' : ''}`}
              onClick={() => (open ? closeMenu() : setOpen(true))}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className={`mobile-menu open${visible ? ' visible' : ''}`}>
          <ul>
            {[...NAV_LINKS, DONATE].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
