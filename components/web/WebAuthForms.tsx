import React, { useState } from "react";
import WebLayoutWrapper from "./auth/WebLayoutWrapper";
import WebLoginScreen from "./auth/WebLoginScreen";
import WebRegisterScreen from "./auth/WebRegisterScreen";
import WebForgotEmailScreen from "./auth/WebForgotEmailScreen";
import WebForgotOtpScreen from "./auth/WebForgotOtpScreen";
import WebForgotNewPassScreen from "./auth/WebForgotNewPassScreen";
import WebForgotSuccessScreen from "./auth/WebForgotSuccessScreen";

export function WebAuthForms({ onLogin, onBack }: { onLogin: () => void; onBack?: () => void }) {
    const [screen, setScreen] = useState<"login" | "register" | "forgot-email" | "forgot-otp" | "forgot-newpass" | "forgot-success">("login");
    const [forgotEmail, setForgotEmail] = useState("");

    const wrap = (node: React.ReactNode) => <WebLayoutWrapper>{node}</WebLayoutWrapper>;

    if (screen === "register") {
        return wrap(<WebRegisterScreen onBack={() => setScreen("login")} onDone={onLogin} />);
    }
    if (screen === "forgot-email") {
        return wrap(
            <WebForgotEmailScreen
                onBack={() => setScreen("login")}
                onNext={(em) => {
                    setForgotEmail(em);
                    setScreen("forgot-otp");
                }}
            />,
        );
    }
    if (screen === "forgot-otp") {
        return wrap(<WebForgotOtpScreen email={forgotEmail} onBack={() => setScreen("forgot-email")} onNext={() => setScreen("forgot-newpass")} />);
    }
    if (screen === "forgot-newpass") {
        return wrap(<WebForgotNewPassScreen onBack={() => setScreen("forgot-otp")} onDone={() => setScreen("forgot-success")} />);
    }
    if (screen === "forgot-success") {
        return wrap(<WebForgotSuccessScreen onDone={() => setScreen("login")} />);
    }

    return wrap(<WebLoginScreen onLogin={onLogin} onBack={onBack} onRegister={() => setScreen("register")} onForgot={() => setScreen("forgot-email")} />);
}
