"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";
import { URLS } from "../lib/constants";

interface LoginRequestDto
{
    email: string,
    password: string
}

interface LoginResponseDto
{
 id: string,
 email: string,
 isAdmin: boolean
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {fireReload} = useAuth();
    const [user, setUser] = useState<LoginResponseDto | null>(null);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

            // Fetch Users
            try {
              setIsLoading(true);
              const response = await fetch("https://localhost:7118/api/Users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
              });

              if (!response.ok) {
                throw new Error(`Error ${response.status}: Failed to fetch user data`);
              }
              
              const userData: LoginResponseDto = await response.json();
              setUser(userData);

              
              localStorage.setItem("userId", userData.id)
              
              localStorage.setItem("token", userData.isAdmin ? "mock-admin-token" : "mock-user-token");

              console.log("Login successful:", userData);

              // Redirect based on role
              if (!userData.isAdmin) {
                router.push("/");
              }
              else {
                router.push("/");
              }

            } catch (err: any) {
              setError(err.message || "An error occurred while fetching user data.");
            } finally {
              setIsLoading(false);;            
          }; 

        fireReload();
        console.log(user);
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h1 className="text-3xl mb-5">Welcome to Technico ;-)</h1>
            <h3 className="text-2xl mb-5">Login</h3>
            <form onSubmit={handleSubmit} className="w-96 p-4 border rounded-lg">
                <input
                    type="text"
                    placeholder="Email"
                    className="input input-bordered w-full mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
                <div className="flex justify-center mt-2"><a className="font-medium text-slate-500 dark:text-blue-500 hover:underline" href="users/add-user">Subscribe</a></div>
            </form>
        </div>
    );
};

export default Login;