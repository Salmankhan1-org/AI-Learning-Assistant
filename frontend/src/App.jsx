import { useState } from 'react'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import { createBrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Navigate, RouterProvider } from 'react-router'
import VerifyEmail from './pages/Auth/VerifyEmail'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import { useDispatch, useSelector } from 'react-redux'

import { useEffect } from 'react'
import { setUser } from './features/user/authSlice'
import axios from 'axios'
import Dashboard from './pages/Dashboard'
import AppLayout from './pages/Layouts/AppLayout'
import Documents from './pages/Documents'
import FlashCards from './pages/FlashCards'
import Profile from './pages/Profile'
import FlashcardSet from './pages/FlashcardSet'
import ProtectedRoute from './components/ProtectedRoute'
import { fetchCurrentUser } from './features/user/authThunk'
import DocumentLayout from './pages/Layouts/DocumentLayout'
import DocumentActionsLayout from './pages/Layouts/DocumentActionsLayout'
import CardContent from './pages/CardContent'
import CardAIChat from './pages/CardAIChat'
import DocumentFlashcard from './pages/DocumentFlashcard'
import FlashcardLayout from './pages/Layouts/FlashcardLayout'
import Quizzes from './pages/Quizzes'
import DisplayQuiz from './pages/DisplayQuiz'
import QuizAnalysis from './pages/QuizAnalysis'
import AIActions from './pages/AIActions'
import AllUsers from './pages/AllUsers'
import AdminDashboard from './pages/AdminDashboard'
import AllDocuments from './pages/AllDocuments'


const router = createBrowserRouter([
  {
    path: "/user/auth/login",
    element: <Login />
  },
  {
    path: "/user/auth/signup",
    element: <Signup />
  },
  {
    path: "/user/auth/verify-email",
    element: <VerifyEmail />
  },
  {
    path: "/user/auth/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/user/auth/reset-password/:token",
    element: <ResetPassword />
  },

  {
    path: "/",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      
      {
        index: true,
        element: <Navigate to="/user/dashboard" replace />
      },
      {
        path: "user/dashboard",
        element: <Dashboard />
      },
      {
        path : "/user/admin/dashboard",
        element : <AdminDashboard/>
      },
      {
        path: "documents",
        element: <DocumentLayout />,
        children:[
          {
            index: true,
            element: <Documents/>
          },
          {
            path:':id',
            element:<DocumentActionsLayout/>,
            children:[
              {
                index:true,
                element:<CardContent/>
              },
              {
                path:'chat',
                element:<CardAIChat/>
              },
              {
                path: 'actions',
                element: <AIActions/>
              },
              {
                path : "flashcard",
                element : <FlashcardLayout/>,
                children : [
                  {
                    index : true,
                    element: <DocumentFlashcard/>
                  },
                  {
                    path: ':id',
                    element : <FlashcardSet/>
                  }
                ]
              },
              {
                path : 'quizzes',
                element : <Quizzes/>
              },
              
            ]
          }
        ]
      },
      {
        path: 'quizzes/:quizId',
        element: <DisplayQuiz/>
      },
      {
        path: 'quizzes/:quizId/analysis',
        element: <QuizAnalysis/>
      },
      {
        path: "flashcards",
        element: <FlashCards />
      },
      {
        path: "user/profile",
        element: <Profile />
      },
      {
        path: "set/:id",
        element: <FlashcardSet />
      },
      {
        path : '/admin/users',
        element: <AllUsers/>
      },
      {
        path: "/admin/documents",
        element : <AllDocuments/>
      }
    ]
  }
]);




function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  return (
    <>
    <ToastContainer/>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
