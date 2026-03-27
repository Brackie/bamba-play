import { Link } from "react-router";
import { Container } from "~/components/ui/Container";

const links = [
  { label: "Home", to: "/" },
  { label: "Games", to: "/games" },
  { label: "Leaderboard", to: "/leaderboard" },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-elevated py-10">
      <Container>
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="Bamba Play" className="h-8 w-auto" />
            <span className="text-sm font-semibold text-gray-300">Bamba Play</span>
          </div>

          {/* Nav links */}
          <nav className="flex gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-gray-500 transition-colors hover:text-brand-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Bamba Play. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
