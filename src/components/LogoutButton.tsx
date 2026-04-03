"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" className="!px-2 !py-1 text-xs" onClick={logout}>
      Sign out
    </Button>
  );
}
