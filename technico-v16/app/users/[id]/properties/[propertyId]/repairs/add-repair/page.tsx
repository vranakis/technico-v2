"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";

interface FormData 
{
    scheduledDate?: Date;
    type?: string;
    description?: string;
    address?: string;
    status?: string;
    cost?: number;
    propertyItemId?: string;
    userId?: string;
}

interface FormErrors {
    [key: string]: string;
  }
  

const AddRepair = () => {
    const params = useParams();
    const router = useRouter();    
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";
    const propertyItemId = Array.isArray(params?.propertyId) ? params.propertyId[0] : params?.propertyId || "";
    const {isAuthenticated} = useAuth();

    const [formData, setFormData] = useState<FormData>({
        scheduledDate: new Date(),
        type: "",
        description: "",
        address: "",
        status: "",
        cost: 0,
        propertyItemId: propertyItemId,
        userId: userId
        })

    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "cost" ? parseFloat(value) : value });
      };


      const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
    
        if (!formData.type ) {
          newErrors.type = "Year of construction must be a valid year.";
        }
        if (!formData.description) newErrors.description = "Property description is required.";
        if (!formData.address) newErrors.address = "Property address is required.";
        if (!formData.status) newErrors.status = "Property type is required.";
        if (!formData.cost) newErrors.cost = "Cost is required.";

        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!validateForm() || !userId) {
          console.log("Form is invalid, please fix the errors.");
          return;
        }
    
        try {
          const response = await fetch("https://localhost:7118/api/Repairs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, propertyItemId: propertyItemId }),
          });
    
          if (response.ok) {
            setSuccessMessage("Repair added successfully!");
            setErrorMessage(null);
            setFormData({
              scheduledDate: new Date(),
              type: "",
              description: "",
              address: "",
              status: "",
              cost: undefined,
              propertyItemId: "",
              userId: ""
            });
            setTimeout(() => {
              router.back();
            }, 1000);
          } else {
            const errorData = await response.json();
            setSuccessMessage(null);
            setErrorMessage(`Error: ${errorData.message || "Failed to add repair."}`);
          }
        } catch (error) {
          console.error("Error sending request:", error);
          setSuccessMessage(null);
          setErrorMessage("Error: Unable to connect to the server.");
        }
      };

      return (
        <>
        {isAuthenticated && <div className="container mx-auto mt-8">
          <h1 className="text-center text-2xl font-bold mb-4">Add Repair</h1>
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
                type="date"
                name="scheduledDate"
                placeholder="Scheduled Date"
                className={`input input-bordered w-full max-w-xs m-2 ${errors.scheduledDate && "border-red-500"}`}
                value={formData.scheduledDate ? formData.scheduledDate.toISOString().split('T')[0] : ""} // Format the date
                onChange={handleChange}
              />
              {errors.scheduledDate && (
                <span className="text-red-500 text-sm">{errors.scheduledDate}</span>
              )}
    
              <input
                type="text"
                name="type"
                placeholder="Type"
                className={`input input-bordered w-full max-w-xs m-2 ${errors.type && "border-red-500"}`}
                value={formData.type}
                onChange={handleChange}
              />
              {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
    
              <input
                type="text"
                name="description"
                placeholder="Description"
                className={`input input-bordered w-full max-w-xs m-2 ${errors.description && "border-red-500"}`}
                value={formData.description}
                onChange={handleChange}
              ></input>
              {errors.description && (
                <span className="text-red-500 text-sm">{errors.description}</span>
              )}
    
              <input
                type="text"
                name="status"
                placeholder="Status"
                className={`input input-bordered w-full max-w-xs m-2 ${errors.status && "border-red-500"}`}
                value={formData.status}
                onChange={handleChange}
              />
              {errors.status && <span className="text-red-500 text-sm">{errors.status}</span>}
    
              <input
                type="number"
                name="cost"
                placeholder="Cost"
                className={`input input-bordered w-full max-w-xs m-2 ${errors.cost && "border-red-500"}`}
                value={formData.cost || ""}
                onChange={handleChange}
              />
              {errors.cost && <span className="text-red-500 text-sm">{errors.cost}</span>}
    
              <button type="submit" className="btn btn-primary pl-7 pr-7 mt-4">
                Add Repair
              </button>
            </div>
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          </form>
        </div>}
        </>
      );
    };
    
    export default AddRepair;