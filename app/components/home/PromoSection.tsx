import { Link } from "react-router";
import { Trophy, Gamepad2, BarChart3 } from "lucide-react";
import { Container } from "~/components/ui/Container";

const promos = [
  {
    icon: Trophy,
    label: "Weekly Champion",
    heading: "One Game. One Week. One Winner.",
    body: "Every week a flagship game is selected for the community challenge. Rise to the top of the leaderboard and claim your glory.",
    cta: "See Leaderboard",
    href: "/leaderboard",
    accent: "text-gold",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Gamepad2,
    label: "All Games Access",
    heading: "Unlock the Full Library",
    body: "Premium subscribers get unlimited access to every game on the platform, plus early access to new releases.",
    cta: "Browse Games",
    href: "/games",
    accent: "text-accent-500",
    bg: "bg-accent-500/10",
    border: "border-accent-500/20",
  },
  {
    icon: BarChart3,
    label: "Global Rankings",
    heading: "Compete on a Global Stage",
    body: "Track your scores, compare with players worldwide, and watch yourself climb the global leaderboard in real-time.",
    cta: "View Rankings",
    href: "/leaderboard",
    accent: "text-brand-300",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
  },
];

export function PromoSection() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Everything You Need to Win
          </h2>
          <p className="mt-3 text-gray-400">
            Compete, unlock, and dominate — all in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {promos.map(({ icon: Icon, label, heading, body, cta, href, accent, bg, border }) => (
            <div
              key={label}
              className={`rounded-2xl border ${border} ${bg} p-6 transition-transform hover:-translate-y-1`}
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${bg}`}>
                <Icon className={`h-6 w-6 ${accent}`} />
              </div>
              <p className={`mb-1 text-xs font-semibold uppercase tracking-widest ${accent}`}>
                {label}
              </p>
              <h3 className="mb-2 text-lg font-bold text-white">{heading}</h3>
              <p className="mb-5 text-sm text-gray-400 leading-relaxed">{body}</p>
              <Link
                to={href}
                className={`text-sm font-semibold ${accent} hover:underline`}
              >
                {cta} →
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
