"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Camera } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    label?: string;
    variant?: "circle" | "square";
}

export function ImageUpload({ value, onChange, onRemove, label = "Photo", variant = "square" }: ImageUploadProps) {
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

    const isCircle = variant === "circle";
    const shapeClass = isCircle ? "rounded-full" : "rounded-3xl";

    return (
        <div className={`flex flex-col gap-1.5 font-sans ${isCircle ? "items-center text-center" : ""}`}>
            {label && <label className="text-xs font-semibold text-muted-foreground">{label}</label>}

            {value ? (
                /* Image Preview Container */
                <div className={`relative w-36 h-36 sm:w-40 sm:h-40 ${shapeClass} border-2 border-primary/40 bg-[#1a0e07] overflow-hidden group shadow-xl flex items-center justify-center shrink-0`}>
                    <img src={value} alt="Uploaded photo" className={`w-full h-full object-cover ${shapeClass}`} />
                    <div className={`absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 ${shapeClass}`}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-accent transition-colors cursor-pointer shadow-md">
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                onRemove?.();
                            }}
                            className="p-1.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer shadow-md"
                            title="Remove photo"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                /* Upload Box Container */
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`w-36 h-36 sm:w-40 sm:h-40 ${shapeClass} border-2 border-dashed border-border hover:border-primary/60 bg-[#1a0e07] flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all shrink-0 ${uploading ? "opacity-60 pointer-events-none" : ""}`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            <p className="text-[10px] font-mono text-primary font-semibold">Uploading…</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 ${isCircle ? "rounded-full" : "rounded-2xl"} bg-primary/10 border border-primary/20 flex items-center justify-center text-primary`}>{isCircle ? <Camera className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}</div>
                            <div>
                                <p className="text-xs font-bold text-foreground leading-tight">Upload Photo</p>
                                <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Cloudinary (PNG, JPG)</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
    );
}
