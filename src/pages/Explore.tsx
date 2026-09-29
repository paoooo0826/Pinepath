import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { DestinationCard } from '../components/DestinationCard'
import { categories, destinations } from '../data/destinations'
import { distanceKm } from '../utils/format'

export function Explore(){
  const [params,setParams]=useSearchParams(),[query,setQuery]=useState(''),[sort,setSort]=useState('Recommended')
  const category=params.get('category')||'All'
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();return destinations.filter(d=>(category==='All'||d.category===category||d.tags.includes(category as typeof d.tags[number]))&&(!q||`${d.name} ${d.location} ${d.description} ${d.tags.join(' ')}`.toLowerCase().includes(q))).sort((a,b)=>sort==='Budget-friendly'?a.entranceFee-b.entranceFee||b.popularity-a.popularity:sort==='Most popular'?b.popularity-a.popularity:sort==='Short visit'?a.duration-b.duration:sort==='Near city center'?distanceKm({latitude:16.4133,longitude:120.5978},a)-distanceKm({latitude:16.4133,longitude:120.5978},b):b.popularity-a.popularity)
  },[category,query,sort])
  return <div className="container page-container"><div className="page-heading"><span className="eyebrow">BAGUIO AND NEARBY</span><h1>Explore <em>the highlands.</em></h1><p>Find places in Baguio, La Trinidad and nearby Benguet, from familiar landmarks to quieter corners.</p></div><div className="explore-controls"><label className="search-box"><Search size={19}/><span className="sr-only">Search destinations</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search places, areas or interests"/>{query&&<button aria-label="Clear search" onClick={()=>setQuery('')}><X size={17}/></button>}</label><label className="sort-box"><SlidersHorizontal size={17}/><span className="sr-only">Sort destinations</span><select value={sort} onChange={e=>setSort(e.target.value)}>{['Recommended','Budget-friendly','Most popular','Short visit','Near city center'].map(s=><option key={s}>{s}</option>)}</select></label></div><div className="filter-row" role="group" aria-label="Destination categories">{categories.map(c=><button key={c} className={`chip ${category===c?'selected':''}`} aria-pressed={category===c} onClick={()=>setParams(c==='All'?{}:{category:c})}>{c}</button>)}</div><div className="result-count">{filtered.length} {filtered.length===1?'place':'places'} to discover <span>Fees are planning estimates. Check with venues before visiting.</span></div>{filtered.length?<div className="destination-grid explore-grid">{filtered.map(d=><DestinationCard key={d.id} destination={d}/>)}</div>:<div className="empty-state"><Search size={30}/><h2>No places on this path yet.</h2><p>Try a different search or category.</p><button className="button button-dark" onClick={()=>{setQuery('');setParams({})}}>Show all places</button></div>}</div>
}
