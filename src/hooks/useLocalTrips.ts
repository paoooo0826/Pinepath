import { useState } from 'react'
import type { Trip } from '../types'
import { validateTrip } from '../utils/planner'

const KEY='pinepath-v2-trips',FAV='pinepath-v2-favorites',DRAFT='pinepath-v2-draft'
function read<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
export function useLocalTrips(){
  const [trips,setTrips]=useState<Trip[]>(()=>{const v=read<unknown>(KEY,[]);return Array.isArray(v)?v.map(validateTrip).filter((t):t is Trip=>!!t):[]})
  const [favorites,setFavorites]=useState<string[]>(()=>{const v=read<unknown>(FAV,[]);return Array.isArray(v)?v.filter((x):x is string=>typeof x==='string'):[]})
  const [draft,setDraft]=useState<Trip|null>(()=>validateTrip(read<unknown>(DRAFT,null)))
  const save=(trip:Trip)=>{const next=[trip,...trips.filter(t=>t.id!==trip.id)];setTrips(next);localStorage.setItem(KEY,JSON.stringify(next));return trip}
  const remove=(id:string)=>{const next=trips.filter(t=>t.id!==id);setTrips(next);localStorage.setItem(KEY,JSON.stringify(next))}
  const setCurrent=(trip:Trip|null)=>{setDraft(trip);if(trip)localStorage.setItem(DRAFT,JSON.stringify(trip));else localStorage.removeItem(DRAFT)}
  const toggleFavorite=(id:string)=>{const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];setFavorites(next);localStorage.setItem(FAV,JSON.stringify(next))}
  return {trips,favorites,draft,save,remove,setCurrent,toggleFavorite}
}
