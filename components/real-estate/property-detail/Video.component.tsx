"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function Video() {
  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Video</h3>
      <CardContent className="space-y-4">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <video
            controls
            poster="https://homez-appdir.vercel.app/_next/static/media/listing-single-6.f1cd49a0.jpg"
            className="w-full h-full object-cover rounded-lg"
          >
            <source src="/assets/videos/sample.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
    </Card>
  );
}
