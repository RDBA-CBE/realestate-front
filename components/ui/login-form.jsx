
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
// import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="flex" style={{paddingTop:'30px'}}>
      {/* LEFT SIDE - Background with image & overlay */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden md:flex relative flex-1 items-center justify-center"
      >
        <Image
          src="/assets/images/real-estate/01.png" // replace with a nice real estate / city image
          alt="Real Estate Background"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
        <div className="relative z-10 text-white text-center px-8">
          <h1 className="text-4xl font-bold">Find Your Dream Home</h1>
          <p className="mt-3 text-gray-200 max-w-md mx-auto">
            Join our real estate platform to explore the latest listings and
            manage your properties effortlessly.
          </p>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-1 items-center justify-center px-6"
      >
        <Card className="w-full max-w-md shadow-xl rounded-3xl backdrop-blur bg-white/90">
          <CardContent className="p-8 space-y-6">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                R
              </div>
              <span className="text-lg font-semibold">Repute</span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to manage your properties and explore new listings.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="rounded-xl"
              />
            </div>

            {/* Submit */}
            <Button
              className="w-full bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold"
              onClick={() => router.push("/property-list")}
            >
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative flex items-center my-2">
              <div className="flex-grow border-t border-gray-200" />
              <span className="px-3 text-xs text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            {/* Social login */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 rounded-xl"
            >
              {/* <FcGoogle className="text-xl" />  */}
              Continue with Google
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-red-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

