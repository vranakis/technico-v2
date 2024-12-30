"use client"

import { useRouter } from 'next/navigation';
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { useState } from 'react';

interface FormData {
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

const AddUser = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        surname: '',
        vatNumber: '',
        address: '',
        phoneNumber: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

     // Handle input change
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

   // Validate the form
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

   // Handle form submission
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
        console.log("Form is invalid, please fix the errors.");
        return;
    }

    try {
        console.log("EDWWW ", JSON.stringify(formData));
        const response = await fetch("https://localhost:7118/api/Users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), // Convert form data to JSON
        });

        if (response.ok) {
            setSuccessMessage("User added successfully!");
            setErrorMessage(null);
            setFormData({
                name: "",
                surname: "",
                vatNumber: "",
                address: "",
                phoneNumber: "",
                email: "",
                password: "",
            });
            setTimeout(() => {
                router.back();
              }, 1000);
        } else {
            const errorData = await response.json();
            setSuccessMessage(null);
            setErrorMessage(`Error: ${errorData.message || "Failed to add user."}`);
        }
    } catch (error) {
        console.error("Error sending request:", error);
        setSuccessMessage(null);
        setErrorMessage("Error: Unable to connect to the server.");
    }
};

return (
    <>   
        <h1 className="text-center text-2xl text-gray-600 m-5">Add User</h1>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Name" 
                    className={`input input-bordered w-full max-w-xs m-2 ${errors.name && "border-red-500"}`} 
                    value={formData.name} 
                    onChange={handleChange} 
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

                <input 
                    type="text" 
                    name="surname" 
                    placeholder="Surname" 
                    className={`input input-bordered w-full max-w-xs m-2 ${errors.surname && "border-red-500"}`} 
                    value={formData.surname} 
                    onChange={handleChange} 
                />
                {errors.surname && <span className="text-red-500 text-sm">{errors.surname}</span>}

                <input 
                    type="text" 
                    name="vatNumber" 
                    placeholder="VAT Number" 
                    className={`input input-bordered w-full max-w-xs m-2 ${errors.vatNumber && "border-red-500"}`} 
                    value={formData.vatNumber} 
                    onChange={handleChange} 
                />
                {errors.vatNumber && <span className="text-red-500 text-sm">{errors.vatNumber}</span>}

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
                    type="text" 
                    name="phoneNumber" 
                    placeholder="Phone Number" 
                    className={`input input-bordered w-full max-w-xs m-2 ${errors.phoneNumber && "border-red-500"}`} 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                />
                {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}

                <input 
                    type="text" 
                    name="email" 
                    placeholder="Email" 
                    className={`input input-bordered w-full max-w-xs m-2 ${errors.email && "border-red-500"}`} 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className={`input input-bordered w-full max-w-xs m-2 ${errors.password && "border-red-500"}`} 
                    value={formData.password} 
                    onChange={handleChange} 
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}

                <button type="submit" className="btn btn-primary pl-7 pr-7">Add User</button>           
            </div>    

            {/* Success and Error Messages */}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </form>
    </>
);
};

export default AddUser;