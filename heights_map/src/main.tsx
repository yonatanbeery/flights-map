import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { SimpleMap } from './map.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimpleMap />
  </React.StrictMode>,
)
