"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Chrome, Facebook, Apple } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router=useRouter()
  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE - Card with form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-1  justify-center"
      >
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                R
              </div>
              <span className="text-lg font-semibold">Repute</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Login</h2>
              <p className="text-sm text-gray-500">
                Sign in with this account across the following sites.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter Email" />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter Password" />
            </div>

            {/* Submit */}
            <Button className="w-full bg-red-500 hover:bg-red-600" onClick={() => router.push('/home')}>
              Create account
            </Button>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t" />
              <span className="px-3 text-xs text-gray-400">OR</span>
              <div className="flex-grow border-t" />
            </div>

            {/* Social logins */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Chrome size={18} /> Continue Google
              </Button>
             
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500">
              Already Have an Account?{" "}
              <Link href="/signin" className="font-semibold text-gray-900">
                SignIn
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* RIGHT SIDE - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-1  justify-center"
      >
        <Image
          src="/assets/images/logo.png" // replace with your asset
          alt="Real Estate Illustration"
          width={600}
          height={500}
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}
