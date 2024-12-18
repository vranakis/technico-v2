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

const TodaysRepairs = () => {
    // const params = useParams();
    // const userId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";
    // const propertyId = Array.isArray(params?.propertyId) ? params.propertyId[0] : params?.propertyId || "";

    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
            fetchRepairs();
        }, [isAdmin]);

        const fetchRepairs = async () => {
          if (!isAdmin) return;

          try {
              setLoading(true);
              setError(null);

              const response = await fetch(`https://localhost:7118/api/Repairs/today`);

              if (!response.ok) {
                  throw new Error(`Error ${response.status}: Failed to fetch properties`);
              }

              const data = await response.json();
              console.log("Fetched Repairs:", data);
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

    return(<>
    <h1 className="text-2xl font-bold text-center mb-6">Today&apos;s Repairs</h1>
     
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
                userId={repair.userId}
                propertyId={repair.propertyId}    
                onDelete={handleDelete}      
                    
            
            />
        ))}
        
    </div>) : <p className="text-center">No repairs found for today.</p> }
  </>)
}

export default TodaysRepairs;