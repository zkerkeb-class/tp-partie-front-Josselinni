import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // C'est ici qu'on importe le Router
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* On enveloppe l'App avec BrowserRouter pour activer le routage */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)