import { URLS } from "@/app/lib/constants";
import Link from "next/link";

type RepairCardProps = {
  repairId: string;
  scheduledDate: Date;
  type: string;
  description: string;
  address: string;
  status: string;
  cost: number;
  userId: string;
  propertyId: string;
  onDelete: (id: string) => void;
};

const PropertyCard = ({ repairId, scheduledDate, type, description, address, status, cost, userId, propertyId, onDelete }: RepairCardProps) => {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this repair request?")) {
      onDelete(repairId);
    }
  };

  return (
    <div className="bg-gray-800 text-gray-100 p-4 m-2 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2 text-center">
      <Link href={`${URLS.repair(userId, propertyId, repairId)}`}>Type: {type} <br />Description: {description}</Link>
      </h3>
      <p className="text-center mb-2">
        <strong>Status:</strong> {status} | <strong>Cost:</strong> {cost}
      </p>
      <div className="flex justify-center">
        <Link href={`${URLS.edit_repair(userId, propertyId, repairId)}`} passHref><button className="btn btn-primary mr-1 mb-2">Edit</button></Link>
        <button onClick={handleDelete} className="btn text-gray-50 bg-red-500 ml-1 mb-2">
          Delete
        </button>

      </div>
    </div>
  );
};

export default PropertyCard;