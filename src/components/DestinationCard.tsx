import { ArrowUpRight, Clock3, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Destination } from '../types'
import { peso } from '../utils/format'
import { useTrips } from './AppShell'

export function DestinationCard({destination:d,compact=false}:{destination:Destination;compact?:boolean}){
  const {favorites,toggleFavorite}=useTrips(),saved=favorites.includes(d.id)
  return <article className={`destination-card ${compact?'compact':''}`}>
    <div className="card-image"><img src={d.image} alt={d.photoIllustrative?'Illustrative Baguio area scenery':d.name} loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/><span className="card-category">{d.category}</span><a className="card-photo-credit" href={d.image.replace("/wiki/Special:FilePath/","/wiki/File:").split("?")[0]} target="_blank" rel="noreferrer" title={`${d.photoIllustrative?'Illustrative area photo':'Photo'}: ${d.imageCredit}`}>{d.photoIllustrative?'Area photo':'Photo credit'} ↗</a><button type="button" className={`heart-button ${saved?'saved':''}`} aria-label={`${saved?'Remove':'Save'} ${d.name}`} aria-pressed={saved} onClick={()=>toggleFavorite(d.id)}><Heart size={19} fill={saved?'currentColor':'none'}/></button></div>
    <div className="card-body"><div className="card-title-row"><h3><Link to={`/explore/${d.slug}`}>{d.name}</Link></h3><ArrowUpRight size={18}/></div><p>{d.shortDescription}</p><div className="card-meta"><span><MapPin size={14}/>{d.location}</span><span><Clock3 size={14}/>{Math.round(d.duration/60*10)/10} hr</span></div><div className="card-bottom"><span>{d.entranceFee?`From ${peso(d.entranceFee)} est.`:'No base entry estimate'}</span><Link to={`/explore/${d.slug}`}>View place <ArrowUpRight size={15}/></Link></div></div>
  </article>
}
