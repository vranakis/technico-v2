"use client";

import { useState, useEffect } from "react";
import UserCard from "@/app/components/UserCard";
import { UserResponse } from "@/types/Users";
import Link from "next/link";
import { useAuth } from "../components/AuthContext";

const Users = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
    const [pageCount, setPageCount] = useState<number>(1); // Current page
    const [totalUsers, setTotalUsers] = useState<number>(0); // Total users from backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAdmin } = useAuth();

    const totalPages = Math.ceil(totalUsers / 3); // Assuming 10 users per page

    useEffect(() => {
        if (searchQuery) {
            fetchSearchResults(); // Fetch search results
        } else {
            fetchPaginatedUsers(); // Fetch paginated users
        }
    }, [isAdmin, pageCount, searchQuery]); // Re-fetch when page or query changes

    const fetchPaginatedUsers = async () => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `https://localhost:7118/api/Users/paginated?pageCount=${pageCount}&pageSize=3`,
                { cache: "no-store" }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch paginated users");
            }

            const data = await res.json();
            setUsers(data.users); // Users for the current page
            setTotalUsers(data.totalUsers); // Total count of all users
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching users.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchResults = async () => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `https://localhost:7118/api/Users/search?searchQuery=${searchQuery}`,
                { cache: "no-store" }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            setUsers(data); // Use search results directly
            setTotalUsers(data.length); // Total count of search results
        } catch (err: any) {
            setError(err.message || "An error occurred while searching users.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`https://localhost:7118/api/Users/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete user.");
            }

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (err: any) {
            setError(err.message || "An error occurred while deleting the user.");
        }
    };

    return (
        <>
            {isAdmin ? (
                <div className="container mx-auto mt-8">
                    <h1 className="text-center text-4xl text-gray-600 m-5">All Users</h1>
                    <div className="flex justify-center my-4">
                        <input
                            type="text"
                            placeholder="Search by name or surname"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-bordered w-full max-w-md"
                        />
                    </div>
                    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                surname={user.surname}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                    {!searchQuery && (
                        <div className="flex justify-center gap-2 my-4">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    className={`btn ${pageCount === index + 1 ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setPageCount(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col items-center">
                        <Link href="users/add-user" className="btn btn-primary">
                            Add New User
                        </Link>
                    </div>
                </div>
            ) : (
                <p className="p-3 mt-6 text-lg/8 text-gray-600">
                    You are not authorized to view this content. <br />
                    Log in as admin and try again.
                </p>
            )}
        </>
    );
};

export default Users;
