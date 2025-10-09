"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function MapSection(props) {
  const { data } = props;
  // const mapSrc = `https://maps.google.com/maps?q=${13.06},${80.23}&z=13&ie=UTF8&iwloc=&output=embed`;

  const mapSrc = `https://maps.google.com/maps?q=${data?.latitude},${data?.longitude}&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold mb-6">Address</h3>

      <CardContent className="gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold text-gray-800 w-28">Address</span>
            <span className="text-gray-700">{data.address}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-gray-800 w-28">City</span>
            <span className="text-gray-700">{data.city}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-gray-800 w-28">State</span>
            <span className="text-gray-700">{data.state}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-gray-800 w-28">Country</span>
            <span className="text-gray-700">{data.country}</span>
          </div>
        </div>
      </CardContent>

      <iframe
        className="w-full h-64 rounded-2xl"
        src={mapSrc}
      />
    </Card>
  );
}
