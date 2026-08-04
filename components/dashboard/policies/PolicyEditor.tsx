"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, FileText, Save, CheckCircle2, Globe, Eye } from "lucide-react";
import { toast } from "sonner";
import { TPolicyType, TPolicy, useGetPolicyByTypeQuery, useUpsertPolicyMutation } from "@/redux/features/policy/policyApi";

export function PolicyEditor() {
    const [selectedType, setSelectedType] = useState<TPolicyType>("terms");

    // RTK Query hooks
    const { data: responseData, isLoading, isFetching, refetch } = useGetPolicyByTypeQuery(selectedType);
    const [upsertPolicy, { isLoading: isSaving }] = useUpsertPolicyMutation();

    const policy = responseData?.data;

    // Form states
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [version, setVersion] = useState("1.0");
    const [isPublished, setIsPublished] = useState(true);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (policy) {
            setTitle(policy.title || (selectedType === "terms" ? "Terms of Service" : "Privacy Policy"));
            setContent(policy.content || "");
            setVersion(policy.version || "1.0");
            setIsPublished(policy.isPublished !== false);
        } else {
            setTitle(selectedType === "terms" ? "Terms of Service" : "Privacy Policy");
            setContent(
                selectedType === "terms"
                    ? "# Terms of Service\n\nWelcome to My Bazar Hisab. By using our services..."
                    : "# Privacy Policy\n\nYour privacy is important to us. My Bazar Hisab collects..."
            );
            setVersion("1.0");
            setIsPublished(true);
        }
    }, [policy, selectedType]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error("Please enter a title and content");
            return;
        }

        try {
            await upsertPolicy({
                type: selectedType,
                data: {
                    title: title.trim(),
                    content: content.trim(),
                    version: version.trim() || "1.0",
                    isPublished,
                },
            }).unwrap();

            toast.success(`${selectedType === "terms" ? "Terms of Service" : "Privacy Policy"} saved successfully!`);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to save policy");
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl font-sans">
            {/* Policy Tabs Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Legal & Privacy Policy Editor</h3>
                        <p className="text-xs text-muted-foreground font-mono">
                            Edit and publish site terms, conditions, and privacy declarations
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1 border border-border rounded-2xl bg-[#1a0e07]">
                    {(["terms", "privacy"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedType(t)}
                            className="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize"
                            style={{
                                background: selectedType === t ? "#e8a020" : "transparent",
                                color: selectedType === t ? "#1a0e07" : "#a08060",
                            }}
                        >
                            {t === "terms" ? "Terms of Service" : "Privacy Policy"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Policy Form Editor */}
            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-xs font-mono">Loading policy content…</p>
                </div>
            ) : (
                <form onSubmit={handleSave} className="flex-1 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Document Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground font-semibold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Version</label>
                            <input
                                type="text"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                required
                                placeholder="v1.0"
                                className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Markdown Content {isFetching && <span className="text-primary font-mono ml-2">(Refreshing…)</span>}
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-xs text-primary hover:underline flex items-center gap-1 font-mono cursor-pointer"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{showPreview ? "Edit Content" : "Preview Rendered"}</span>
                        </button>
                    </div>

                    {showPreview ? (
                        <div className="flex-1 min-h-[350px] p-6 bg-[#1a0e07] border border-border rounded-2xl overflow-y-auto prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {content}
                        </div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={14}
                            required
                            placeholder="Enter policy markdown text content here…"
                            className="flex-1 min-h-[350px] p-5 bg-[#1a0e07] border border-border rounded-2xl text-sm outline-none focus:border-primary/60 text-foreground font-mono leading-relaxed"
                        />
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setIsPublished(!isPublished)}
                        >
                            <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                                className="w-4 h-4 rounded border-border text-primary focus:ring-0 cursor-pointer"
                            />
                            <div>
                                <p className="text-xs font-bold text-foreground">Publish Document Immediately</p>
                                <p className="text-[10px] text-muted-foreground font-mono">
                                    Visible to public users on landing page and app footer
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? "Saving Policy…" : `Save ${selectedType === "terms" ? "Terms" : "Privacy Policy"}`}</span>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
