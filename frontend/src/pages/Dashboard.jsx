import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  ArcElement
);


import { IoDocumentsOutline } from "react-icons/io5";
import { FaBookOpen } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import api from "../helper/axiosAPI";
import Loader from "../components/Loader";
import { CiViewTimeline } from "react-icons/ci";

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

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentUserActivities, setRecentUserActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/get/analytics");
      if (data?.success) setAnalytics(data.data);
    } catch (err) {
      console.log(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserActivities = async () => {
    try {
      const response = await api.get('/users/activities/get')
      if (response?.data?.success) {
        setRecentUserActivities(response.data.data)
      }
    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }


  // Quiz Performance Over time chart configurations
  const performanceData = {
  labels: analytics?.performanceOverTime?.map(item => item.month),
  datasets: [
    {
      label: "Score",
      data: analytics?.performanceOverTime?.map(item => item.score),
      fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    },
  ],
  };

  const performanceOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: value => value + "%",
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // Average Score per Document Chart Configuration
  const sortedDocs = Array.isArray(analytics?.scorePerDocument)
  ? [...analytics?.scorePerDocument].sort((a, b) => b.score - a.score)
  : [];


  const scorePerDocData = {
    labels: sortedDocs.map(item => item.name),
    datasets: [
      {
        label: "Score",
        data: sortedDocs.map(item => item.score),
        backgroundColor: COLORS.blue,
        borderRadius: 8,
      },
    ],
  };

  const scorePerDocOptions = {
  responsive: true,
  indexAxis: "y", // makes it horizontal
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: context => context.raw + "%",
      },
    },
  },
  scales: {
    x: {
      min: 0,
      max: 100,
      ticks: {
        callback: value => value + "%",
      },
    },
    y: {
      grid: { display: false },
    },
  },
  };

  // Study Activity per weak
  const weeklyActivityData = {
  labels: analytics?.weeklyActivity?.map(item => item.day),
  datasets: [
    {
      label: "Docs",
      data: analytics?.weeklyActivity?.map(item => item.docs),
      backgroundColor: COLORS.green,
    },
    {
      label: "Flashcards",
      data: analytics?.weeklyActivity?.map(item => item.flashcards),
      backgroundColor: COLORS.orange,
    },
    {
      label: "Quizzes",
      data: analytics?.weeklyActivity?.map(item => item.quizzes),
      backgroundColor: COLORS.purple,
    },
  ],
  };

  const weeklyActivityOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
  };

  // Weak topics Data
  const weakTopicsData = {
    labels: analytics?.weakTopics?.map(item => item.name),
    datasets: [
      {
        data: analytics?.weakTopics?.map(item => item.value),
        backgroundColor: [
          COLORS.orange,
          COLORS.blue,
          COLORS.green,
        ],
        borderWidth: 0, // cleaner look
      },
    ],
  };

  const weakTopicsOptions = {
    responsive: true,
    cutout: "65%", //  makes it donut (inner hole size)
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };





  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchCurrentUserActivities()])
  }, [])

  if (loading || !analytics) return <Loader  />;

  return (
    <div className="w-full flex flex-col space-y-4">

      {/* Quick Analysis Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-2">

        <StatCard
          title="Total Documents"
          value={analytics.documents}
          icon={<IoDocumentsOutline />}
          color={COLORS.green}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_green}, ${BG_COLORS.to_green})`}
        />

        <StatCard
          title="Total Flashcards"
          value={analytics.flashcards}
          icon={<FaBookOpen />}
          color={COLORS.blue}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_blue}, ${BG_COLORS.to_blue})`}
        />

        <StatCard
          title="Quizzes Taken"
          value={analytics.quizes}
          icon={<MdOutlineQuiz />}
          color={COLORS.purple}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_purple}, ${BG_COLORS.to_purple})`}
        />

        <StatCard
          title="Average Quiz Score"
          value={`${analytics.averageQuizScore}%`}
          icon={<GiProgression />}
          color={COLORS.orange}
          bg_color={`linear-gradient(135deg, ${BG_COLORS.from_orange}, ${BG_COLORS.to_orange})`}
        />
      </div>

      {/* Charts Section  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

        {/* Quiz Performance Over Time */}
       <div className="bg-white p-2 rounded shadow h-fit">
        <h3 className="mb-2 text-black/60 ">
          Quiz Performance Over Time
        </h3>

        <Line  data={performanceData} options={performanceOptions} height={230} />
      </div>


        {/* Average Score Per Document */}
        <div className="bg-white p-2 rounded shadow h-fit">
        <h3 className="mb-2 text-black/60">
          Average Score Per Document
        </h3>

        <Bar data={scorePerDocData} options={scorePerDocOptions} height={230} />
      </div>




        {/* Study Activity This Week */}
        <div className="bg-white p-2 rounded shadow h-fit">
        <h3 className="mb-2 text-black/60">
          Study Activity This Week
        </h3>

        <Bar data={weeklyActivityData} options={weeklyActivityOptions} height={230} />
      </div>


        {/* Weak Topics Breakdown */}
        <div className="bg-white p-2 rounded shadow h-fit">
          <h3 className="mb-2 text-black/60">
            Weak Topics Breakdown
          </h3>

          <Doughnut
            data={weakTopicsData}
            options={weakTopicsOptions}
            height={230}
          />
        </div>

      </div>
      <div className='bg-white p-4 rounded-xl border-none shadow'>
        <div className='flex items-center space-x-2 mb-3'>
          <CiViewTimeline />
          <h3 className='text-slate-600'>Recent Activities</h3>
        </div>

        {recentUserActivities?.map(activity => (
          <div key={activity._id} className='py-2'>
            <h4 className='text-sm text-black/60'>{activity.title}</h4>
            <p className='text-xs text-slate-400'>
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Quick Analysis Card */
const StatCard = ({ title, value, icon, color, bg_color }) => (
  <div className="rounded-xl shadow hover:shadow-lg transition-shadow duration-500 p-4 flex justify-between items-center min-h-27.5" style={{ background: bg_color }}>
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

export default Dashboard;
