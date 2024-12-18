"use client";

import { useAuth } from "@/app/components/AuthContext";
import RepairCard from "@/app/components/RepairCard";
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

const AllRepairs = () => {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
        fetchRepairs();
    }, [isAdmin]);

    useEffect(() => {
        // Filter repairs dynamically based on the search query
        const query = searchQuery.toLowerCase();
        setFilteredRepairs(
            repairs.filter(
                (repair) =>
                    repair.type.toLowerCase().includes(query) ||
                    repair.description.toLowerCase().includes(query) ||
                    repair.address.toLowerCase().includes(query)
            )
        );
    }, [searchQuery, repairs]);

    const fetchRepairs = async () => {
        if (!isAdmin) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://localhost:7118/api/Repairs/all`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: Failed to fetch repairs`);
            }

            const data = await response.json();
            console.log("Fetched Repairs:", data);

            const parsedData = data.map((repair: Repair) => ({
                ...repair,
                scheduledDate: new Date(repair.scheduledDate), // Ensure dates are parsed properly
            }));

            setRepairs(parsedData);
            setFilteredRepairs(parsedData); // Initialize filtered repairs
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching repairs.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (repairId: string) => {
        if (!repairId) {
            console.error("Error: repairId is undefined or null");
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
            console.error("Error deleting repair:", err.message);
            setError(err.message || "An error occurred while deleting the repair.");
        }
    };

    return (<>{ isAdmin &&
        <div className="container mx-auto mt-8"> 
            <h1 className="text-center text-4xl text-gray-600 m-5">All Repairs</h1>

            <div className="flex justify-center my-4">
                <input
                    type="text"
                    placeholder="Search repairs by type, description, or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
            </div>

            {repairs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredRepairs.map((repair) => (
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
                </div>
            ) : (
                <p className="text-center">No repairs found for today.</p>
            )}
        </div>    
    }</>
    );
};

export default AllRepairs;
