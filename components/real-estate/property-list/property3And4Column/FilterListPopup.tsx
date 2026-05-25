"use client";
import { useEffect, useRef, useState, useMemo, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";

export function PopupPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface FilterListPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: { label: string; value: any; count?: number }[];
  selected: { value: any }[];
  onChange: (updated: any[]) => void;
  anchorPos: { left: number; top: number };
  isMobile: boolean;
  showAlphabetNav?: boolean;
  popupWidth?: string;
  popupHeight?: string;
}

export function FilterListPopup({
  open, onClose, title, items, selected, onChange,
  anchorPos, isMobile, showAlphabetNav, popupWidth, popupHeight,
}: FilterListPopupProps) {
  const [query, setQuery] = useState("");
  const [selectedAlphabet, setSelectedAlphabet] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const alphabetRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => { if (!open) { setQuery(""); setSelectedAlphabet(null); } }, [open]);

  // Lock body scroll when popup is open (prevents Radix/Sheet from stealing touch events)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const filtered = useMemo(() =>
    query ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : items
  , [items, query]);

  const availableAlphabets = useMemo(
    () => new Set(filtered.map((i) => i.label[0]?.toUpperCase())),
    [filtered]
  );

  const popupRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const width = popupWidth ?? (showAlphabetNav ? "clamp(300px, 90vw, 900px)" : "clamp(300px, 90vw, 700px)");
  const height = popupHeight ?? (showAlphabetNav ? "clamp(420px, 60vh, 420px)" : "clamp(380px, 55vh, 460px)");

  return (
    <PopupPortal>
      <div
        className="fixed inset-0 bg-black/40 z-[9998] pointer-events-auto"
        style={{ pointerEvents: "auto" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        ref={popupRef}
        data-filter-popup
        onPointerDown={(e) => {
          // Only stop propagation if we are not clicking an input
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT') e.stopPropagation();
        }}
        className="fixed bg-white border border-slate-200 shadow-2xl z-[9999] p-4 flex flex-col rounded-2xl pointer-events-auto"
        style={{ 
          top: "50%", 
          left: isMobile ? "50%" : `${anchorPos.left}px`, 
          transform: isMobile ? "translate(-50%, -50%)" : "translateY(-50%)", 
          width: isMobile ? "92vw" : width, 
          height: isMobile ? "80vh" : height, 
          maxHeight: "80vh", 
          pointerEvents: "auto" 
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3 border-b pb-3">
          <div className={`flex gap-3 flex-1 item-center`}>
            <div className="flex items-center gap-3">
              {/* <span className="font-semibold text-gray-900 text-sm">{title}</span> */}
              <div className="relative flex-1 max-w-[230px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 " size={14} />
                <input
                  type="text"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none"
                />
              </div>
            </div>
            {showAlphabetNav && (
              <div className="flex flex-wrap gap-2 pb-2">
                {ALPHABETS.map((char) => {
                  const isAvailable = availableAlphabets.has(char);
                  return (
                    <span
                      key={char}
                      onClick={() => {
                        if (!isAvailable) return;
                        setSelectedAlphabet(char);
                        alphabetRefs.current[char]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                      }}
                      className={`text-sm ${isAvailable ? "cursor-pointer hover:text-black" : "cursor-not-allowed text-slate-300"} ${selectedAlphabet === char && isAvailable ? "text-black border bg-gray-300 px-1 font-semibold" : ""}`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <button onClick={onClose} className="ml-3  hover:text-slate-600 flex-shrink-0"><X size={18} /></button>
        </div>
        {/* List */}
        <div
          ref={listRef}
          className="overflow-y-auto overflow-x-auto flex-1 pr-1"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y", overscrollBehavior: "contain" }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => {
            // Stopping propagation on touchMove allows the local scroll to happen
            // while preventing the parent Sheet's scroll lock from cancelling the event.
            e.stopPropagation();
          }}
        >
          <div className={showAlphabetNav ? "columns-[220px] gap-6 min-w-max h-full" : "columns-[200px] gap-4"}>
            {filtered.map((item, index) => {
              const currentLetter = item.label[0]?.toUpperCase();
              const showHeader = showAlphabetNav && currentLetter !== filtered[index - 1]?.label[0]?.toUpperCase();
              return (
                <div key={item.value} className="break-inside-avoid mb-1">
                  {showHeader && (
                    <div
                      ref={(el) => { if (el) alphabetRefs.current[currentLetter] = el; }}
                      className="font-semibold text-sm  mb-1"
                    >
                      {currentLetter}
                    </div>
                  )}
                  <label className="flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 rounded ">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected.some((t) => t.value === item.value)}
                        onChange={(e) => onChange(
                          e.target.checked
                            ? [...selected, item]
                            : selected.filter((t) => t.value !== item.value)
                        )}
                        className="w-3 h-3 accent-dred"
                      />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-[10px] bg-dred/10 text-black rounded-full px-[7px] py-[5px]">{item.count}</span>
                    )}
                  </label>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-sm  text-center py-4">No results found</p>}
          </div>
        </div>
        {/* Footer */}
        <div className="pt-3 border-t mt-2">
          <button onClick={onClose} className="bg-dred text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#7d0c07] transition-colors">
            Show Results
          </button>
        </div>
      </div>
    </PopupPortal>
  );
}
