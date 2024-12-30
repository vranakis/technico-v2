"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";

interface User {
  name: string;
  surname: string;
  vatNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
}

interface FormErrors {
    [key: string]: string; // Generic object to hold error messages for each field
}

const EditUser = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const {isAuthenticated} = useAuth();

  const [formData, setFormData] = useState<User>({
    name: "",
    surname: "",
    vatNumber: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchUser();
  }, [id, isAuthenticated]);

  const fetchUser = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7118/api/Users/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch user data`);
      }
      const user = await response.json();
      setFormData(user);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.surname) newErrors.surname = "Surname is required.";
    if (!formData.vatNumber || !/^\d{9}$/.test(formData.vatNumber)) {
        newErrors.vatNumber = "VAT Number must be 9 digits.";
    }
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Phone Number must be 10 digits.";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email address.";
    }
    if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`https://localhost:7118/api/Users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to update user`);
      }

      setSuccessMessage("User updated successfully!");
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while updating the user.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;

  return (
    <div>
      <h1 className="text-center text-4xl text-gray-600 m-5">Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
        <div className="flex items-center w-80">
          <label className="w-32" htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.name && "border-red-500"}`}
            value={formData.name}
            onChange={handleChange}
          />
          </div>
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

          <div className="flex items-center w-80 justify-between">
          <label className="w-32" htmlFor="surname">Surname:</label>
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.surname && "border-red-500"}`}
            value={formData.surname}
            onChange={handleChange}
          />
          </div>
          {errors.surname && <span className="text-red-500 text-sm">{errors.surname}</span>}

          <div className="flex items-center w-80">
          <label className="w-32" htmlFor="vatNumber">VAT number:</label>
          <input
            type="text"
            name="vatNumber"
            placeholder="VAT Number"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.vatNumber && "border-red-500"}`}
            value={formData.vatNumber}
            onChange={handleChange}
          />
          </div>
          {errors.vatNumber && <span className="text-red-500 text-sm">{errors.vatNumber}</span>}

          <div className="flex items-center w-80">
          <label className="w-32" htmlFor="address">Address:</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.address && "border-red-500"}`}
            value={formData.address}
            onChange={handleChange}
          />
          </div>
          {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}

          <div className="flex items-center justify-around w-80">
          <label className="w-32" htmlFor="phoneNumber">Phone number:</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.phoneNumber && "border-red-500"}`}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          </div>
          {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}

          <div className="flex items-center justify-around w-80">
          <label className="w-32" htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.email && "border-red-500"}`}
            value={formData.email}
            onChange={handleChange}
          />
          </div>
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

          <div className="flex items-center w-80">
          <label className="w-32" htmlFor="password">Password:</label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.password && "border-red-500"}`}
            value={formData.password}
            onChange={handleChange}
          />
          </div>
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}

          <button type="submit" className="btn btn-primary pl-7 pr-7">Update User</button>
        </div>

        {/* Success and Error Messages */}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default EditUser;