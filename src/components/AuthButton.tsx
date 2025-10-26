"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button disabled className="cursor-not-allowed">
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Welcome, {session.user?.name || session.user?.email}
        </span>
        <Button
          onClick={() => signOut()}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => signIn()}
      variant="default"
      size="sm"
      className="cursor-pointer"
    >
      <LogIn className="w-4 h-4 mr-2" />
      Sign In
    </Button>
  );
}
