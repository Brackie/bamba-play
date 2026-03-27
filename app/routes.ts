import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("games", "routes/games.tsx"),
    route("games/:id", "routes/game.$id.tsx"),
    route("leaderboard", "routes/leaderboard.tsx"),
    route("profile/:id", "routes/profile.$id.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
] satisfies RouteConfig;
