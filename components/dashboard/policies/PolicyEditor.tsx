"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { FileText, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { TPolicyType, useGetPolicyByTypeQuery, useUpsertPolicyMutation } from "@/redux/features/policy/policyApi";

// Dynamically import JoditEditor to avoid SSR window issues in Next.js
const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => <div className="h-96 w-full rounded-2xl bg-[#1a0e07] border border-border flex items-center justify-center text-xs font-mono text-muted-foreground">Loading Jodit Editor…</div>,
});

export function PolicyEditor() {
    const editor = useRef(null);
    const [selectedType, setSelectedType] = useState<TPolicyType>("terms");

    // RTK Query hooks
    const { data: responseData, isLoading, isFetching, refetch } = useGetPolicyByTypeQuery(selectedType);
    const [upsertPolicy, { isLoading: isSaving }] = useUpsertPolicyMutation();

    const policy = responseData?.data;

    // Form states
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (policy) {
            setTitle(policy.title || (selectedType === "terms" ? "Terms of Service" : "Privacy Policy"));
            setContent(policy.content || "");
        } else {
            setTitle(selectedType === "terms" ? "Terms of Service" : "Privacy Policy");
            setContent(selectedType === "terms" ? "<h2>Terms of Service</h2><p>Welcome to My Bazar Hisab. By using our services...</p>" : "<h2>Privacy Policy</h2><p>Your privacy is important to us. My Bazar Hisab collects...</p>");
        }
    }, [policy, selectedType]);

    // Jodit Editor Configuration (No upload options, custom buttons, dark theme compatible)
    const joditConfig = useMemo(
        () => ({
            readonly: false,
            placeholder: "Enter policy content here...",
            height: 480,
            theme: "dark",
            // Disable all uploader & image upload features completely
            uploader: {
                insertImageAsBase64URI: false,
            },
            filebrowser: {
                ajax: {
                    url: "",
                },
            },
            disablePlugins: "uploader,filebrowser",
            // Toolbar buttons explicitly excluding file/image upload
            buttons: ["bold", "italic", "underline", "strikethrough", "|", "font", "fontsize", "paragraph", "|", "align", "undo", "redo", "|", "ul", "ol", "outdent", "indent", "|", "table", "link", "hr", "|", "fullsize", "source"],
            buttonsMD: ["bold", "italic", "underline", "|", "font", "fontsize", "|", "ul", "ol", "|", "link", "undo", "redo"],
            buttonsXS: ["bold", "italic", "|", "ul", "ol", "|", "link"],
            showXPathInStatusbar: false,
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
        }),
        [],
    );

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
                        <p className="text-xs text-muted-foreground font-mono">Edit site terms, conditions, and privacy declarations</p>
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
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Document Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground font-semibold" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-muted-foreground">Policy Content {isFetching && <span className="text-primary font-mono ml-2">(Refreshing…)</span>}</label>
                        <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-xs text-primary hover:underline flex items-center gap-1 font-mono cursor-pointer">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{showPreview ? "Edit Content" : "Preview Rendered HTML"}</span>
                        </button>
                    </div>

                    {showPreview ? (
                        <div className="jodit-custom-reset flex-1 min-h-[380px] p-6 bg-[#1a0e07] border border-border rounded-2xl overflow-y-auto font-sans" dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <div className="jodit-custom-reset min-h-[400px]">
                            <JoditEditor ref={editor} value={content} config={joditConfig} onBlur={(newContent) => setContent(newContent)} />
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                        <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-primary/20">
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? "Saving Policy…" : `Save ${selectedType === "terms" ? "Terms" : "Privacy Policy"}`}</span>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
