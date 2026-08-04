"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    label?: string;
}

export function ImageUpload({ value, onChange, onRemove, label = "Product Photo" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "j5va5yg1";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Mybazarhisab-App";

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10MB");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.secure_url) {
                onChange(data.secure_url);
                toast.success("Photo uploaded to Cloudinary!");
            } else {
                throw new Error(data.error?.message || "Failed to upload image to Cloudinary");
            }
        } catch (err: any) {
            toast.error(err?.message || "Error uploading photo to Cloudinary");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">{label}</label>

            {value ? (
                <div className="relative w-full h-44 rounded-2xl border border-border bg-[#1a0e07] overflow-hidden group flex items-center justify-center">
                    <img src={value} alt="Product photo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-accent transition-colors cursor-pointer shadow-md"
                        >
                            Change Photo
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                onRemove?.();
                            }}
                            className="p-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer shadow-md"
                            title="Remove photo"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`w-full h-36 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-[#1a0e07] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                        uploading ? "opacity-60 pointer-events-none" : ""
                    }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-7 h-7 text-primary animate-spin" />
                            <p className="text-xs font-mono text-primary font-semibold">Uploading to Cloudinary…</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground">Click or drop file to upload</p>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Direct Cloudinary upload (PNG, JPG, WEBP)</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
