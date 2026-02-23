import { useEffect, useState } from "react";
import { Outlet, useParams, Link } from "react-router-dom";
import { DocumentContext } from "../../helper/DocumentContext";
import api from "../../helper/axiosAPI";
import DocumentActionsHeader from "../../components/DocumentActionsHeader";
import { IoMdArrowBack } from "react-icons/io";
import Loader from "../../components/Loader";

const DocumentActionsLayout = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await api.get(`/documents/${id}`, {
          withCredentials: true,
        });
        setDocument(res.data.data);
      } catch (err) {
        console.error("Error fetching document", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) return <Loader/>

  return (
    <DocumentContext.Provider value={document}>
      <div className="h-full w-full flex flex-col space-y-3">
      <div className="bg-white px-4 py-2 rounded-xl shadow">
        <h1 className="text-lg text-black/60">{document?.title}</h1>
      </div>
      <DocumentActionsHeader />
      <div className="flex-1 overflow-auto ">
        <Outlet />
      </div>
      </div>
    </DocumentContext.Provider>
  );
};

export default DocumentActionsLayout;
