"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description?: string;
  renderComponent: () => React.ReactNode;
  onSubmit?: () => void;
  width?: string;
}

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  description,
  renderComponent,
  width,
}: ModalProps) {
  const widthClasses: Record<string, string> = {
    "500px": "sm:max-w-[500px]",
    "700px": "sm:max-w-[700px]",
    "900px": "sm:max-w-[900px]",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        hideClose
        // className={`p-0 ${width ? `sm:max-w-[${width}]` : "sm:max-w-[500px]"}`}
        className={cn("p-0", width ? widthClasses[width] : "sm:max-w-[500px]")}
      >
        {/* Custom header with title + close in one row */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-gray-500 mt-1">
                {description}
              </DialogDescription>
            )}
          </div>

          <DialogClose asChild>
            <button className="rounded-md text-gray-700 hover:opacity-70 focus:outline-none">
              <X className="h-6 w-6" /> {/* bigger close icon */}
            </button>
          </DialogClose>
        </div>

        {/* Body */}
        <div className="px-6 py-6">{renderComponent()}</div>
      </DialogContent>
    </Dialog>
  );
}
