"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Package, Check, PlusCircle } from "lucide-react";
import { useGetAllProductsQuery, TProduct } from "@/redux/features/product/productApi";

interface ProductSelectInputProps {
    valueName: string;
    onSelect: (product: { id?: string; name: string }) => void;
    customClass?: string;
    hideSearchIcon?: boolean;
}

export function ProductSelectInput({ valueName, onSelect, customClass, hideSearchIcon }: ProductSelectInputProps) {
    const [searchTerm, setSearchTerm] = useState(valueName);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync input with prop
    useEffect(() => {
        setSearchTerm(valueName);
    }, [valueName]);

    // Live product search query
    const { data: productsData, isLoading } = useGetAllProductsQuery({ searchTerm: searchTerm.trim() || undefined, limit: 10 }, { skip: !isOpen });

    const products = productsData?.data || [];

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchTerm(text);
        onSelect({ id: undefined, name: text });
        setIsOpen(true);
    };

    const handleSelectProduct = (prod: TProduct) => {
        setSearchTerm(prod.name);
        onSelect({ id: prod._id, name: prod.name });
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setIsOpen(false);
                        }
                    }}
                    required
                    placeholder="e.g. Hilsha Fish, Rice, Onion"
                    className={customClass || "w-full pl-4 pr-10 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground transition-colors"}
                />
                {!hideSearchIcon && <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />}
            </div>

            {/* Dropdown Suggestions Menu */}
            {isOpen && (
                <div className={`absolute ${hideSearchIcon ? "-left-10 w-[calc(100%+2.5rem)]" : "left-0 right-0"} top-full mt-2 z-50 bg-[#251508] border border-border rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto font-sans`}>
                    {isLoading ? (
                        <div className="p-3 text-center text-xs text-muted-foreground font-mono">Searching catalog products…</div>
                    ) : products.length === 0 ? (
                        <div
                            onClick={() => {
                                onSelect({ id: undefined, name: searchTerm.trim() });
                                setIsOpen(false);
                            }}
                            className="p-3 text-center text-xs text-muted-foreground hover:bg-primary/10 cursor-pointer transition-colors flex flex-col items-center gap-1"
                        >
                            <div className="flex items-center gap-1.5 text-primary font-semibold">
                                <PlusCircle className="w-4 h-4" /> Use Custom Item Name
                            </div>
                            <span className="font-mono text-[11px] text-foreground font-bold">"{searchTerm}"</span>
                            <span className="text-[10px] opacity-75">Click to confirm custom item (no catalog ID)</span>
                        </div>
                    ) : (
                        <div className="py-1">
                            <div className="px-3 py-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex justify-between">
                                <span>Catalog Product Suggestions</span>
                                <span>Click to select</span>
                            </div>
                            {products.map((prod) => {
                                const isSelected = valueName.toLowerCase() === prod.name.toLowerCase();
                                return (
                                    <div key={prod._id} onClick={() => handleSelectProduct(prod)} className={`px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-primary/15 cursor-pointer transition-colors ${isSelected ? "bg-primary/10 text-primary" : "text-foreground"}`}>
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-7 h-7 rounded-lg bg-[#1a0e07] border border-border flex items-center justify-center overflow-hidden shrink-0">
                                                {prod.photo ? <img src={prod.photo} alt={prod.name} className="w-full h-full object-cover" /> : <Package className="w-3.5 h-3.5 text-primary/70" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold truncate">{prod.name}</p>
                                                {prod.description && <p className="text-[10px] text-muted-foreground truncate">{prod.description}</p>}
                                            </div>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
