"use client";

import React, { useState } from "react";
import { Package, Search, Calendar, ChevronLeft, ChevronRight, TrendingUp, ArrowLeft } from "lucide-react";
import { useGetGroupProductsQuery, TProduct } from "@/redux/features/product/productApi";
import { useGetProductPriceGrowthTrendQuery, TProductPricePoint } from "@/redux/features/dashboard/dashboardApi";

export function WebProductsTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [growthPage, setGrowthPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);

    const { data: responseData, isLoading, isFetching } = useGetGroupProductsQuery({
        searchTerm: searchTerm.trim() || undefined,
        page,
        limit: 10,
    });

    const products = responseData?.data || [];
    const meta = responseData?.meta;

    // Price Growth Trend Query for selected product in-page view
    const { data: priceGrowthRes, isLoading: isGrowthLoading } = useGetProductPriceGrowthTrendQuery(
        { productId: selectedProduct?._id || "", page: growthPage, limit: 10 },
        { skip: !selectedProduct }
    );
    const priceGrowthData = priceGrowthRes?.data || [];
    const growthMeta = priceGrowthRes?.meta;

    return (
        <div className="flex-1 flex flex-col gap-6 font-sans">
            {/* Header & Search / Back Bar */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {selectedProduct ? (
                        <button
                            onClick={() => {
                                setSelectedProduct(null);
                                setGrowthPage(1);
                            }}
                            className="p-2.5 rounded-xl border border-border bg-[#1a0e07] hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                            title="Back to Catalog"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            {selectedProduct ? `${selectedProduct.name} - Price Growth History` : "Group Products Catalog"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {selectedProduct ? "Detailed historical price per unit logs and trend" : "Unique product list & price growth history for your group"}
                        </p>
                    </div>
                </div>

                {!selectedProduct && (
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search group products…"
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-primary/60 transition-colors"
                        />
                    </div>
                )}
            </div>

            {/* Content Section (Catalog or Price Growth Screen) */}
            {!selectedProduct ? (
                /* 1. Products Catalog Table View */
                <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between">
                    <div className="overflow-x-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                                <tr>
                                    <th className="p-4">Product Name</th>
                                    <th className="p-4">Restriction</th>
                                    <th className="p-4">Created Date</th>
                                    <th className="p-4 text-right">Price Growth</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                                {isLoading || isFetching ? (
                                    <tr>
                                        <td colSpan={4} className="p-10 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2 font-mono">
                                                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                <p className="text-xs">Loading group products…</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-10 text-center text-muted-foreground text-xs font-mono">
                                            No products found for your group catalog.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((p) => (
                                        <tr key={p._id} className="hover:bg-primary/5 transition-colors">
                                            <td className="p-4 font-bold text-foreground flex items-center gap-3">
                                                {p.photo ? (
                                                    <img src={p.photo} alt={p.name} className="w-8 h-8 rounded-xl object-cover border border-border/60 shrink-0" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                        {p.name[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <span>{p.name}</span>
                                            </td>
                                            <td className="p-4 font-mono text-xs">
                                                {p.is18Plus ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-destructive/15 text-destructive border border-destructive/30 font-bold text-[10px]">
                                                        18+ Restricted
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px]">
                                                        Standard
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-mono text-xs text-muted-foreground">
                                                {new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(p);
                                                        setGrowthPage(1);
                                                    }}
                                                    className="px-3.5 py-1.5 rounded-xl border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold font-mono transition-colors cursor-pointer inline-flex items-center gap-1.5"
                                                >
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    <span>View Growth Trend</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Catalog Pagination */}
                    {meta && (
                        <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
                            <div>
                                Showing <span className="font-bold text-foreground">{products.length}</span> of <span className="font-bold text-foreground">{meta.total}</span> products (Page <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={!meta.hasPrev || page <= 1}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
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
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* 2. Full In-Page Price Growth History View with Pagination */
                <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-between gap-6">
                    <div className="flex items-center justify-between border-b border-border/60 pb-4">
                        <div className="flex items-center gap-3">
                            {selectedProduct.photo ? (
                                <img src={selectedProduct.photo} alt={selectedProduct.name} className="w-12 h-12 rounded-2xl object-cover border border-primary/40" />
                            ) : (
                                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg">
                                    {selectedProduct.name[0]?.toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h4 className="text-base font-bold text-foreground">{selectedProduct.name}</h4>
                                <span className="text-xs text-muted-foreground font-mono">Full Price Log History</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedProduct(null);
                                setGrowthPage(1);
                            }}
                            className="px-4 py-2 rounded-xl border border-border bg-[#1a0e07] text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                            Back to Catalog
                        </button>
                    </div>

                    {/* Price Comparison Trend Chart Visualizer */}
                    {priceGrowthData.length > 1 && (() => {
                        const sortedData = [...priceGrowthData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        const firstEntry = sortedData[0];
                        const lastEntry = sortedData[sortedData.length - 1];
                        const priceDiff = lastEntry.pricePerUnit - firstEntry.pricePerUnit;
                        const absPctChange = firstEntry.pricePerUnit > 0 ? (Math.abs(priceDiff / firstEntry.pricePerUnit) * 100).toFixed(1) : "0";
                        const isUp = priceDiff > 0;
                        const isDown = priceDiff < 0;
                        const maxP = Math.max(...sortedData.map((d) => d.pricePerUnit), 10);
                        const minP = Math.min(...sortedData.map((d) => d.pricePerUnit));

                        const svgW = 800;
                        const svgH = 160;
                        const padL = 40;
                        const padR = 40;
                        const padT = 25;
                        const padB = 40;
                        const cW = svgW - padL - padR;
                        const cH = svgH - padT - padB;

                        const points = sortedData.map((d, i) => {
                            const x = padL + (i / (sortedData.length - 1 || 1)) * cW;
                            const y = padT + cH - ((d.pricePerUnit - minP * 0.8) / (maxP - minP * 0.8 || 1)) * cH;
                            const formattedDate = new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                            return { x, y, pt: d, dateStr: formattedDate };
                        });

                        const pathStr = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                        const areaStr = `${pathStr} L ${points[points.length - 1].x} ${padT + cH} L ${points[0].x} ${padT + cH} Z`;

                        return (
                            <div className="bg-[#1a0e07] border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col gap-4 font-mono">
                                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Price Comparison & Trend</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xl font-bold text-foreground">৳{lastEntry.pricePerUnit}</span>
                                            <span className="text-xs text-muted-foreground">/ {lastEntry.unit}</span>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs">
                                        <span className="text-muted-foreground block">Initial Price: <strong className="text-foreground">৳{firstEntry.pricePerUnit}</strong> ({new Date(firstEntry.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })})</span>
                                        <span className="text-muted-foreground block">Latest Price: <strong className="text-primary">৳{lastEntry.pricePerUnit}</strong> ({new Date(lastEntry.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })})</span>
                                    </div>
                                </div>

                                <div className="w-full overflow-hidden pt-2 pb-2">
                                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible">
                                        <defs>
                                            <linearGradient id="priceGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#e8a020" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#e8a020" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Thin baseline grid */}
                                        <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />

                                        <path d={areaStr} fill="url(#priceGrowthGrad)" />
                                        <path d={pathStr} fill="none" stroke="#e8a020" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

                                        {points.map((p, idx) => (
                                            <g key={idx}>
                                                <line x1={p.x} y1={p.y} x2={p.x} y2={padT + cH} stroke="rgba(232,160,32,0.2)" strokeDasharray="2 2" />
                                                <circle cx={p.x} cy={p.y} r="3" fill="#1a0e07" stroke="#e8a020" strokeWidth="1.5" />

                                                {/* Price label above dot */}
                                                <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#e8a020" fontSize="10" fontWeight="bold" fontFamily="monospace">
                                                    ৳{p.pt.pricePerUnit}
                                                </text>

                                                {/* Date label below axis */}
                                                <text x={p.x} y={padT + cH + 16} textAnchor="middle" fill="#a08060" fontSize="9" fontFamily="monospace">
                                                    {p.dateStr}
                                                </text>
                                            </g>
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        );
                    })()}

                    <div className="flex-1 overflow-x-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                        <table className="w-full border-collapse text-left text-sm font-mono">
                            <thead className="bg-[#2e1a0a] text-muted-foreground text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                                <tr>
                                    <th className="p-4">Recorded Date</th>
                                    <th className="p-4">Unit</th>
                                    <th className="p-4">Notes / Details</th>
                                    <th className="p-4 text-right">Price per Unit</th>
                                    <th className="p-4 text-right">Price Diff (vs Prev)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                                {isGrowthLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                <p className="text-xs">Fetching price growth logs…</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : priceGrowthData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-muted-foreground text-xs">
                                            No price growth logs recorded for this product yet.
                                        </td>
                                    </tr>
                                ) : (
                                    priceGrowthData.map((pt: TProductPricePoint, idx: number) => {
                                        const prevPt = priceGrowthData[idx + 1];
                                        const diff = prevPt ? pt.pricePerUnit - prevPt.pricePerUnit : 0;
                                        return (
                                            <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                                <td className="p-4 font-bold text-foreground flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                                                    <span>{new Date(pt.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                                                </td>
                                                <td className="p-4 text-muted-foreground">{pt.unit}</td>
                                                <td className="p-4 text-muted-foreground italic font-sans">{pt.notes || "—"}</td>
                                                <td className="p-4 text-right font-bold text-primary text-base">৳{pt.pricePerUnit}</td>
                                                <td className="p-4 text-right font-bold text-xs">
                                                    {!prevPt ? (
                                                        <span className="text-muted-foreground font-normal">Baseline</span>
                                                    ) : diff > 0 ? (
                                                        <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">+৳{diff}</span>
                                                    ) : diff < 0 ? (
                                                        <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">-৳{Math.abs(diff)}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">No change</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Price Growth Logs Pagination */}
                    {growthMeta && (
                        <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
                            <div>
                                Showing <span className="font-bold text-foreground">{priceGrowthData.length}</span> of <span className="font-bold text-foreground">{growthMeta.total}</span> growth records (Page <span className="font-bold text-primary">{growthMeta.page}</span> of {growthMeta.totalPages || 1})
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setGrowthPage((p) => Math.max(1, p - 1))}
                                    disabled={!growthMeta.hasPrev || growthPage <= 1}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>

                                <span className="px-2 font-bold text-foreground">
                                    {growthMeta.page} / {growthMeta.totalPages || 1}
                                </span>

                                <button
                                    onClick={() => setGrowthPage((p) => p + 1)}
                                    disabled={!growthMeta.hasNext}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
