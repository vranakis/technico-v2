"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";

interface FormData {
  address: string;
  yearOfConstruction: number;
  propertyType: string;
}

interface FormErrors {
  [key: string]: string;
}

const AddProperty = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [formData, setFormData] = useState<FormData>({
    address: "",
    yearOfConstruction: 0,
    propertyType: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {isAuthenticated} = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.yearOfConstruction || formData.yearOfConstruction <= 0) {
      newErrors.yearOfConstruction = "Year of construction must be a valid year.";
    }
    if (!formData.propertyType) newErrors.propertyType = "Property type is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      console.log("Form is invalid, please fix the errors.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7118/api/PropertyItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, ownerId: id }),
      });

      if (response.ok) {
        setSuccessMessage("Property added successfully!");
        setErrorMessage(null);
        setFormData({ address: "", yearOfConstruction: 0, propertyType: "" });
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        const errorData = await response.json();
        setSuccessMessage(null);
        setErrorMessage(`Error: ${errorData.message || "Failed to add property."}`);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setSuccessMessage(null);
      setErrorMessage("Error: Unable to connect to the server.");
    }
  };

  return (<>{isAuthenticated &&
    <div className="container mx-auto mt-8">
      <h1 className="text-center text-2xl font-bold mb-4">Add Property</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <input
            type="text"
            name="address"
            placeholder="Address"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.address && "border-red-500"}`}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}

          <input
            type="number"
            name="yearOfConstruction"
            placeholder="Year of Construction"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.yearOfConstruction && "border-red-500"}`}
            value={formData.yearOfConstruction}
            onChange={handleChange}
          />
          {errors.yearOfConstruction && (
            <span className="text-red-500 text-sm">{errors.yearOfConstruction}</span>
          )}

          <input
            type="text"
            name="propertyType"
            placeholder="Property Type"
            className={`input input-bordered w-full max-w-xs m-2 ${errors.propertyType && "border-red-500"}`}
            value={formData.propertyType}
            onChange={handleChange}
          />
          {errors.propertyType && <span className="text-red-500 text-sm">{errors.propertyType}</span>}

          <button type="submit" className="btn btn-primary pl-7 pr-7 mt-4">
            Add Property
          </button>
        </div>
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </form>
    </div>}
    </>);
};

export default AddProperty;