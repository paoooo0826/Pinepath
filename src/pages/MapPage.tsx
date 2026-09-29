import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Filter, MapPinned, Minus, Plus, RotateCcw, Search } from 'lucide-react'
import { useTrips } from '../components/AppShell'
import { categories, destinations } from '../data/destinations'
import type { Destination } from '../types'
import { peso } from '../utils/format'

const BAGUIO: L.LatLngExpression = [16.4164, 120.599]

type MapProps = {
  places: Destination[]
  focus: string | null
  ordered: string[]
  mapRef: React.RefObject<L.Map | null>
  onTileError: () => void
  onTileLoad: () => void
}

function fitPlaces(map: L.Map, places: Destination[], maxZoom = 14) {
  if (!places.length) return map.setView(BAGUIO, 13)
  if (places.length === 1) return map.setView([places[0].latitude, places[0].longitude], 15)
  return map.fitBounds(
    L.latLngBounds(places.map(d => [d.latitude, d.longitude] as [number, number])),
    { padding: [48, 48], maxZoom },
  )
}

function LeafletMap({ places, focus, ordered, mapRef, onTileError, onTileLoad }: MapProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const tileCallbacks = useRef({ onTileError, onTileLoad })
  tileCallbacks.current = { onTileError, onTileLoad }

  useEffect(() => {
    if (!elementRef.current) return

    const map = L.map(elementRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      dragging: true,
      keyboard: true,
      minZoom: 11,
      maxZoom: 18,
    }).setView(BAGUIO, 13)

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
    tiles.on('tileerror', () => tileCallbacks.current.onTileError())
    tiles.on('tileload', () => tileCallbacks.current.onTileLoad())
    tiles.addTo(map)

    mapRef.current = map
    layerRef.current = L.layerGroup().addTo(map)
    const resizeObserver = new ResizeObserver(() => map.invalidateSize())
    resizeObserver.observe(elementRef.current)
    map.invalidateSize()

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [mapRef])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return

    layer.clearLayers()
    let focusedMarker: L.Marker | undefined

    for (const destination of places) {
      const order = ordered.indexOf(destination.id)
      const icon = L.divIcon({
        className: 'pine-marker',
        html: `<span><b>${order >= 0 ? order + 1 : '✦'}</b></span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      })
      const marker = L.marker([destination.latitude, destination.longitude], {
        icon, title: destination.name, alt: destination.name, keyboard: true,
      }).addTo(layer)
      const image = destination.image.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      marker.bindPopup(
        `<div class="map-popup"><img src="${image}" alt=""/><strong>${destination.name}</strong><span>${destination.category} · ${destination.entranceFee ? `${peso(destination.entranceFee)} est.` : 'No base entry estimate'}</span><a href="#/explore/${destination.slug}">View details ↗</a></div>`,
        { maxWidth: 230 },
      )
      if (destination.id === focus) focusedMarker = marker
    }

    if (focusedMarker) {
      map.flyTo(focusedMarker.getLatLng(), 15, { duration: 0.5 })
      focusedMarker.openPopup()
    } else {
      const route = ordered.map(id => places.find(d => d.id === id)).filter((d): d is Destination => !!d)
      if (route.length > 1) {
        L.polyline(route.map(d => [d.latitude, d.longitude] as [number, number]), {
          color: '#bd855a', weight: 3, opacity: 0.85, dashArray: '8 7',
        }).addTo(layer)
        fitPlaces(map, route)
      } else {
        fitPlaces(map, places)
      }
    }
  }, [places, focus, ordered, mapRef])

  return <div ref={elementRef} className="leaflet-map" aria-label="Interactive map of Baguio and nearby destinations. Drag to pan, scroll or pinch to zoom." />
}

export default function MapPage() {
  const [params, setParams] = useSearchParams()
  const { draft } = useTrips()
  const [query, setQuery] = useState('')
  const [tilesUnavailable, setTilesUnavailable] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  const category = params.get('category') || 'All'
  const focus = params.get('focus')
  const showTrip = params.get('trip') === '1' && !!draft
  const ordered = useMemo(
    () => showTrip ? draft!.days.flatMap(day => day.stops.map(stop => stop.id)) : [],
    [showTrip, draft],
  )
  const visible = useMemo(() => destinations.filter(destination =>
    (!showTrip || ordered.includes(destination.id)) &&
    (category === 'All' || destination.category === category || destination.tags.includes(category as typeof destination.tags[number])) &&
    destination.name.toLowerCase().includes(query.trim().toLowerCase()),
  ), [showTrip, ordered, category, query])

  function updateParam(key: string, value: string | null) {
    setParams(current => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }

  function resetView() {
    if (focus) updateParam('focus', null)
    else if (mapRef.current) fitPlaces(mapRef.current, visible)
  }

  return <div className="map-page">
    <div className="map-sidebar">
      <div className="map-sidebar-head">
        <span className="eyebrow">SEE THE AREA</span>
        <h1>The highlands, <em>mapped.</em></h1>
        <p>Choose a place to explore. Drag to pan, scroll or pinch to zoom. Routes show stop order, not turn-by-turn directions.</p>
      </div>
      <label className="search-box">
        <Search size={17}/><span className="sr-only">Search mapped places</span>
        <input placeholder="Find a place" value={query} onChange={event => setQuery(event.target.value)}/>
      </label>
      <label className="map-filter">
        <Filter size={16}/><span className="sr-only">Map category</span>
        <select value={category} onChange={event => updateParam('category', event.target.value === 'All' ? null : event.target.value)}>
          {categories.map(item => <option key={item}>{item}</option>)}
        </select>
      </label>
      {draft && <button className={`route-toggle ${showTrip ? 'selected' : ''}`} onClick={() => updateParam('trip', showTrip ? null : '1')}>
        <MapPinned size={17}/>{showTrip ? 'Showing my trip' : 'Show my trip route'}
      </button>}
      <div className="map-results" aria-label="Mapped destinations">
        {visible.length ? visible.map(destination => <button className={focus === destination.id ? 'active' : ''} key={destination.id} onClick={() => updateParam('focus', destination.id)}>
          <img src={destination.image} alt="" loading="lazy"/>
          <span><strong>{destination.name}</strong><small>{destination.category} · {destination.location}</small></span>
          <ArrowUpRight size={16}/>
        </button>) : <div className="map-empty">No places match. Clear the search or category to see more.</div>}
      </div>
      <p className="map-credit">Map data © OpenStreetMap contributors. Tiles require an internet connection.</p>
    </div>
    <div className="map-canvas">
      <LeafletMap places={visible} focus={focus} ordered={ordered} mapRef={mapRef} onTileError={() => setTilesUnavailable(true)} onTileLoad={() => setTilesUnavailable(false)}/>
      <div className="map-controls" role="group" aria-label="Map zoom controls">
        <button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => mapRef.current?.zoomIn()}><Plus size={20}/></button>
        <button type="button" aria-label="Zoom out" title="Zoom out" onClick={() => mapRef.current?.zoomOut()}><Minus size={20}/></button>
        <button type="button" aria-label="Fit visible places" title="Fit visible places" onClick={resetView}><RotateCcw size={17}/></button>
      </div>
      {tilesUnavailable && <div className="map-tile-warning" role="status">Map tiles are unavailable right now. You can still use the destination list and details.</div>}
      <div className="map-overlay">
        <strong>{visible.length} places on the map</strong>
        <span>{showTrip ? 'Numbered markers follow your current trip.' : 'Tap a marker for details.'}</span>
        {showTrip && <Link to="/planner">Edit itinerary <ArrowUpRight size={14}/></Link>}
      </div>
    </div>
  </div>
}
