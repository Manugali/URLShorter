"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Github, Mail, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok === true || result?.url) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setError("");
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("OAuth login error:", error);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Choose your preferred sign-in method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth Providers */}
        <div className="space-y-2">
          <Button
            onClick={() => handleOAuthLogin("google")}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
          <Button
            onClick={() => handleOAuthLogin("github")}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Demo Credentials */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800/50">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => window.location.href = "/landing?mode=signup"}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
