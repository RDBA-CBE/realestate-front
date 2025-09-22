"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CheckboxDemo } from "../common-components/checkbox";

type FilterType = "radio" | "checkbox" | "range";

type FilterDropdownProps = {
  title: string;
  subtitle: string;
  type: FilterType;
  options?: string[];
  onChange?: (value: any) => void;
};

export default function FilterDropdown({
  title,
  subtitle,
  type,
  options = [],
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState<any>(
    type === "checkbox" ? [] : type === "radio" ? "" : [0, 100]
  );

  const handleCheckboxChange = (
    values: { value: string; label?: string }[]
  ) => {
    const updated = values.map((v) => v.value);
    setSelected(updated);
    onChange?.(updated);
  };

  const handleRadioChange = (values: { value: string; label?: string }[]) => {
    const updated = values.length ? values[0].value : "";
    setSelected(updated);
    onChange?.(updated);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full bg-white text-gray-800 px-5 py-2 shadow-sm hover:bg-gray-50 flex items-center gap-2"
        >
          {title}
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-xl p-3"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="font-semibold">
          {subtitle}
        </DropdownMenuLabel>

        {/* ✅ Radio & Checkbox Options */}
        {type === "radio" || type === "checkbox" ? (
          <DropdownMenuGroup className="space-y-2 mt-2 gap-4">
            {options.map((opt, i) => (
              <CheckboxDemo
                className={""}
                key={i}
                label={opt}
                value={opt}
                selectedValues={
                  type === "radio"
                    ? selected
                      ? [{ value: selected, label: selected }]
                      : []
                    : selected.map((val: string) => ({
                        value: val,
                        label: val,
                      }))
                }
                onChange={
                  type === "radio" ? handleRadioChange : handleCheckboxChange
                }
                isMulti={type === "checkbox"}
              />
            ))}
          </DropdownMenuGroup>
        ) : (
          // ✅ Range Type
          <div className="mt-3 px-2">
            <input
              type="range"
              min={0}
              max={100}
              value={selected[1]}
              onChange={(e) => {
                const updated = [selected[0], Number(e.target.value)];
                setSelected(updated);
                onChange?.(updated);
              }}
              className="w-full mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Price Range: ${selected[0]} - ${selected[1]}
            </p>
          </div>
        )}

        <DropdownMenuSeparator className="my-3" />

        <div className="flex justify-end">
          <Button
            className="rounded-lg bg-red-500 hover:bg-red-600"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
