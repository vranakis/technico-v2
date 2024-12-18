"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/app/components/PropertyCard";
import { useAuth } from "@/app/components/AuthContext";
import { URLS } from "@/app/lib/constants";

interface PropertyItem {
  id: string; // Property ID
  address: string;
  yearOfConstruction: number;
  propertyType: string;
  ownerId: string;
}

const PropertiesPage = () => {
  const params = useParams();
  //const userId = params?.id; // Extract user ID from the URL
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    if (!userId) return;
    fetchProperties();
  }, [userId, isAuthenticated]);

  const fetchProperties = async () => {      
    if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://localhost:7118/api/PropertyItem/${userId}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch properties`);
        }

        const data = await response.json();
        setProperties(data); // Assuming data is an array of PropertyItems
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching properties.");
      } finally {
        setLoading(false);
      }
    };

  const handleDelete = async (propertyId: string) => {
    if (!propertyId) {
      console.error("Error: propertyId is undefined or null");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7118/api/PropertyItem?propertyItemId=${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to delete property`);
      }

      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
    } catch (err: any) {
      console.error("Error deleting property:", err.message);
      setError(err.message || "An error occurred while deleting the property.");
    }
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (<>{ isAuthenticated &&

    <div className="container mx-auto mt-8">
      <h1 className="text-center text-4xl text-gray-600 m-5">User Properties</h1>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              address={property.address}
              yearOfConstruction={property.yearOfConstruction}
              propertyType={property.propertyType}
              userId={userId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-center">No properties found for this user.</p>
      )}
      <div className="flex flex-col items-center mt-6">
        <Link href={URLS.add_property(userId)} className="btn btn-primary">
          Add New Property
        </Link>
      </div>
    </div>    
    }</>
  );
};

export default PropertiesPage;
