"use client";

import { useState } from "react";
import SignInForm from "@/components/ui/signin-form";


export default function Signin() {
  return (
    <div className="flex md:min-h-[70vh] min-h-[60vh] w-full items-center justify-center md:p-6">
      <SignInForm />
   
    </div>
  );
}
