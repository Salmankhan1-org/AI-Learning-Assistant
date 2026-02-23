import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { pdfjs } from "react-pdf";
import ErrorBoundary from './pages/ErrorBoundary.jsx'


createRoot(document.getElementById('root')).render(

  <ErrorBoundary>
     <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
 ,
)
