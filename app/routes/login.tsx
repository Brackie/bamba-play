import { useState } from "react";
import {
  Form,
  Link,
  redirect,
  useNavigation,
  useSearchParams,
} from "react-router";
import type { Route } from "./+types/login";
import { login } from "~/services/auth.service";
import { AUTH_TOKEN_KEY } from "~/lib/constants";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login - ProPlay" }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") ?? "/";
  const safePath = redirectTo.startsWith("/") ? redirectTo : "/";

  try {
    const { token } = await login(email, password);
    throw redirect(safePath, {
      headers: {
        "Set-Cookie": `${AUTH_TOKEN_KEY}=${token}; Path=/; HttpOnly; SameSite=Lax`,
      },
    });
  } catch (e: any) {
    if (e instanceof Response) throw e;
    console.error("login failed:", e.message, e.response?.data?.message, e.response?.status);
    return { error: "Invalid email or password." };
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-brand-500">Pro</span>Play
          </Link>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        <Form method="post" className="space-y-4">
          {redirectTo && (
            <input type="hidden" name="redirectTo" value={redirectTo} />
          )}
          {actionData?.error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {actionData.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="block w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-brand-500 hover:text-brand-600">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
