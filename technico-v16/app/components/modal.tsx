import React, { useState } from 'react';
import Link from 'next/link';
import { URLS } from '../lib/constants';

type UserResponse = {
  id: string;
  name?: string;
  surname?: string;
};

const ModalComponent: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const openModal = async () => {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      await fetchUsers();
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://localhost:7118/api/Users');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch users`);
      }
      const data: UserResponse[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(event.target.value);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={openModal}>
        Add New Property
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Choose a user from the dropdown below:
          </p>
          <div>
            {users.length > 0 ? (
              <select
                className="select select-bordered w-full"
                onChange={handleUserChange}
                value={selectedUserId || ''}
              >
                <option value="" disabled>
                  Select a user
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.surname}
                  </option>
                ))}
              </select>
            ) : (
              <p>Loading users...</p>
            )}
          </div>
          <div className="modal-action">
            {selectedUserId && (
              <Link
                href={URLS.add_property(selectedUserId)}
                className="btn btn-primary"
              >
                Add New Property
              </Link>
            )}
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ModalComponent;
