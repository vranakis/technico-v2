"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";

const LogoutButton = () => {
    const router = useRouter();
    const {fireReload} = useAuth();

    const handleLogout = () => {
        //localStorage.removeItem("token"); // Clear token
        localStorage.setItem("token", "no-token");
        fireReload();
        router.push("/login"); // Redirect to login page
    };

    return (
        <button onClick={handleLogout} className="btn btn-primary">
            Logout
        </button>
    );
};

export default LogoutButton;