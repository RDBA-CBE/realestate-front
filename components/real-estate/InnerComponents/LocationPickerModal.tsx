"use client";
import React from "react";
import { MapPin, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LocationPickerModal = ({ cities, onConfirm, onSkip }) => {
  const [selected, setSelected] = React.useState<{ value: string; label: string } | null>(null);

  // keep values as strings so Radix Select comparison works
  const options = cities.map((c) => ({ value: String(c.id), label: c.name }));

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#9b0f09]/10 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[#9b0f09]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Choose Your Location</h2>
          <p className="text-sm text-gray-500">
            Select your city to see properties near you
          </p>
        </div>

        <Select
          value={selected?.value ?? ""}
          onValueChange={(val) => {
            const opt = options.find((o) => o.value === val);
            if (opt) setSelected(opt);
          }}
        >
          <SelectTrigger className="w-full mb-6">
            <SelectValue placeholder="Select a city..." />
          </SelectTrigger>
          <SelectContent className="z-[1100]">
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            disabled={!selected}
            onClick={() => selected && onConfirm({ value: Number(selected.value), label: selected.label })}
            className="flex-1 py-2.5 rounded-xl bg-[#9b0f09] text-white text-sm hover:bg-[#7d0c07] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
