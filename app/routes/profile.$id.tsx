import { redirect } from "react-router";
import type { Route } from "./+types/profile.$id";
import { getUser } from "~/services/user.service";
import { UserAvatar } from "~/components/user/UserAvatar";
import { UserStatsCard } from "~/components/user/UserStatsCard";
import { Container } from "~/components/ui/Container";
import { AUTH_TOKEN_KEY } from "~/lib/constants";

export function meta({ data }: Route.MetaArgs) {
  const title = data?.user
    ? `${data.user.username} - ProPlay`
    : "Profile - ProPlay";
  return [{ title }];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  if (!cookieHeader.includes(`${AUTH_TOKEN_KEY}=`)) {
    const url = new URL(request.url);
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }
  try {
    const user = await getUser(params.id, cookieHeader);
    return { user };
  } catch (e: any) {
    console.error("getUser failed:", e.message, e.response?.status);
    throw new Response("User not found", { status: 404 });
  }
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <Container className="py-8">
      {/* Profile header */}
      <div className="flex items-center gap-6">
        <UserAvatar
          username={user.username}
          avatar={user.avatar}
          size="lg"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">{user.username}</h1>
          <p className="mt-1 text-sm text-gray-400">
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-white">Stats</h2>
        <UserStatsCard stats={user.stats} />
      </div>

      {/* Favorite game */}
      {user.stats.favoriteGame && (
        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Favorite game:{" "}
            <span className="font-medium text-white">
              {typeof user.stats.favoriteGame === "object"
                ? user.stats.favoriteGame.title
                : user.stats.favoriteGame}
            </span>
          </p>
        </div>
      )}
    </Container>
  );
}
