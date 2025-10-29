"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PersonStanding, Bus, Bike } from "lucide-react";

const scores = [
  {
    label: "Walk Score",
    value: "57 / 100",
    desc: "Somewhat Walkable",
    icon: <PersonStanding className="w-6 h-6 text-red-500" />,
  },
  {
    label: "Transit Score",
    value: "27 / 100",
    desc: "Some Transit",
    icon: <Bus className="w-6 h-6 text-red-500" />,
  },
  {
    label: "Bike Score",
    value: "45 / 100",
    desc: "Somewhat Bikeable",
    icon: <Bike className="w-6 h-6 text-red-500" />,
  },
];

function ScoreRow({
  icon,
  label,
  value,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-50">
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">
          {value} ({desc})
        </p>
      </div>
    </div>
  );
}

export default function WalkScore() {
  return (
    <Card className="border-none shadow-none bg-transparent">
        <h3 className="text-lg font-semibold mb-4">Walkscore</h3>

      <CardContent>
        <p className="text-gray-800 text-lg mb-6">
          10425 Tabor St Los Angeles CA 90034 USA
        </p>

        <div className="space-y-2">
          {scores.map((item, i) => (
            <ScoreRow
              key={i}
              icon={item.icon}
              label={item.label}
              value={item.value}
              desc={item.desc}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
