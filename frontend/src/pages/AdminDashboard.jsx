import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);


import { IoDocumentsOutline } from "react-icons/io5";
import { FaBookOpen, FaUsers } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import api from "../helper/axiosAPI";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';


const COLORS = {
  green: "#22c55e",
  blue: "#3b82f6",
  orange: "#f97316",
  purple: "#8b5cf6"
};

const BG_COLORS = {
  from_green: "#bbf7d0",
  to_green:'#86efac',
  from_blue: "#bae6fd",
  to_blue: '#7dd3fc',
  from_orange: "#fdba74",
  to_orange: '#fb923c',
  from_purple: "#e9d5ff",
  to_purple: '#c4b5fd'
};




const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/admin/get/analytics");
      if (data?.success) setAnalytics(data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch Analytics");
    } finally {
      setLoading(false);
    }
  };

  // Chart Configuration for users registered per month
  const usersChartData = {
  labels: analytics?.usersPerMonth?.map(item => item.month),
  datasets: [
    {
      label: "Users",
      data: analytics?.usersPerMonth?.map(item => item.total),
      backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderRadius: 2,
      borderWidth: 1,

    },
  ],
  };

  const usersChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales:{
      x:{
        grid: {display:false},
      },
      y: {
        grid: {display:false},
        beginAtZero: true,
        ticks: {precision:0}
      }
    }
  };

  // Chart Configuration for documents uploaded per month
  const documentsChartData = {
    labels: analytics?.documentsPerMonth?.map(item => item.month),
    datasets: [
      {
        label: "Documents",
        data: analytics?.documentsPerMonth?.map(item => item.total),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
    ],
  };

  const documentsChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales:{
      y:{ticks: {precision:0}, beginAtZero:true}
    }
  };


  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !analytics) return <Loader />;

  return (
    <div className="w-full flex flex-col space-y-4">

      {/* Quick Analysis Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">

        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={<FaUsers />}
          color={COLORS.blue}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_green}, ${BG_COLORS.to_green})`}
        />

        <StatCard
          title="Total Documents"
          value={analytics.totalDocuments}
          icon={<IoDocumentsOutline />}
          color={COLORS.green}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_blue}, ${BG_COLORS.to_blue})`}
        />

        <StatCard
          title="Total Flashcards"
          value={analytics.totalFlashcards}
          icon={<FaBookOpen />}
          color={COLORS.orange}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_purple}, ${BG_COLORS.to_purple})`}
        />

        <StatCard
          title="Total Quizzes"
          value={analytics.totalQuizzes}
          icon={<MdOutlineQuiz />}
          color={COLORS.purple}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_orange}, ${BG_COLORS.to_orange})`}
        />
      </div>
     
      {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

      {/* Users Per Month */}
      <div className="bg-white p-2 rounded-xl shadow h-fit">
        <h3 className="mb-2 text-black/60 ">
          Users Registered Per Month
        </h3>

        <Bar
          data={usersChartData}
          options={usersChartOptions}
          height={230}
        />
      </div>

      {/* Documents Per Month */}
      <div className="bg-white p-2 rounded-xl shadow h-fit">
        <h3 className="mb-2 text-black/60">
          Documents Uploaded Per Month
        </h3>

        <Line
          data={documentsChartData}
          options={documentsChartOptions}
          height={230}
        />
      </div>

    </div>

    </div>
  );
};

/* Stat Card*/

const StatCard = ({ title, value, icon, color, bg_color }) => (
  <div 
  className=" rounded-xl shadow p-4 flex justify-between items-center min-h-28" style={{background:bg_color}}>
    <div>
      <h3 className="text-slate-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold text-slate-700 mt-2">
        {value || 0}
      </p>
    </div>
    <div
      className="p-3 rounded-lg text-white text-xl"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
