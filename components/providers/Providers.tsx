"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import store, { persistor } from "@/redux/store";
import { VisitorTracker } from "./VisitorTracker";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <VisitorTracker />
                {children}
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        style: {
                            borderRadius: "1rem",
                            padding: "0.85rem 1.25rem",
                            fontSize: "0.85rem",
                        },
                    }}
                />
            </PersistGate>
        </Provider>
    );
}
