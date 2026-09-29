import { Link } from 'react-router-dom'
import { ArrowUpRight, Compass, Heart, MapPinned, Wallet } from 'lucide-react'

const reasons = [
  { icon: <Compass/>, title: 'Travel at your pace', text: 'Pick a relaxed, balanced or packed day. Pinepath leaves space to get from one stop to the next.' },
  { icon: <MapPinned/>, title: 'See the area together', text: 'Find places on an interactive map and see the order of stops in your itinerary.' },
  { icon: <Wallet/>, title: 'Plan around your budget', text: 'Compare an estimated day cost with your budget before you head out.' },
  { icon: <Heart/>, title: 'Keep the good ideas', text: 'Save places and trips in your browser, then edit, share or print them when you are ready.' },
]

export function About() {
  return <>
    <section className="about-hero">
      <div className="container">
        <span className="eyebrow">ABOUT PINEPATH</span>
        <h1>Make room for<br/><em>your trip.</em></h1>
        <p>Pinepath is a simple trip planner for Baguio and nearby Benguet. Tell us what you love, how long you have and what you want to spend. We'll help shape a day among the pines, viewpoints, food stops and local landmarks.</p>
        <Link className="button button-light" to="/planner">Plan a trip <ArrowUpRight size={17}/></Link>
      </div>
    </section>
    <section className="container about-body">
      <div><span className="eyebrow">THE IDEA</span><h2>Less tab switching.<br/><em>More exploring.</em></h2></div>
      <div>
        <p>Baguio and its neighboring towns have many ways to spend a day. You might want a slow morning at Burnham Park, a walk through the gardens, or an afternoon looking out over the mountains. Putting those stops in a sensible order can take more time than it should.</p>
        <p>Pinepath gathers destination ideas, approximate travel time, weather and a budget estimate in one place. You can change any stop and make the itinerary your own. There is no account to create and no paid planning service.</p>
        <p>This is an independent portfolio project built to make planning a trip around Baguio easier to try. Your saved trips stay on this device unless you choose to share a trip link.</p>
      </div>
    </section>
    <section className="section-muted"><div className="container about-values">
      {reasons.map(reason => <div key={reason.title}><span>{reason.icon}</span><h3>{reason.title}</h3><p>{reason.text}</p></div>)}
    </div></section>
    <section className="container about-disclaimer">
      <h2>Before you go</h2>
      <p>Pinepath is a planning guide, not a booking service. Admission fees, opening hours, accessibility, traffic and weather can change. The routes and costs are estimates, so confirm important details with venues and official local sources before visiting.</p>
      <div className="about-links">
        <a href="https://visita.baguio.gov.ph/" target="_blank" rel="noreferrer">Official Baguio tourism portal <ArrowUpRight size={16}/></a>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather by Open-Meteo <ArrowUpRight size={16}/></a>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Map by OpenStreetMap contributors <ArrowUpRight size={16}/></a>
      </div>
    </section>
  </>
}
