import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import api from "../helper/axiosAPI";
import Loader from "../components/Loader";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loadingUser, setLoadingUser] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const fetchUsers = async () => {
    try {
      setLoadingUser(true);
      const { data } = await api.get(
        `/users/admin/all?page=${page}&limit=${limit}`
      );

      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUser(false);
    }
  };

  // handle Delete User
  const handleDelete = async(userId)=>{
    try {
        const response = await api.delete(`/users/admin/${userId}/delete`);

        if(response?.data.success){
            fetchUsers();
            toast.success(response?.data?.message);
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Error in Deleting User");
    }
  }

  // update user Status 
  const toggleStatus = async(userId)=>{
    try {
        const response = await api.patch(`/users/admin/${userId}/status`);
        if(response?.data?.success){
            fetchUsers();
            toast.success(response?.data?.message);
        }
    } catch (error) {
        toast.error(error?.response?.data?.message||"Error in Status Toggle");
    }
  }

  //update User Role
  const handleRoleChange = async(userId, role)=>{
    try {
        const response = await api.patch(`/users/admin/role-update/${userId}`, {role});

        if(response?.data?.success){
            fetchUsers();
            setOpenDropdown(null);
            toast.success(response?.data?.message);
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "Error in Role Updating");
    }
  }

  // Filter users based on name and email
  const filteredUsers = users.filter((user) => {
  const term = searchTerm.toLowerCase();

  return (
    user.name?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term)
  );
});


// Get Page number in Pagination
const getPaginationNumbers = (current, total) => {
  const delta = 2; // how many pages around current
  const range = [];
  const rangeWithDots = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  let last;
  for (let i of range) {
    if (last) {
      if (i - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (i - last > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    last = i;
  }

  return rangeWithDots;
};




  useEffect(() => {
    fetchUsers();
  }, [page]);

  if (loadingUser) return <Loader />;

  return (
      <div className="w-full h-full flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-2 rounded-xl shadow mb-4">
          <h2 className="text-lg text-black/60">
            Students
          </h2>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                onChange={(e)=>setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-xl border-none">
          <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-1.5 text-left">ID</th>
                <th className="px-6 py-1.5 text-center">Name</th>
                <th className="px-6 py-1.5 text-center">Email</th>
                <th className="px-6 py-1.5 text-center">Role</th>
                <th className="px-6 py-1.5 text-center">Status</th>
                <th className="px-6 py-1.5 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? 
              <tr>
                  <td colSpan="7" className="text-center py-6">
                    No Users found
                  </td>
                </tr>
              :filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`
                    ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    hover:bg-slate-100 transition
                  `}
                >
                  {/* ID */}
                  <td className="px-6 py-1">
                    {(page - 1) * limit + index + 1}
                  </td>

                  {/* Name + Avatar */}
                  <td className="px-6 py-1 flex items-center gap-3">
                    <img
                      src={
                        user?.profileImage?.imageUrl ||
                        "https://img.freepik.com/premium-photo/photo-portrait-young-smiling-college-school-student-white-background_1128603-21254.jpg?w=2000"
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-slate-700">
                      {user.name}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-1 text-slate-600">
                    {user.email}
                  </td>

                  {/* Role Badge */}
                  <td className="px-6 py-1">
                    <span
                        
                      className={`leading-none  px-2 py-1 rounded text-white text-xs shadow-xl
                        ${
                          user.role === "admin"
                            ? "bg-linear-to-r from-blue-500 to-blue-600"
                            : "bg-linear-to-r from-purple-500 to-indigo-500"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-1">
                    <span
                    onClick={()=>toggleStatus(user?._id)}
                      className={`leading-none px-2 py-1 cursor-pointer rounded text-xs shadow-xl  text-white
                        ${
                          user?.isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-1 text-center relative">
                    <div className="flex items-center justify-center gap-2">

                        {/* EDIT WITH DROPDOWN */}
                        <div className="relative">
                        <button
                            onClick={() =>
                            setOpenDropdown(openDropdown === user._id ? null : user._id)
                            }
                            className="bg-blue-500 shadow-xl hover:bg-blue-600 text-white leading-none px-3 py-1.5 rounded text-xs flex items-center gap-1"
                        >
                            Edit
                            <FaEdit />
                        </button>

                        {openDropdown === user._id && (
                            <div
                            className={`absolute right-0 w-32 bg-white border border-slate-300 rounded-lg shadow-lg z-50
                            ${
                                index >= users.length - 2
                                ? "bottom-full mb-2"   // show above for last 2
                                : "top-full mt-2"      // show below for others
                            }`}
                            >
                            <button
                                onClick={() => handleRoleChange(user._id, "student")}
                                className="block w-full  text-left px-4 py-2 text-sm hover:bg-blue-600 hover:text-white rounded-t-lg"
                            >
                                Student
                            </button>

                            <button
                                onClick={() => handleRoleChange(user._id, "admin")}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-600 hover:text-white rounded-b-lg"
                            >
                                Admin
                            </button>
                            </div>
                        )}
                        </div>

                    {/* DELETE BUTTON */}
                    <button
                    onClick={() => handleDelete(user?._id)}
                    className="bg-red-500 hover:bg-red-600 shadow-xl text-white leading-none px-3 py-1.5 rounded text-xs flex items-center gap-1"
                    >
                    Delete
                    <MdDelete />
                    </button>
                </div>
                </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
       <div className="flex justify-center items-center mt-6">
          <div className="flex items-center bg-white shadow rounded px-4 py-2 gap-2">

            {/* Previous */}
            <button
              disabled={!pagination?.hasPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition
                ${
                  pagination?.hasPrevPage
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-300 cursor-not-allowed"
                }`}
            >
              <GrPrevious/>
            </button>

            {/* Page Numbers */}
            {getPaginationNumbers(
              pagination?.currentPage,
              pagination?.totalPages
            ).map((item, index) =>
              item === "..." ? (
                <span key={`${item}-${index}`} className="px-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition
                    ${
                      pagination?.currentPage === item
                        ? "bg-emerald-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {item}
                </button>
              )
            )}

            {/* Next */}
            <button
              disabled={!pagination?.hasNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition
                ${
                  pagination?.hasNextPage
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-300 cursor-not-allowed"
                }`}
            >
              <GrNext/>
            </button>

          </div>
      </div>


      </div>
  );
};

export default AllUsers;
