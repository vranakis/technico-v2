import Link from "next/link";
import { URLS } from "@/app/lib/constants";
import type { User } from "@/types/Users";

type UserCardProps = User & { id: string; onDelete: (id:string) => void };

const UserCard = ({ id, name, surname, onDelete }: UserCardProps) => {

    const handleDelete = () => {
      if (confirm("Are you sure you want to delete this user?")){
        onDelete(id);
      }
    };

    return (
      <div className="bg-gray-800 text-gray-100 p-4 m-2 rounded-lg shadow-md ">
        <h3 className="text-xl font-bold mb-2 text-center p-2">
          {id ? <Link href={URLS.properties(id)}>{name} {surname}</Link> : name}
        </h3><div className="flex justify-center">
        <Link href={URLS.edit_user(id)} passHref><button className="btn btn-primary mr-1 mb-2">Edit</button></Link>
        <button onClick={handleDelete} className="btn text-gray-50 bg-red-500 ml-1 mb-2">Delete</button>
      </div></div>
    );
  };


  
  export default UserCard;
