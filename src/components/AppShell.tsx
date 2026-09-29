import { createContext, useContext, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, CloudSun, Heart, MapPinned, Menu, Mountain, X } from 'lucide-react'
import { useLocalTrips } from '../hooks/useLocalTrips'
import { useWeather } from '../hooks/useWeather'

type Store=ReturnType<typeof useLocalTrips>
export const TripContext=createContext<Store|null>(null)
export const WeatherContext=createContext<ReturnType<typeof useWeather>|null>(null)
export function useTrips(){const x=useContext(TripContext);if(!x)throw Error('Trip store missing');return x}
export function useForecast(){const x=useContext(WeatherContext);if(!x)throw Error('Weather missing');return x}
const links=[['/','Home'],['/explore','Explore'],['/planner','Trip Planner'],['/map','Map'],['/saved','Saved Trips'],['/about','About']]

export function AppShell(){
  const store=useLocalTrips(),forecast=useWeather(),[open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false),location=useLocation()
  useEffect(()=>{setOpen(false);window.scrollTo({top:0,behavior:'instant'})},[location.pathname])
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>18);fn();window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[])
  return <TripContext.Provider value={store}><WeatherContext.Provider value={forecast}>
    <div className="app-shell">
      <header className={`site-header ${scrolled?'is-scrolled':''}`}>
        <nav className="container nav-inner" aria-label="Main navigation">
          <Link to="/" className="brand" aria-label="Pinepath home"><span className="brand-icon"><Mountain size={21} strokeWidth={2.4}/></span><span>Pinepath<small>BAGUIO TRAVEL PLANNER</small></span></Link>
          <div className={`nav-links ${open?'open':''}`} id="mobile-nav">{links.map(([to,label])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</div>
          <div className="nav-actions"><span className="nav-weather"><CloudSun size={17}/>{forecast.weather?`${forecast.weather.temperature}° Baguio`:'Baguio City'}</span><Link className="button button-dark nav-plan" to="/planner">Plan a trip <ArrowUpRight size={16}/></Link><button type="button" className="icon-button menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
        </nav>
      </header>
      <main id="main"><Outlet/></main>
      <footer className="footer"><div className="container footer-inner"><div><Link className="brand footer-brand" to="/"><span className="brand-icon"><Mountain size={21}/></span><span>Pinepath<small>THE HIGHLANDS ARE YOURS TO EXPLORE</small></span></Link><p>Thoughtful trips through Baguio and nearby Benguet.</p></div><div className="footer-links"><Link to="/explore"><MapPinned size={17}/> Discover places</Link><Link to="/saved"><Heart size={17}/> Your saved trips</Link><Link to="/about">About Pinepath</Link></div><div className="footer-note">Built for curious travelers around Baguio.<br/>Costs, hours and travel times are planning estimates.<br/>Please confirm details with venues before you go.</div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Pinepath</span><span>Made for the mountain days ahead.</span></div></footer>
    </div>
  </WeatherContext.Provider></TripContext.Provider>
}
