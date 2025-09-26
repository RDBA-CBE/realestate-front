"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, X } from "lucide-react";

export default function Video() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Video</h3>
        <CardContent className="space-y-4">
          {/* Thumbnail with play icon */}
          <div
            onClick={() => setOpen(true)}
            className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden cursor-pointer group"
          >
            <img
              src="https://homez-appdir.vercel.app/_next/static/media/listing-single-6.f1cd49a0.jpg"
              alt="Video Thumbnail"
              className="w-full h-full object-cover rounded-lg transition group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 text-white hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video */}
            <video
              controls
              autoPlay
              className="w-full h-[70vh] object-contain bg-black"
            >
              <source src="/assets/videos/sample.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
}
