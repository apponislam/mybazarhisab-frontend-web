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
    ArrowLeft,
    RefreshCw,
    SlidersHorizontal,
} from "lucide-react";
import { TProduct, useGetAllProductsQuery } from "@/redux/features/product/productApi";
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
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex flex-col font-sans">
            {/* Header / Navigation Topbar */}
            <header className="bg-[#251508] border-b border-[rgba(232,160,32,0.15)] px-6 py-4 sticky top-0 z-30 shadow-lg">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="p-2 rounded-xl bg-[#1a0e07] border border-border hover:border-primary/50 transition-colors text-muted-foreground hover:text-primary cursor-pointer"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                <h1 className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Products Management
                                </h1>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">
                                Manage, edit, create, and merge catalog products
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            onClick={() => refetch()}
                            className="p-2.5 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                            title="Refresh products"
                        >
                            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                        </button>

                        <button
                            onClick={() => setShowMergeModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold transition-all cursor-pointer shadow-md"
                        >
                            <GitMerge className="w-4 h-4" />
                            <span>Merge Products</span>
                        </button>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-accent text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
                {/* Search & Filter Toolbar */}
                <div className="bg-[#251508] border border-border rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by product name or description…"
                            className="w-full pl-10 pr-24 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground transition-colors"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-accent transition-all cursor-pointer"
                        >
                            Search
                        </button>
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

                {/* Products Table */}
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
