"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AgentCard() {
  return (
    <Card className="rounded-2xl shadow-lg p-4">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Image
            src="/agent.jpg"
            alt="Agent"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-gray-500">Real Estate Agent</p>
          </div>
        </div>
        <Button className="w-full">Contact Agent</Button>
      </CardContent>
    </Card>
  );
}
