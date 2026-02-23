import React, { useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import UpdateUserProfile from "../components/UpdateUserProfile";
import { useSelector } from "react-redux";
import { formatDate } from "../helper/formatDate";

const Profile = () => {
  const [openEditForm, setOpenEditForm] = useState(false);
  const user = useSelector(state=>state?.auth?.user);


  return (
    <div className="w-full flex flex-col space-y-3">

      {/* Profile Card */}
      <div className="bg-white w-full shadow rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">

          {/* Avatar */}
          <div className="shrink-0">
            <img
              src={user?.profileImage?.imageUrl || "https://tse1.mm.bing.net/th/id/OIP.sNp65uoXWOPtBIysaNu_rQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"}
              alt="User"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex  flex-row justify-between items-center gap-2">

              <div>
                <h2 className="text-slate-700 ">
                  {user?.name || "John Doe"}
                </h2>
                <p className="text-xs text-slate-400">
                  {user?.role || 'Student'}
                </p>
              </div>

              <button onClick={()=>setOpenEditForm(true)} className="self-start cursor-pointer sm:self-center text-[11px] md:text-xs p-2 flex items-center gap-1 text-white rounded bg-orange-500 hover:bg-orange-600 transition-colors duration-300">
                <FaUserEdit className="text-sm" />
                Edit Profile
              </button>
            </div>

            <p className="text-sm text-slate-600 flex items-center gap-2 break-all">
              <CiMail />
              {user?.email || "johndoe@gmail.com"}
            </p>

            <p className="text-sm text-slate-600 flex items-center gap-2 break-all">
              <CiLocationOn />
              {user?.address || "San Francisco, CA"}
            </p>

            {/* Skills */}
            <div className="w-full md:w-[70%] flex flex-wrap gap-2">
              {user && user?.skills && user?.skills.map((skill,index)=><span key={skill} className="leading-none p-1 rounded bg-green-200 text-green-600 text-[10px]">{skill}</span>)}
            </div>
          </div>
        </div>
      </div>
      {/* About Me Section */}
      <div className="w-full bg-white p-4 rounded-xl shadow ">
        <p className="text-sm text-slate-500"> {user?.bio || "Tell us something about yourself"}</p>
      </div>
      {/* Write About Your Eduxation */}
      <div className="w-full bg-white p-4 rounded-xl shadow grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
        {user && user?.education ? 
        <>
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-700">Class 10</h1>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-500">School : {user?.education?.class10?.schoolName}</p>
            <p className="text-sm text-slate-500">Percentage:{user?.education?.class10?.percentage}</p>
            <p className="text-sm text-slate-500">Start Date : {formatDate(user?.education?.class10?.startDate)}</p>
            <p className="text-sm text-slate-500">End Date : {formatDate(user?.education?.class10?.endDate)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-700">Class 12</h1>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-500">School : {user?.education?.class12?.schoolName}</p>
            <p className="text-sm text-slate-500">Percentage:{user?.education?.class12?.percentage}</p>
            <p className="text-sm text-slate-500">Start Date : {formatDate(user?.education?.class12?.startDate)}</p>
            <p className="text-sm text-slate-500">End Date : {formatDate(user?.education?.class12?.endDate)}</p>
          </div>
        </div>
        </>
        :<><p className="text-sm text-slate-500"> Tell us something about Education</p></> }
      </div>
      {openEditForm && <UpdateUserProfile onClose={()=>setOpenEditForm(false)} user={user} />}
    </div>
  );
};

export default Profile;
