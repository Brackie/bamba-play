import { useEffect, useState } from "react";
import { Form, Link, useNavigate, useNavigation, data } from "react-router";
import type { Route } from "./+types/register";
import { register } from "~/services/auth.service";
import { AUTH_TOKEN_KEY } from "~/lib/constants";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Register - ProPlay" }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  try {
    const { token, user } = await register(username, email, password);
    return data(
      { success: true, username: user.username },
      {
        headers: {
          "Set-Cookie": `${AUTH_TOKEN_KEY}=${token}; Path=/; HttpOnly; SameSite=Lax`,
        },
      }
    );
  } catch (e: any) {
    console.error("register failed:", e.message, e.response?.data?.message, e.response?.status);
    return { error: "Registration failed. Please try again." };
  }
}

export default function Register({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  const isSuccess = actionData && "success" in actionData;

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => navigate("/"), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="text-brand-500">Pro</span>Play
          </Link>
          <p className="mt-2 text-sm text-gray-400">Create your account</p>
        </div>

        {isSuccess ? (
          <div className="rounded-lg bg-green-500/10 p-4 text-center">
            <p className="text-sm font-medium text-green-400">
              Welcome to ProPlay, {actionData.username}!
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Redirecting you to the homepage...
            </p>
          </div>
        ) : (
          <>
            <Form method="post" className="space-y-4">
              {actionData?.error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                  {actionData.error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="mt-1 block w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Choose a username"
                />
              </div>

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
                    minLength={8}
                    autoComplete="new-password"
                    className="block w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="Min. 8 characters"
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
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </Form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-500 hover:text-brand-600">
                Sign in
              </Link>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
