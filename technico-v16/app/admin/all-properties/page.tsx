"use client";

import { useState, useEffect } from "react";
import { PropertyItem } from "@/types/Properties";
import { useAuth } from "../../components/AuthContext";
import PropertyCard from "@/app/components/PropertyCard";
import ModalComponent from "@/app/components/modal";

const Properties = () => {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, [isAdmin]);

  useEffect(() => {
    // Filter properties based on the search query
    const query = searchQuery.toLowerCase();
    setFilteredProperties(
      properties.filter(
        (property) =>
          property.address?.toLowerCase().includes(query) ||
          property.propertyType?.toLowerCase().includes(query) ||
          property.yearOfConstruction?.toString().includes(query)
      )
    );
  }, [searchQuery, properties]);

  const fetchProperties = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://localhost:7118/api/PropertyItem", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch properties data");
      }

      const data: PropertyItem[] = await res.json();
      setProperties(data);
      setFilteredProperties(data); // Initialize filtered properties with all properties
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`https://localhost:7118/api/PropertyItem?propertyItemId=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete property.");
      }

      // Remove the property from the local state after successful deletion
      setProperties((prevProperties) => prevProperties.filter((property) => property.id !== id));
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting the property.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      {isAdmin ? (
        <div className="container mx-auto mt-8">        
          <h1 className="text-center text-4xl text-gray-600 m-5">All Properties</h1>

          <div className="flex justify-center my-4">
            <input
              type="text"
              placeholder="Search by address, type, or year"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full max-w-md"
            />
          </div>
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                address={property.address}
                yearOfConstruction={property.yearOfConstruction}
                propertyType={property.propertyType}
                userId={property.ownerId}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            <ModalComponent />
          </div>
        </div>
      ) : (
        <p className="p-3 mt-6 text-lg/8 text-gray-600">
          You are not authorized to view this content. <br />
          Log in as admin and try again.
        </p>
      )}
    </>
  );
};

export default Properties;