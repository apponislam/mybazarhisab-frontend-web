import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Camera, User, Mail, Phone, Globe, MapPin, CheckCircle } from "lucide-react";
import { ScreenShell, BackButton, PrimaryButton, FieldBox, SectionLabel } from "@/components/app/ui/Shared";
import { MOCK_USERS, avatarColor, initials } from "@/lib/mockData";

export function EditProfileScreen({ onBack }: { onBack: () => void }) {
    const me = MOCK_USERS[0];
    const [photo, setPhoto] = useState<string | null>(null);
    const [name, setName] = useState(me.name);
    const [email, setEmail] = useState(me.email);
    const [phone, setPhone] = useState(me.phone);
    const [lang, setLang] = useState("English");
    const [about, setAbout] = useState("Managing our family bazar hisab since 2024.");
    const [street, setStreet] = useState("42 Mirpur Road");
    const [city, setCity] = useState("Dhaka");
    const [state, setState] = useState("Dhaka Division");
    const [zip, setZip] = useState("1216");
    const [country, setCountry] = useState("Bangladesh");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [fName, setFName] = useState(false);
    const [fEmail, setFEmail] = useState(false);
    const [fPhone, setFPhone] = useState(false);
    const [fLang, setFLang] = useState(false);
    const [fAbout, setFAbout] = useState(false);
    const [fStreet, setFStreet] = useState(false);
    const [fCity, setFCity] = useState(false);
    const [fState, setFState] = useState(false);
    const [fZip, setFZip] = useState(false);
    const [fCountry, setFCountry] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onBack();
            }, 1500);
        }, 1200);
    };

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8">
                <BackButton onBack={onBack} label="Profile" />
                <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                    Edit <span className="text-primary">Profile</span>
                </h2>

                <div className="flex justify-center mb-7 shrink-0">
                    <button type="button" onClick={() => fileRef.current?.click()} className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/40 group-hover:border-primary/80 transition-all overflow-hidden" style={{ boxShadow: "0 0 0 4px rgba(232,160,32,0.08)" }}>
                            {photo ? (
                                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white font-mono" style={{ background: avatarColor(me.id) }}>
                                    {initials(me.name)}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                            <Camera className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setPhoto(URL.createObjectURL(f));
                            }}
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <SectionLabel>Basic Info</SectionLabel>
                    {[
                        { label: "Full Name", value: name, set: setName, f: fName, setF: setFName, icon: <User className="w-4 h-4" />, type: "text" },
                        { label: "Email Address", value: email, set: setEmail, f: fEmail, setF: setFEmail, icon: <Mail className="w-4 h-4" />, type: "email" },
                        { label: "Phone Number", value: phone, set: setPhone, f: fPhone, setF: setFPhone, icon: <Phone className="w-4 h-4" />, type: "tel" },
                        { label: "Language", value: lang, set: setLang, f: fLang, setF: setFLang, icon: <Globe className="w-4 h-4" />, type: "text" },
                    ].map((field) => (
                        <FieldBox key={field.label} label={field.label} focused={field.f}>
                            <div className="flex items-center" onFocus={() => field.setF(true)} onBlur={() => field.setF(false)}>
                                <span className="pl-4 text-muted-foreground shrink-0">{field.icon}</span>
                                <input type={field.type} value={field.value} onChange={(e) => field.set(e.target.value)} className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                        </FieldBox>
                    ))}
                    <FieldBox label="About Me" focused={fAbout}>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            onFocus={() => setFAbout(true)}
                            onBlur={() => setFAbout(false)}
                            rows={3}
                            className="w-full px-4 py-3.5 bg-transparent text-foreground text-sm outline-none resize-none"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </FieldBox>

                    <SectionLabel>Address</SectionLabel>
                    {[
                        { label: "Street", value: street, set: setStreet, f: fStreet, setF: setFStreet },
                        { label: "City", value: city, set: setCity, f: fCity, setF: setFCity },
                        { label: "State / Division", value: state, set: setState, f: fState, setF: setFState },
                        { label: "ZIP Code", value: zip, set: setZip, f: fZip, setF: setFZip },
                        { label: "Country", value: country, set: setCountry, f: fCountry, setF: setFCountry },
                    ].map((field) => (
                        <FieldBox key={field.label} label={field.label} focused={field.f}>
                            <div className="flex items-center" onFocus={() => field.setF(true)} onBlur={() => field.setF(false)}>
                                <span className="pl-4 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                </span>
                                <input value={field.value} onChange={(e) => field.set(e.target.value)} className="flex-1 px-3 py-3.5 bg-transparent text-foreground text-sm outline-none" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                        </FieldBox>
                    ))}

                    <div className="mt-2">
                        {saved ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500/15 border border-green-500/30">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Profile updated!
                                </span>
                            </motion.div>
                        ) : (
                            <PrimaryButton loading={loading} label="Save Profile" loadingLabel="Saving…" />
                        )}
                    </div>
                </form>
            </div>
        </ScreenShell>
    );
}
export default EditProfileScreen;
