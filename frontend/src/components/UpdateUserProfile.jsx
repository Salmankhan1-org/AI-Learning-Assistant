import React, { useState } from 'react';
import { FaCamera, FaRegUser } from 'react-icons/fa';
import { MdClose } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { FaSearchLocation } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { GoPlus } from "react-icons/go";
import { BsCalendarDate } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";
import { LuSchool } from "react-icons/lu";
import { LuPercent } from "react-icons/lu";
import ImageUpload from './ImageUpload';
import { toast } from 'react-toastify';
import api from '../helper/axiosAPI';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../features/user/authThunk';
import { ClipLoader } from 'react-spinners';


const UpdateUserProfile = ({onClose,user}) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [isClass10Open, setIsClass10Open] = useState(true);
    const [isClass12Open, setIsClass12Open] = useState(true);
    const [loadingUserUpdate, setLoadingUserUpdate] = useState(false);

    // Form Data
    const [skill, setSkill] = useState();
    const [skills, setSkills] = useState([]);
    const [location, setLocation] = useState();
    const [name , setName] = useState()
    const [dateOfBirth, setDateOfBirth] = useState();
    const [aboutMe, setAboutMe] = useState();
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [class10Data, setClass10Data] = useState({
        schoolName : '',
        percentage : '',
        startDate:'',
        endDate : ''
    })
    const [class12Data, setClass12Data] = useState({
        schoolName : '',
        percentage : '',
        startDate:'',
        endDate : ''
    })


    const handleClass10DataChange = (e)=>{
        const {name,value} = e.target;
        setClass10Data(prev=>({...prev, [name]:value}))
    }
    const handleClass12DataChange = (e)=>{
        const {name,value} = e.target;
        setClass12Data(prev=>({...prev, [name]:value}))
    }


    //Fetch the current location of user
    const getCurrentLocation = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
        const { latitude, longitude } = position.coords;

        try {
            // Reverse geocoding (OpenStreetMap - FREE)
            const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();

            const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "";
            const state = data.address.state || "";
            const country = data.address.country || "";

            setLocation(`${city}, ${state}, ${country}`.trim());
        } catch (err) {
            alert("Failed to fetch location");
        } finally {
            setLoading(false);
        }
        },
        () => {
        alert("Location permission denied");
        setLoading(false);
        }
    );
    };

    // Submit the user data to update it
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('address', location);
        formData.append('bio', aboutMe);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('skills', JSON.stringify(skills));
        formData.append('class10Data', JSON.stringify(class10Data));
        formData.append('class12Data', JSON.stringify(class12Data));
        if(imageFile) formData.append('image', imageFile);

        try {
            setLoadingUserUpdate(true);
            const response = await api.put(
            `/users/update/${user?._id}`,
            formData,
            {
                headers: {
                'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            }
            );

            if (response.data.success) {
                setLoadingUserUpdate(false);
                dispatch(fetchCurrentUser());
                onClose();
                toast.success(response.data.message);
            }
        } catch (error) {
            setLoadingUserUpdate(false);
            toast.error(error?.response?.data?.message || "Error in Update details");
        }
    };
    
  return (
    <div className='absolute inset-0 bg-black/25 z-60 flex py-10 justify-center'>
        {/* Form to Update the user details */}
        <div className='w-full max-w-md flex flex-col space-y-3  bg-white rounded-xl p-4 overflow-y-auto'>
            <div className='flex items-center justify-between'>
                <h1 className='text-slate-700 text-sm md:text-base'>Update User Details</h1>
                <button onClick={onClose} className='p-2 rounded-full cursor-pointer'><MdClose className='text-xl'/></button>
            </div> 
            {/* Name */}
            <div className="w-full">
                <label className=" text-sm">
                Name
                </label>
                <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                    <FaRegUser className="px-1 text-gray-400 text-2xl"/>
                    <input
                    type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Enter your Name"
                    className=" w-full border-none outline-none text-sm"
                    />
                </div>
            </div>
            {/* Address */}
            <div className="w-full">
                <label className="text-sm">Location</label>

                <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                    <CiLocationOn className="px-1 text-gray-400 text-2xl" />

                    <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your Location or click icon to fill"
                    className="w-full border-none outline-none text-sm"
                    />

                <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                className="h-full px-2 border-l cursor-pointer hover:bg-slate-100 transition-colors duration-300 border-l-slate-300"
                >
                <FaSearchLocation className={`text-gray-500 text-xl ${loading ? "animate-pulse" : ""}`} />
                </button>
            </div>
            </div>
            {/* Date of Birth */}
            <div className="w-full">
                <label className=" text-sm">
                Date of Birth
                </label>
                <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                    <BsCalendarDate className="px-1 text-gray-400 text-2xl"/>
                    <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e)=>setDateOfBirth(e.target.value)}
                    placeholder="Enter your DOB"
                    className=" w-full border-none outline-none text-sm"
                    />
                </div>
            </div>

            {/* skills */}
            <div className='w-full flex flex-col space-y-2'>
                <div className='flex gap-2 items-end'>
                    <div className="w-full">
                        <label className=" text-sm">
                        Skills
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <GiProgression className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="text"
                            value={skill}
                            onChange={(e)=>setSkill(e.target.value)}
                            placeholder="Enter your skills one by one"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>
                    <button onClick={()=>{
                        setSkills(prev =>
                            prev.includes(skill) ? prev : [...prev, skill]
                        );
                        setSkill("");
                    }} className='leading-none text-slate-500 h-8 p-1.5 rounded border flex items-center gap-1 cursor-pointer hover:bg-slate-100 transition-colors duration-500 border-slate-200'> <GoPlus/> Add</button>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {skills.map((skill, index)=>
                    <span key={skill+index} className='relative leading-none p-1 rounded text-xs border border-slate-200 text-slate-400'>
                        {skill}
                        <MdClose onClick={()=>setSkills(prev=>prev.filter((_,i)=> i!=index))} className='absolute cursor-pointer -right-2 -top-2 text-red-600 text-xl'  />
                    </span>)}
                </div>
            </div>

            {/* Bio */}
            <div className="w-full">
                <label className=" text-sm">
                Write about yourself
                </label>
                <textarea 
                value={aboutMe}
                onChange={(e)=>setAboutMe(e.target.value)}
                className="flex w-full items-center p-1 text-sm outline-none  border border-gray-300 rounded"
                placeholder='Write about yourself'
                >
                </textarea>
            </div>
            {/* Education */}
            <div className='w-full flex flex-col gap-1 '>
                <h1 className='text-sm'>
                    Education
                </h1>
                {/* 10th Class details */}
                <div className="p-2 border border-slate-300 rounded flex flex-col gap-2">

                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsClass10Open(prev => !prev)}
                >
                    <h1 className="text-sm font-medium">Class 10</h1>

                    {isClass10Open ? (
                    <FaChevronDown className="text-slate-500" />
                    ) : (
                    <FaChevronUp className="text-slate-500" />
                    )}
                </div>

                {/* Collapsible content */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                    isClass10Open ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="flex flex-col gap-2 pt-2">

                        {/* School name */}
                    <div className="w-full">
                        <label className=" text-sm">
                        School name
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <LuSchool className="px-1 text-gray-400 text-2xl"/>
                            <input
                            value={class10Data.schoolName}
                            name='schoolName'
                            onChange={handleClass10DataChange}
                            type="text"
                            placeholder="Enter your School Name"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className=" text-sm">
                        Percentage (%)
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <LuPercent className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="text"
                            value={class10Data.percentage}
                            name='percentage'
                            onChange={handleClass10DataChange}
                            placeholder="Enter your 10th percentage"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className=" text-sm">
                        Start Date
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <BsCalendarDate className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="date"
                            value={class10Data.startDate}
                            name='startDate'
                            onChange={handleClass10DataChange}
                            placeholder="Enter your 10th class Start Date"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className=" text-sm">
                        End Date
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <BsCalendarDate className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="date"
                            value={class10Data.endDate}
                            name='endDate'
                            onChange={handleClass10DataChange}
                            placeholder="Enter your 10th class End Date"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    </div>
                </div>
                </div>

                {/* 12th Class details */}
                <div className="p-2 border border-slate-300 rounded flex flex-col gap-2">

                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsClass12Open(prev => !prev)}
                >
                    <h1 className="text-sm font-medium">Class 12</h1>

                    {isClass12Open ? (
                    <FaChevronDown className="text-slate-500" />
                    ) : (
                    <FaChevronUp className="text-slate-500" />
                    )}
                </div>

                {/* Collapsible content */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                    isClass12Open ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="flex flex-col gap-2 pt-2">

                   <div className="w-full">
                        <label className=" text-sm">
                        School name
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <LuSchool className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="text"
                            value={class12Data.schoolName}
                            name='schoolName'
                            onChange={handleClass12DataChange}
                            placeholder="Enter your School Name"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className=" text-sm">
                        Percentage (%)
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <LuPercent className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="text"
                            value={class12Data.percentage}
                            name='percentage'
                            onChange={handleClass12DataChange}
                            placeholder="Enter your 12th percentage"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className=" text-sm">
                        Start Date
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <BsCalendarDate className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="date"
                            value={class12Data.startDate}
                            name='startDate'
                            onChange={handleClass12DataChange}
                            placeholder="Enter your 12th class Start Date"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <label className=" text-sm">
                        End Date
                        </label>
                        <div className="flex w-full items-center h-8 border border-gray-300 rounded">
                            <BsCalendarDate className="px-1 text-gray-400 text-2xl"/>
                            <input
                            type="date"
                            value={class12Data.endDate}
                            name='endDate'
                            onChange={handleClass12DataChange}
                            placeholder="Enter your 12th class End Date"
                            className=" w-full border-none outline-none text-sm"
                            />
                        </div>
                    </div>

                    </div>
                </div>
                </div>
            </div>

            {/* User Image Upload */}
            <div className="flex w-full gap-4 items-center ">
            <ImageUpload
                preview={preview}
                setPreview={setPreview}
                setImageFile={setImageFile}
            />
            </div>

            {/* Button to submit the data */}
            <button
                onClick={handleSubmit}
                disabled={loadingUserUpdate}
                className={`w-full leading-none p-2 text-sm rounded text-white flex items-center justify-center gap-2 transition-colors duration-500
                    ${loading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-500 cursor-pointer"}
                `}
                >
                {loadingUserUpdate ? (
                    <>
                    <ClipLoader size={18} color="#fff" />
                    Uploading...
                    </>
                ) : (
                    "Upload"
                )}
            </button>

        </div>
    </div>
  )
}

export default UpdateUserProfile