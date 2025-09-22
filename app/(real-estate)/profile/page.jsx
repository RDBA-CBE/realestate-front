"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto space-y-8 p-6"
    >
      {/* Profile Info Section */}
      <Card className="rounded-xl shadow-sm border bg-white">
        <CardContent className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden">
              <Image
                src="/assets/images/real-estate/profile.png"
                alt="Profile"
                fill
                className="object-cover"
              />
              <button className="absolute top-2 left-2 bg-white p-2 rounded-full shadow">
                🗑
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl h-14 px-8 text-base"
              >
                Upload Profile Files ↗
              </Button>

              <p className="text-gray-500 text-sm">
                Photos must be JPEG or PNG format and at least 2048x768
              </p>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
          </div>

          <Input placeholder="Your Name" />
          <Textarea
            placeholder="There are many variations of passages."
            rows={4}
          />

          <div className="flex justify-end">
            <Button className="h-14 px-8 rounded-lg">Update Profile ↗</Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card className="rounded-xl shadow-sm border bg-white">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-base font-semibold">Social Media</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
            <Input placeholder="Your Name" />
          </div>
          <div className="flex justify-end">
            <Button className="h-14 px-8 rounded-lg">Update Social ↗</Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="rounded-xl shadow-sm border bg-white">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-base font-semibold">Change password</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="Your Name" type="password" />
            <Input placeholder="Your Name" type="password" />
            <Input placeholder="Your Name" type="password" />
          </div>
          <div className="flex justify-end">
            <Button className="h-14 px-8 rounded-lg">Change Password ↗</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
