"use client"

import { useAuth } from "@/app/components/AuthContext";
import RepairCard from "@/app/components/RepairCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Repair {
    repairId: string;
    scheduledDate: Date;
    type: string;
    description: string;
    address: string;
    status: string;
    cost: number;
    userId: string;
    propertyId: string;
}

const Property = () => {
    const params = useParams();
    const userId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";
    const propertyId = Array.isArray(params?.propertyId) ? params.propertyId[0] : params?.propertyId || "";

    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {isAuthenticated} = useAuth();

    // Exw na ftiaksw to GetRepairs(propertyId) end-point 
    useEffect(() => {
        if (!propertyId) return;
            fetchRepairs();
        }, [propertyId, isAuthenticated]);

        const fetchRepairs = async () => {
          if (!isAuthenticated) return;

          try {
              setLoading(true);
              setError(null);

              const response = await fetch(`https://localhost:7118/api/Repairs/property/${propertyId}`); // fix this

              if (!response.ok) {
                  throw new Error(`Error ${response.status}: Failed to fetch repairs`);
              }

              const data = await response.json();
              setRepairs(data); // Assuming data is an array of Repairs
          } catch (err: any) {
              setError(err.message || "An error occurred while fetching properties."); 
          } finally {
              setLoading(false);
          }
          };

        const handleDelete = async (repairId: string) => {
            if (!repairId) {
              console.error("Error: propertyId is undefined or null");
              return;
            }
        
            try {
              const response = await fetch(`https://localhost:7118/api/Repairs/${repairId}`, {
                method: "DELETE",
              });
        
              if (!response.ok) {
                throw new Error(`Error ${response.status}: Failed to delete repair`);
              }
        
              setRepairs((prev) => prev.filter((repair) => repair.repairId !== repairId));
            } catch (err: any) {
              console.error("Error deleting property:", err.message);
              setError(err.message || "An error occurred while deleting the repair.");
            }
          };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return(<> { isAuthenticated && 
    <div className="container mx-auto mt-8">
    <h1 className="text-center text-4xl text-gray-600 m-5">Property Repairs</h1>
     
    {repairs.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {repairs.map((repair) => (
            <RepairCard 
                key={repair.repairId}
                repairId={repair.repairId}
                scheduledDate={repair.scheduledDate}
                type={repair.type}
                description={repair.description}
                address={repair.address}
                status={repair.status}
                cost={repair.cost}
                userId={userId}
                propertyId={propertyId}    
                onDelete={handleDelete}      
                    
            
            />
        ))}
        
    </div>) : <p className="text-center">No repairs found for this property.</p> }
    <div className="flex flex-col items-center mb-6">
      <Link href={`/users/${userId}/properties/${propertyId}/repairs/add-repair`} className="btn btn-primary mt-5">
        Add New Repair
      </Link>
    </div>
  </div>}</>)
}

export default Property;