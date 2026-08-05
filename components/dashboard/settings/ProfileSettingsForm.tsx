"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Phone, MapPin, Globe, FileText } from "lucide-react";
import { toast } from "sonner";
import { useGetMeQuery, useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

export function ProfileSettingsForm() {
    const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const currentUser = userData?.data;

    // Form fields
    const [profileImage, setProfileImage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [language, setLanguage] = useState("English");
    const [aboutme, setAboutme] = useState("");

    // Address fields
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("Bangladesh");

    useEffect(() => {
        if (currentUser) {
            setProfileImage(currentUser.profileImage || "");
            setName(currentUser.name || "");
            setEmail(currentUser.email || "");
            setPhone(currentUser.phone || "");
            setLanguage(currentUser.language || "English");
            setAboutme(currentUser.aboutme || "");

            if (currentUser.address) {
                setStreet(currentUser.address.street || "");
                setCity(currentUser.address.city || "");
                setState(currentUser.address.state || "");
                setZipCode(currentUser.address.zipCode || "");
                setCountry(currentUser.address.country || "Bangladesh");
            }
        }
    }, [currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        try {
            await updateProfile({
                profileImage: profileImage || undefined,
                name: name.trim(),
                phone: phone.trim() || undefined,
                language: language.trim() || undefined,
                aboutme: aboutme.trim() || undefined,
                address: {
                    street: street.trim() || undefined,
                    city: city.trim() || undefined,
                    state: state.trim() || undefined,
                    zipCode: zipCode.trim() || undefined,
                    country: country.trim() || undefined,
                },
            }).unwrap();

            toast.success("Complete profile updated successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update profile");
        }
    };

    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Edit Profile Details</h3>
                        <p className="text-xs text-muted-foreground">Manage your personal account, photo, bio & address</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {currentUser?.role && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-primary/15 text-primary border border-primary/30">{currentUser.role}</span>}
                    {currentUser?.isEmailVerified && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-green-500/15 text-green-400 border border-green-500/30">Verified</span>}
                </div>
            </div>

            {isUserLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground font-mono text-xs">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>Loading profile details…</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Profile Picture Upload Section (Full Round & Centered) */}
                    <div className="flex flex-col items-center justify-center text-center pb-2">
                        <ImageUpload label="Profile Avatar Photo" variant="circle" value={profileImage} onChange={(url) => setProfileImage(url)} onRemove={() => setProfileImage("")} />
                    </div>

                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Your full name"
                                    className="w-full pl-4 pr-10 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-primary/60 transition-colors"
                                />
                                <User className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-muted-foreground">Email Address</label>
                                <span className="text-[10px] text-muted-foreground/80 font-mono flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-muted-foreground" /> Cannot be changed
                                </span>
                            </div>
                            <div className="relative">
                                <input type="email" value={email} disabled readOnly title="Email address cannot be changed." className="w-full pl-4 pr-10 py-3 bg-[#170c06] border border-border/40 rounded-xl text-sm text-muted-foreground opacity-60 cursor-not-allowed font-mono select-none" />
                                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+880 1700-000000"
                                    className="w-full pl-4 pr-10 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground font-mono focus:border-primary/60 transition-colors"
                                />
                                <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Preferred Language</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    placeholder="e.g. English, Bengali"
                                    className="w-full pl-4 pr-10 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-primary/60 transition-colors"
                                />
                                <Globe className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* About Me Bio */}
                    <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-primary" /> About Me / Bio
                        </label>
                        <textarea value={aboutme} onChange={(e) => setAboutme(e.target.value)} rows={3} placeholder="Write a brief intro about yourself…" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground" />
                    </div>

                    {/* Address Section */}
                    <div className="border-t border-border pt-4 flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" /> Address Details
                        </h4>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground mb-1">Street Address</label>
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="House / Flat #, Road name" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground" />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">City</label>
                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dhaka" className="w-full px-3 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">State / Division</label>
                                <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Dhaka" className="w-full px-3 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Zip Code</label>
                                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="1205" className="w-full px-3 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground font-mono" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Country</label>
                                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Bangladesh" className="w-full px-3 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isUpdating} className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer shadow-md disabled:opacity-50 mt-2">
                        {isUpdating ? "Saving Complete Profile…" : "Save Complete Profile"}
                    </button>
                </form>
            )}
        </div>
    );
}
