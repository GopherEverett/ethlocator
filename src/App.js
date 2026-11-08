import { useCallback, useEffect, useRef, useState } from 'react'
import MapContainer from './components/MapContainer'
import SearchBar from './components/SearchBar'
import useUserLocation from './hooks/useUserLocation'
import { fetchStations } from './api/stations'
import './App.css'

// Geographic center of the contiguous US, used until we know better.
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }
const DEFAULT_ZOOM = 4
const DEFAULT_RADIUS = 15

// Rough zoom level that keeps a circle of `radius` miles in view.
const zoomForRadius = (radius) => {
  if (radius <= 5) return 12
  if (radius <= 10) return 11
  if (radius <= 15) return 10
  if (radius <= 30) return 9
  return 8
}

function App() {
  const { coords: userCoords, status: locationStatus, locate } = useUserLocation()
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [radius, setRadius] = useState(DEFAULT_RADIUS)
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  // What the current results are for, so changing the radius can re-run it.
  const lastSearch = useRef(null)

  const runSearch = useCallback(async (search, searchRadius) => {
    lastSearch.current = search
    setLoading(true)
    setMessage('')
    try {
      const result = await fetchStations({ ...search, radius: searchRadius })
      setStations(result.stations)
      if (result.center) setCenter(result.center)
      setZoom(zoomForRadius(searchRadius))
      if (!result.stations.length) {
        setMessage(`No public E85 stations within ${searchRadius} miles.`)
      }
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Default to the user's location as soon as the browser gives it to us.
  useEffect(() => {
    if (locationStatus === 'ready' && userCoords && !lastSearch.current?.query) {
      runSearch({ coords: userCoords }, radius)
    }
    // Only react to location arriving, not to radius changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationStatus, userCoords, runSearch])

  const handleSearch = (query) => {
    if (query) {
      runSearch({ query }, radius)
    } else if (userCoords) {
      runSearch({ coords: userCoords }, radius)
    } else {
      setMessage('Enter a city, address or ZIP code to search.')
    }
  }

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius)
    if (lastSearch.current) runSearch(lastSearch.current, newRadius)
  }

  const handleUseMyLocation = () => {
    lastSearch.current = null
    if (userCoords) {
      runSearch({ coords: userCoords }, radius)
    } else {
      locate()
    }
  }

  const locationNote =
    locationStatus === 'pending' ? 'Finding your location…'
      : locationStatus === 'denied' ? 'Location access is off. Search for an area instead.'
        : locationStatus === 'unsupported' ? 'Your browser can’t share its location. Search for an area instead.'
          : ''

  return (
    <div className="App">
      <div id="buttonDiv">
        <h1>ETHLOCATOR</h1>
        <h2>find E85 near you or anywhere</h2>
        <SearchBar
          radius={radius}
          onRadiusChange={handleRadiusChange}
          onSearch={handleSearch}
          onUseMyLocation={handleUseMyLocation}
          canUseLocation={locationStatus !== 'unsupported'}
          loading={loading}
        />
        {(message || locationNote) && (
          <p className="statusMessage" role="status">{message || locationNote}</p>
        )}
      </div>
      <MapContainer
        center={center}
        zoom={zoom}
        list={stations}
        userLocation={userCoords}
      />
    </div>
  )
}

export default App
