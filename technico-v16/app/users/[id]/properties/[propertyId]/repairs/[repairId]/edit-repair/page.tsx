"use client" 

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/app/components/AuthContext";

interface FormData
{
    scheduledDate?: Date;
    type?: string;
    description?: string;
    address?: string;
    status?: string;
    cost?: number;
    repairId?: string;
}

interface FormErrors {
    [key: string]: string; // Generic object to hold error messages for each field
}

const EditRepair = () => {
    const params = useParams();
    const router = useRouter();
    const repairId = params?.repairId;
    const id = params?.id;
    const {isAuthenticated} = useAuth();    

    const [formData, setFormData] = useState<FormData>({
        scheduledDate: new Date(),
        type: "",
        description: "",
        address: "",
        status: "",
        cost: 0,
        })

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    useEffect(() => {
        if (!repairId) return;

        fetchRepair();
    }, [repairId, isAuthenticated]);

    const fetchRepair = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await fetch(`https://localhost:7118/api/Repairs/${repairId}`);
            if (!response.ok){
                throw new Error(`Error ${response.status}: Failed to fetch repair data`);
            }
            const repair = await response.json();
            setFormData(repair);
        }
        catch (err: any){
            setErrorMessage(err.message || "An error occured while fetching repair data.");
        }
        finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!validateForm() || !id) {
            console.log("Form is invalid, please fix the errors.");
            return;
        }
    
        try {
            const response = await fetch(`https://localhost:7118/api/Repairs/${repairId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
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
                repairId: "",
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData({
          ...formData,
          [name]: name === "cost" ? parseFloat(value) : name === "scheduledDate" ? new Date(value) : value,
        });
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

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-center text-2xl font-bold mb-4">Edit Repair</h1>
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
                value={formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().split('T')[0] : ""} // Safely convert to date
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
                Submit Changes
                </button>
            </div>
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </form>
        </div>
        );
    };

export default EditRepair