import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { Detail } from './pages/Detail'
import { Planner } from './pages/Planner'
import { Saved } from './pages/Saved'
import { About } from './pages/About'
import './styles.css'
const MapPage=lazy(()=>import('./pages/MapPage'))
function NotFound(){return <div className="container empty-page"><span className="eyebrow">LOST IN THE PINES?</span><h1>That path isn't on our map.</h1><a className="button button-dark" href="#/explore">Explore places instead</a></div>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><Suspense fallback={<div className="container empty-page">Loading your map…</div>}><Routes><Route element={<AppShell/>}><Route index element={<Home/>}/><Route path="explore" element={<Explore/>}/><Route path="explore/:slug" element={<Detail/>}/><Route path="planner" element={<Planner/>}/><Route path="map" element={<MapPage/>}/><Route path="saved" element={<Saved/>}/><Route path="about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></Suspense></HashRouter></React.StrictMode>)
