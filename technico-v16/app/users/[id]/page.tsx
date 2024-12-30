"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";
import Link from "next/link";
import { URLS } from "@/app/lib/constants";

interface User {
  name: string;
  surname: string;
  vatNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
}

const ViewUser = () => {
  const params = useParams();
  const id = params?.id;
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log(id);
    if (!id) return;
    fetchUser();
  }, [id, isAuthenticated]);

  const fetchUser = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7118/api/Users/${id}`);
      if (!response.ok) {
        console.log("error1");
        throw new Error(`Error ${response.status}: Failed to fetch user data`);
      }
      const userData = await response.json();
      setUser(userData);
    } catch (err: any) {
        console.log("error2");
      setErrorMessage(err.message || "An error occurred while fetching user data.");
    } finally {
        console.log("finish");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-5">
      <h1 className="text-center text-4xl text-gray-600 m-5">User Details</h1>
      <div className="flex flex-col items-center bg-black p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <span className="font-semibold">Name:</span> {user.name}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Surname:</span> {user.surname}
        </div>
        <div className="mb-4">
          <span className="font-semibold">VAT Number:</span> {user.vatNumber}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Address:</span> {user.address}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Phone Number:</span> {user.phoneNumber}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Email:</span> {user.email}
        </div>
      </div>
      <div className="flex flex-col items-center mb-6">
        <Link href={URLS.edit_user(`${id}`)} passHref><button className="btn btn-primary mr-1 mb-2">Edit User Details</button></Link>
      </div>
    </div>
  );
};

export default ViewUser;
