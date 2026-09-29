import { CloudRain, CloudSun, Umbrella } from 'lucide-react'
import { useForecast } from './AppShell'

export function WeatherCard({small=false}:{small?:boolean}){
  const {weather,status}=useForecast()
  return <aside className={`weather-card ${small?'small':''}`} aria-label="Baguio weather">
    <div className="weather-top"><div><span className="eyebrow">RIGHT NOW IN BAGUIO</span><h3>{status==='loading'?'Checking the skies…':status==='unavailable'?'Forecast unavailable':weather!.condition}</h3></div>{weather?.rain&&weather.rain>=45?<CloudRain size={30}/>:<CloudSun size={30}/>}</div>
    {weather?<><div className="weather-numbers"><strong>{weather.temperature}°</strong><span>High {weather.high}° / Low {weather.low}°<br/>{weather.rain}% chance of rain today</span></div><p className="weather-tip"><Umbrella size={17}/>{weather.rain>=45?'Rain is possible. Consider indoor stops and carry a light jacket.':'A good day for viewpoints and outdoor walks. Keep a light layer handy.'}</p>{!small&&<div className="forecast-row">{weather.forecast.slice(1,4).map(d=><div key={d.date}><b>{new Date(`${d.date}T12:00:00`).toLocaleDateString('en-PH',{weekday:'short'})}</b><span>{d.high}° / {d.low}°</span><small>{d.rain}% rain</small></div>)}</div>}</>:<p className="weather-fallback">Your planner still works. Check the forecast again later before you travel.</p>}
  </aside>
}
