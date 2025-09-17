"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <Button
      className=" bg-red-500 hover:bg-red-600"
      onClick={() => router.push("/home-data")}
    >
      Create account
    </Button>
  );
}
