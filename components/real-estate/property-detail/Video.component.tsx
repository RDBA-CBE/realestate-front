"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, X, Video as VideoIcon } from "lucide-react";

export default function Video(props: any) {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (thumbnailVideoRef.current) {
      const video = thumbnailVideoRef.current;
      const handleLoaded = () => setThumbnailLoaded(true);
      
      video.addEventListener('loadeddata', handleLoaded);
      return () => video.removeEventListener('loadeddata', handleLoaded);
    }
  }, []);

  return (
    <>
      <Card className="border-none shadow-none bg-transparent">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <VideoIcon className="w-5 h-5" />
          Property Video
        </h3>
        <CardContent className="space-y-4">
          <div
            onClick={() => setOpen(true)}
            className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
          >
            <video
              ref={thumbnailVideoRef}
              crossOrigin="anonymous"
              className="hidden"
              preload="metadata"
            >
              <source src={data?.video} type="video/mp4" />
            </video>

            {data?.video ? (
              <div className="w-full h-full relative">
                {!thumbnailLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                    <div className="text-center">
                      <VideoIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <span className="text-gray-600 block">Loading video...</span>
                    </div>
                  </div>
                )}
                
                <div 
                  className={`w-full h-full transition-opacity duration-300 ${
                    thumbnailLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <video
                    muted
                    className="w-full h-full object-cover rounded-lg"
                    onLoadedData={() => setThumbnailLoaded(true)}
                  >
                    <source src={data.video} type="video/mp4" />
                    <source src={data.video} type="video/mp4#t=1" />
                  </video>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-lg">
                <VideoIcon className="w-16 h-16 text-gray-400 mb-2" />
                <span className="text-gray-600">No video available</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/30 backdrop-blur-sm rounded-full p-4">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              Click to play
            </div>
          </div>

         
        </CardContent>
      </Card>

      {open && data?.video && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <div 
            className="relative w-full max-w-6xl bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black rounded-full p-2 text-white hover:text-red-400 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-video w-full">
              <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                <source src={data.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <h3 className="text-white text-xl font-semibold mb-2">
                {data.title || "Property Video"}
              </h3>
              <p className="text-gray-300 text-sm">
                Uploaded on {new Date(data.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}