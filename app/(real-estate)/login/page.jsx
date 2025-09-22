"use client";

import LoginForm from "@/components/ui/login-form";
import { useState } from "react";

export default function Login() {
  return (
    <div className="flex  md:min-h-[40vh] min-h-[60vh] w-full items-center justify-center md:p-6">
      <LoginForm />
   
    </div>
  );
}
