import React, { useEffect, useState } from "react";
import { FaTrash, FaUserLock, FaUnlock } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import Tooltip from "../components/Tooltip";
import ConfirmationModal from "../components/ConfirmationModal";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(`/admin/users?page=${currentPage}`);
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        toast.error(error.response.data.message || "An error occurred");
      }
    };

    if (authUser?.role === "ADMIN") {
      fetchUsers();
    }
  }, [authUser, currentPage]);

  const handleLockUser = async (userId) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/lock`);
      toast.success(res.data.message);
      // Update the user in the list
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isLocked: true } : user
        )
      );
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const handleUnlockUser = async (userId) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/unlock`);
      toast.success(res.data.message);
      // Update the user in the list
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isLocked: false } : user
        )
      );
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const openModal = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setUserToDelete(null);
    setIsModalOpen(false);
  };

  const handleDeleteUser = async () => {
    try {
      const res = await axiosInstance.delete(`/admin/users/${userToDelete}`);
      toast.success(res.data.message);
      setUsers(users.filter((user) => user._id !== userToDelete));
      closeModal();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="pt-20 flex flex-col w-full h-full">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
          User Management
        </h1>
        <p className="mt-2 text-base-content text-opacity-70">
          A list of all the users in your account including their name, email
          and role.
        </p>
      </div>
      <div className="overflow-x-auto bg-base-100 shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-base-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-base-content uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.profilePic || "/avatar.png"}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-base-content">
                        {user.fullName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-base-content">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-base-content">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-base-content">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-4">
                    {user.isLocked ? (
                      <Tooltip text="Unlock User">
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleUnlockUser(user._id)}
                        >
                          <FaUnlock className="inline-block h-5 w-5" />
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip text="Lock User">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleLockUser(user._id)}
                        >
                          <FaUserLock className="inline-block h-5 w-5" />
                        </button>
                      </Tooltip>
                    )}
                    <Tooltip text="Delete User">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => openModal(user._id)}
                      >
                        <FaTrash className="inline-block h-5 w-5" />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-4">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <button
            className="btn btn-sm btn-outline mr-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteUser}
        title="Delete User"
      >
        <p>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
      </ConfirmationModal>
    </div>
  );
}

export default AdminPage;
