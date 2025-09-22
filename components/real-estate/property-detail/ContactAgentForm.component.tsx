"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function ContactAgentForm() {
  return (
    <Card className="rounded-2xl shadow-md border">
      <CardContent className="p-6 space-y-6">
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900">
          Get More Information
        </h2>

        {/* Agent Info */}
        <div className="flex items-center gap-4">
          <Image
            src="/assets/images/real-estate/dummy.png"
            alt="Agent"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">Arlene McCoy</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Phone className="h-4 w-4 mr-1" />
              (920) 012-3421
            </div>
            <a
              href="#"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              View Listings
            </a>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <Input placeholder="Name" />
          <Input placeholder="ibthemes21@gmail.com" type="email" />
          <Input placeholder="Enter your phone" type="tel" />
          <Textarea placeholder="Hello, I am interested in [Renovated apartment at last floor]" />

          {/* Checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-tight"
            >
              By submitting form I agree to Terms of Use
            </label>
          </div>

          {/* Button */}
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-6 text-base rounded-xl">
            Submit a Tour Request ↗
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
