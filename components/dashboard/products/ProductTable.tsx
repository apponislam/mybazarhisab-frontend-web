"use client";

import React from "react";
import { Package, Check, ShieldAlert, Eye, Edit2, Trash2 } from "lucide-react";
import { TProduct } from "@/redux/features/product/productApi";

interface ProductTableProps {
    products: TProduct[];
    isLoading: boolean;
    searchTerm: string;
    onViewDetails: (id: string) => void;
    onEdit: (product: TProduct) => void;
    onDelete: (product: TProduct) => void;
}

export function ProductTable({ products, isLoading, searchTerm, onViewDetails, onEdit, onDelete }: ProductTableProps) {
    return (
        <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                    <tr>
                        <th className="p-4">Product Info</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-center">18+ Status</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(232,160,32,0.06)]">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                    <p className="text-xs font-mono">Loading products catalog…</p>
                                </div>
                            </td>
                        </tr>
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Package className="w-10 h-10 text-muted-foreground/40 mb-1" />
                                    <p className="text-sm font-semibold">No products found</p>
                                    <p className="text-xs text-muted-foreground">{searchTerm ? "Try searching for a different keyword." : "Click 'Add Product' to create your first product."}</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product._id} className="hover:bg-primary/5 transition-colors group">
                                {/* Product Info */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-[#1a0e07] border border-border flex items-center justify-center overflow-hidden shrink-0">
                                            {product.photo ? <img src={product.photo} alt={product.name} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-primary/70" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-foreground">{product.name}</h4>
                                                {product.isEdited && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">Edited</span>}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-mono select-all" title={product._id}>
                                                ID: {product._id}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Description */}
                                <td className="p-4 max-w-xs truncate text-xs text-muted-foreground">{product.description || <span className="italic opacity-50">No description provided</span>}</td>

                                {/* 18+ Status */}
                                <td className="p-4 text-center">
                                    {product.is18Plus ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-destructive/15 text-destructive border border-destructive/30">
                                            <ShieldAlert className="w-3 h-3" /> 18+ Only
                                        </span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground font-mono">General</span>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="p-4 text-center">
                                    {product.isDeleted ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-gray-500/20 text-gray-400 border border-gray-500/30">Deleted</span>
                                    ) : product.isActive !== false ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-green-500/15 text-green-400 border border-green-500/30">
                                            <Check className="w-3 h-3" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">Inactive</span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button onClick={() => onViewDetails(product._id)} className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors cursor-pointer" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <button onClick={() => onEdit(product)} className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-accent/50 text-muted-foreground hover:text-accent transition-colors cursor-pointer" title="Edit Product">
                                            <Edit2 className="w-4 h-4" />
                                        </button>

                                        <button onClick={() => onDelete(product)} className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="Delete Product">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
