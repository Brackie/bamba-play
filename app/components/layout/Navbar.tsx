import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";
import { UserAvatar } from "~/components/user/UserAvatar";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/games", label: "Games" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <img
            src="/images/logo.png"
            alt="Bamba Play Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand-500"
                    : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Auth section (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <UserAvatar username={user.username} avatar={user.avatar} size="sm" />
                <span>{user.username}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-gray-400 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-surface-border bg-surface md:hidden">
          <Container className="flex flex-col gap-3 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive ? "text-brand-500" : "text-gray-400"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="border-t border-surface-border pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/profile/${user.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <UserAvatar username={user.username} avatar={user.avatar} size="sm" />
                    <span>{user.username}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button size="sm">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
