import { ArrowLeft, ArrowUpRight, Clock3, Heart, MapPin, Navigation2, Plus, Sun, Ticket } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTrips } from '../components/AppShell'
import { DestinationCard } from '../components/DestinationCard'
import { destinations } from '../data/destinations'
import { distanceKm, peso } from '../utils/format'
import { updateDay } from '../utils/planner'

export function Detail() {
  const { slug } = useParams()
  const d = destinations.find(place => place.slug === slug)
  const { favorites, toggleFavorite, draft, setCurrent } = useTrips()
  const navigate = useNavigate()

  if (!d) return <div className="container empty-page"><span className="eyebrow">PLACE NOT FOUND</span><h1>We couldn't find that stop.</h1><Link className="button button-dark" to="/explore">All places</Link></div>

  const nearby = destinations.filter(place => place.id !== d.id).sort((a, b) => distanceKm(a, d) - distanceKm(b, d)).slice(0, 3)
  const area = d.location.includes('La Trinidad') ? 'LA TRINIDAD' : d.location.includes('Tuba') ? 'TUBA' : 'BAGUIO CITY'
  const photoLink = d.image.replace('/wiki/Special:FilePath/', '/wiki/File:').split('?')[0]
  const add = () => {
    if (draft) {
      const dayIndex = draft.days.findIndex(day => !day.stops.some(stop => stop.id === d.id) && day.stops.length < 5)
      if (dayIndex >= 0) {
        const next = updateDay(draft, dayIndex, [...draft.days[dayIndex].stops.map(stop => stop.id), d.id])
        if (next.days[dayIndex].stops.some(stop => stop.id === d.id)) {
          setCurrent(next)
          navigate('/planner')
          return
        }
      }
    }
    navigate('/planner', { state: { addId: d.id } })
  }

  return <>
    <Link to="/explore" className="back-link"><ArrowLeft size={17} aria-hidden="true"/> All places</Link>
    <div className="detail-hero">
      <img src={d.image} alt={d.photoIllustrative ? 'Baguio area scenery, illustrative photo' : d.name} onError={event => { event.currentTarget.style.display = 'none' }}/>
      <div className="detail-shade"/>
      <div className="container detail-hero-content">
        <span className="eyebrow">{d.category.toUpperCase()} · {area}</span>
        <h1>{d.name}</h1>
        <p><MapPin size={17}/>{d.location}</p>
        <a className="detail-credit" href={photoLink} target="_blank" rel="noreferrer">{d.photoIllustrative ? 'Illustrative area photo' : 'Photo'}: {d.imageCredit} ↗</a>
      </div>
    </div>
    <div className="container detail-layout">
      <article>
        <div className="detail-intro">
          <span className="eyebrow">A CLOSER LOOK</span>
          <h2>{d.shortDescription}</h2>
          <p>{d.description}</p>
          <div className="detail-actions">
            <button className="button button-dark" onClick={add}><Plus size={17}/> Add to trip</button>
            <button className="button button-outline" onClick={() => toggleFavorite(d.id)}><Heart size={17} fill={favorites.includes(d.id) ? 'currentColor' : 'none'}/>{favorites.includes(d.id) ? 'Saved' : 'Save destination'}</button>
          </div>
        </div>
        <div className="detail-section">
          <h3>Plan your visit</h3>
          <div className="detail-facts">
            <div><Clock3/><span>Time to allow</span><strong>{Math.round(d.duration / 60 * 10) / 10} hours</strong></div>
            <div><Ticket/><span>Entry budget</span><strong>{d.entranceFee ? peso(d.entranceFee) + ' per person' : 'No base entry estimate'}</strong></div>
            <div><Sun/><span>Best time</span><strong>{d.bestTime}</strong></div>
            <div><Navigation2/><span>Plan between</span><strong>{d.openingTime}:00–{d.closingTime}:00*</strong></div>
          </div>
          <small className="estimate-note">*This is a suggested time range, not the venue's opening hours. Check current hours and prices before you go.</small>
        </div>
        <div className="detail-section good-to-know">
          <h3>Good to know</h3>
          <ul className="tips-list">{d.tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
          <div className="access-note">
            <span className="access-note-icon"><Navigation2 size={19} aria-hidden="true"/></span>
            <div><h4>Getting around</h4><p>{d.accessibility}</p><small>Need step-free access? Check with the venue before your visit.</small></div>
          </div>
        </div>
      </article>
      <aside className="detail-side">
        <div className="detail-location">
          <span className="eyebrow">FIND YOUR WAY</span><h3>{d.location}</h3>
          <div className="map-preview"><img src={`https://staticmap.openstreetmap.de/staticmap.php?center=${d.latitude},${d.longitude}&zoom=14&size=500x300&markers=${d.latitude},${d.longitude},red-pushpin`} alt={`Map around ${d.name}`} loading="lazy" onError={event => { event.currentTarget.style.display = 'none' }}/><MapPin size={26}/></div>
          <Link className="text-link" to={`/map?focus=${d.id}`}>Open interactive map <ArrowUpRight size={17}/></Link>
          <a className="subtle-link" href={`https://www.openstreetmap.org/?mlat=${d.latitude}&mlon=${d.longitude}#map=16/${d.latitude}/${d.longitude}`} target="_blank" rel="noreferrer">View on OpenStreetMap <ArrowUpRight size={14}/></a>
          <small className="map-pin-note">Map pins are approximate. Check the entrance or meeting point before setting off.</small>
        </div>
      </aside>
    </div>
    <section className="section-muted detail-nearby"><div className="container"><div className="section-header"><div><span className="eyebrow">KEEP WANDERING</span><h2>Close by, <em>worth a stop.</em></h2></div></div><div className="destination-grid">{nearby.map(place => <DestinationCard key={place.id} destination={place} compact/>)}</div></div></section>
  </>
}
