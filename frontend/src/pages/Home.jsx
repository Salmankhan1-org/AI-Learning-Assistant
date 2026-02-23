import React from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/Header';
import { Suspense } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';


const Home = () => {
    const user = useSelector(state=>state?.user?.user);

  return (
    <div className='w-screen h-screen flex flex-col'>
        <Header/>
        <div className='flex '>
            <Sidebar/>
            <div>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Home