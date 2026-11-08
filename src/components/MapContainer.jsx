import React, { useEffect, useState } from 'react'
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps'

const mapApiKey = process.env.REACT_APP_MAP_KEY

const mapStyle = {
    width: '97%',
    height: '75vh',
    minHeight: '400px',
    margin: '0 auto',
}

// google.maps.SymbolPath.CIRCLE. Used as a literal so the icon can be
// described before the Maps script has loaded.
const CIRCLE = 0

const userIcon = {
    path: CIRCLE,
    scale: 8,
    fillColor: '#4285F4',
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 2,
}

/**
 * The map is uncontrolled so people can pan and zoom freely; this moves it
 * whenever a new search sets a different center or zoom.
 */
function CameraSync({ center, zoom }) {
    const map = useMap()
    useEffect(() => {
        if (map && center) map.panTo(center)
    }, [map, center])
    useEffect(() => {
        if (map && zoom) map.setZoom(zoom)
    }, [map, zoom])
    return null
}

function MapContainer({ center, zoom, list, userLocation }) {
    const [selected, setSelected] = useState(null)

    // Close the info window when a new set of results arrives.
    useEffect(() => setSelected(null), [list])

    return (
        <div className='mapContainer'>
            <APIProvider apiKey={mapApiKey}>
                <Map
                    style={mapStyle}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    gestureHandling='greedy'
                    onClick={() => setSelected(null)}
                >
                    <CameraSync center={center} zoom={zoom} />
                    {userLocation && (
                        <Marker position={userLocation} title='You are here' icon={userIcon} />
                    )}
                    {list.map((station) => (
                        <Marker
                            key={station.id}
                            position={{ lat: station.latitude, lng: station.longitude }}
                            title={station.station_name}
                            onClick={() => setSelected(station)}
                        />
                    ))}
                    {selected && (
                        <InfoWindow
                            position={{ lat: selected.latitude, lng: selected.longitude }}
                            pixelOffset={[0, -35]}
                            onCloseClick={() => setSelected(null)}
                        >
                            <div>
                                <h2>{selected.station_name}</h2>
                                <h3>{`${selected.street_address}, ${selected.city}, ${selected.state}`}</h3>
                                {selected.access_days_time && (
                                    <h3>{`open ${selected.access_days_time}`}</h3>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </div>
    )
}

export default MapContainer
