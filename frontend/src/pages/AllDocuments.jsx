import { useEffect, useState } from "react";
import axios from "axios";
import api from "../helper/axiosAPI";
import { formatDate, formatISODate } from "../helper/formatDate";
import Loader from "../components/Loader";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { GrNext, GrPrevious } from "react-icons/gr";

const AllDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const limit = 6;

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/documents/admin/get/all?page=${page}&limit=${limit}`
      );

      setDocuments(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      const response = await api.delete(`/documents/${id}/admin/delete`);

      if(response?.data.success){
        fetchDocuments();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message||"Error in deleting user");
    }
  };

   // Filter users based on name and email
  const filteredDocuments = searchTerm
  ? documents.filter((document) =>
      document.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : documents;

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
    fetchDocuments();
  }, [page]);

  if(loading) return <Loader />
 
  return (
    <div className="w-full h-full flex flex-col ">
      <div className="flex bg-white rounded-lg p-2 shadow justify-between items-center mb-4 ">
        <h2 className="text-lg text-black/60">
            Documents
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

      
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-left text-sm text-black/60 ">
                <tr>
                  <th className="px-4 py-1">ID</th>
                  <th className="px-4 py-1">Title</th>
                  <th className="px-4 py-1">Owner</th>
                  <th className="px-4 py-1">Date</th>
                  <th className="px-4 py-1 text-center">Quizzes</th>
                  <th className="px-4 py-1 text-center">Flashcards</th>
                  <th className="px-4 py-1 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc, index) => (
                    <tr
                      key={`${doc._id}-${index}`}
                      className={`
                    ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    hover:bg-slate-100 transition text-sm text-black/60
                  `}
                    >
                      <td className="px-4 py-1">{index}</td>

                      <td className="px-4 py-1 font-medium">
                        {doc.title}
                      </td>

                      <td className="px-4 py-1">
                        {doc.userId?.name || "N/A"}
                      </td>

                      <td className="px-4 py-1">
                        {formatISODate(doc?.createdAt)}
                      </td>

                      <td className="px-4 py-1 text-center">
                        {doc.countQuizzes}
                      </td>

                      <td className="px-4 py-1 text-center">
                        {doc.countFlashcards}
                      </td>

                      <td className="px-4 py-1 text-center">
                        <button
                        onClick={() => handleDelete(doc?._id)}
                        className="bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-colors duration-300 cursor-pointer shadow-xl text-white leading-none px-2 py-1.5 rounded text-xs flex items-center gap-1"
                        >
                        Delete
                        <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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

export default AllDocuments;
