"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function Amenities(props) {
  const { data } = props;
  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold mb-6">Features & Amenities</h3>

      <CardContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3">
          {data?.map((item, i) => (
            <li key={i} className="text-gray-800 list-disc list-inside">
              {item?.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
