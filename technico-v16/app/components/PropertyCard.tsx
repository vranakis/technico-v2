import { URLS } from "@/app/lib/constants";
import Link from "next/link";

type PropertyCardProps = {
  id: string;
  address: string;
  yearOfConstruction: number;
  propertyType: string;
  userId: string;
  onDelete: (id: string) => void;
};

const PropertyCard = ({ id, address, yearOfConstruction, propertyType, userId, onDelete }: PropertyCardProps) => {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this property?")) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-gray-800 text-gray-100 p-4 m-2 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2 text-center">
      <Link href={`${URLS.property(userId, id)}`}>{address}</Link>
      </h3>
      <p className="text-center mb-2">
        <strong>Year:</strong> {yearOfConstruction} | <strong>Type:</strong> {propertyType}
      </p>
      <div className="flex justify-center">
        <Link href={`${URLS.edit_property(userId, id)}`}><button className="btn btn-primary mr-1 mb-2">Edit</button></Link>
        <button onClick={handleDelete} className="btn text-gray-50 bg-red-500 ml-1 mb-2">
          Delete
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;