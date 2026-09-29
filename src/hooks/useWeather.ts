import { useEffect, useState } from 'react'
import type { Weather } from '../types'

const label=(code:number)=>code===0?'Clear skies':code<=3?'Partly cloudy':code<=48?'Foggy':code<=57?'Drizzle':code<=67?'Rainy':code<=82?'Rain showers':'Thunderstorms'
export function useWeather(){
  const [weather,setWeather]=useState<Weather|null>(null),[status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading')
  useEffect(()=>{const controller=new AbortController();(async()=>{try{
    const url='https://api.open-meteo.com/v1/forecast?latitude=16.4164&longitude=120.5931&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=Asia%2FManila&forecast_days=5'
    const res=await fetch(url,{signal:controller.signal});if(!res.ok)throw Error('Weather unavailable')
    const x=await res.json();if(!x.current||!x.daily?.time)throw Error('Invalid weather')
    setWeather({temperature:Math.round(x.current.temperature_2m),condition:label(x.current.weather_code),rain:x.daily.precipitation_probability_max[0]??0,high:Math.round(x.daily.temperature_2m_max[0]),low:Math.round(x.daily.temperature_2m_min[0]),forecast:x.daily.time.map((date:string,i:number)=>({date,high:Math.round(x.daily.temperature_2m_max[i]),low:Math.round(x.daily.temperature_2m_min[i]),rain:x.daily.precipitation_probability_max[i]??0,condition:label(x.daily.weather_code[i])}))});setStatus('ready')
  }catch(e){if((e as Error).name!=='AbortError')setStatus('unavailable')}})();return()=>controller.abort()},[])
  return {weather,status}
}
