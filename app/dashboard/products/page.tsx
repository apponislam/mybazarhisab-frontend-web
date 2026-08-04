"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Package,
    Plus,
    Search,
    GitMerge,
    ChevronLeft,
    ChevronRight,
    X,
    RefreshCw,
    SlidersHorizontal,
} from "lucide-react";
import { TProduct, useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { CreateProductModal } from "@/components/dashboard/products/CreateProductModal";
import { EditProductModal } from "@/components/dashboard/products/EditProductModal";
import { DeleteProductModal } from "@/components/dashboard/products/DeleteProductModal";
import { MergeProductsModal } from "@/components/dashboard/products/MergeProductsModal";
import { ProductDetailsModal } from "@/components/dashboard/products/ProductDetailsModal";
import { ProductTable } from "@/components/dashboard/products/ProductTable";

export default function DashboardProductsPage() {
    const router = useRouter();

    // Query state
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // RTK Query hook
    const { data: responseData, isLoading, isFetching, refetch } = useGetAllProductsQuery({
        searchTerm: searchTerm || undefined,
        page,
        limit,
    });

    const products = responseData?.data || [];
    const meta = responseData?.meta;

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
    const [viewingProductId, setViewingProductId] = useState<string | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<TProduct | null>(null);
    const [showMergeModal, setShowMergeModal] = useState(false);

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearchTerm(searchInput.trim());
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="products" onTabChange={(t) => router.push(t === "products" ? "/dashboard/products" : "/dashboard")} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Dashboard Top Header Bar */}
                <header className="h-20 border-b border-[rgba(232,160,32,0.1)] px-8 flex items-center justify-between shrink-0 bg-[#251508]/30">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight capitalize" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Products Catalog
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold font-mono">
                            <span>Sabzi Mandi Group ⭐️</span>
                        </div>

                        <button
                            onClick={() => refetch()}
                            className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                            title="Refresh products"
                        >
                            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                        </button>

                        <button
                            onClick={() => setShowMergeModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-accent text-accent text-sm font-semibold rounded-xl transition-all hover:bg-accent/10 cursor-pointer shadow-md"
                        >
                            <GitMerge className="w-4 h-4" />
                            <span>Merge Products</span>
                        </button>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:bg-accent cursor-pointer shadow-md shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Product</span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Inner Workspace Area */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Search & Filter Toolbar */}
                    <div className="bg-[#251508] border border-border rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                    setSearchTerm(e.target.value.trim());
                                    setPage(1);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        setPage(1);
                                        setSearchTerm(searchInput.trim());
                                    }
                                }}
                                placeholder="Search products (Press Enter to search)…"
                                className="w-full pl-10 pr-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground transition-colors"
                            />
                        </form>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchInput("");
                                        setSearchTerm("");
                                        setPage(1);
                                    }}
                                    className="flex items-center gap-1 text-xs text-destructive hover:underline cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" /> Clear Search ({searchTerm})
                                </button>
                            )}

                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>Rows per page:</span>
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="bg-[#1a0e07] border border-border rounded-lg px-2 py-1 text-xs outline-none text-foreground cursor-pointer"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Table Container */}
                    <div className="bg-[#251508] border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1">
                        <ProductTable
                            products={products}
                            isLoading={isLoading}
                            searchTerm={searchTerm}
                            onViewDetails={(id) => setViewingProductId(id)}
                            onEdit={(prod) => setEditingProduct(prod)}
                            onDelete={(prod) => setDeletingProduct(prod)}
                        />

                        {/* Pagination Footer */}
                        {meta && (
                            <div className="bg-[#2e1a0a] border-t border-[rgba(232,160,32,0.1)] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
                                <div>
                                    Showing <span className="font-bold text-foreground">{products.length}</span> of{" "}
                                    <span className="font-bold text-foreground">{meta.total}</span> products (Page{" "}
                                    <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={!meta.hasPrev || page <= 1}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span>Previous</span>
                                    </button>

                                    <span className="px-2 font-bold text-foreground">
                                        {meta.page} / {meta.totalPages || 1}
                                    </span>

                                    <button
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={!meta.hasNext}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <CreateProductModal show={showCreateModal} onClose={() => setShowCreateModal(false)} />
            <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />
            <DeleteProductModal product={deletingProduct} onClose={() => setDeletingProduct(null)} />
            <MergeProductsModal show={showMergeModal} products={products} onClose={() => setShowMergeModal(false)} />
            <ProductDetailsModal id={viewingProductId} onClose={() => setViewingProductId(null)} />
        </div>
    );
}
