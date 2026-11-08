import React, { useState } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react-17'

const mapApiKey = process.env.REACT_APP_MAP_KEY

const mapStyles = {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '97%',
    height: '90%'
}

function MapContainer({ google, center, zoom, list, userLocation }) {
    const [showInfoWindow, setShowInfoWindow] = useState(false)
    const [activeMarker, setActiveMarker] = useState(null)
    const [selectedPlace, setSelectedPlace] = useState({})

    const onMarkerClick = (markerProps, marker) => {
        setSelectedPlace(markerProps)
        setActiveMarker(marker)
        setShowInfoWindow(true)
    }

    const onMapClick = () => {
        if (showInfoWindow) {
            setShowInfoWindow(false)
            setActiveMarker(null)
        }
    }

    return (
        <div className='mapContainer'>
            <Map
                google={google}
                onClick={onMapClick}
                zoom={zoom}
                style={mapStyles}
                initialCenter={center}
                center={center}
            >
                {userLocation && (
                    <Marker
                        position={userLocation}
                        title="You are here"
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#4285F4',
                            fillOpacity: 1,
                            strokeColor: 'white',
                            strokeWeight: 2,
                        }}
                    />
                )}
                {list.map((station) => (
                    <Marker
                        onClick={onMarkerClick}
                        key={station.id}
                        position={{ lat: station.latitude, lng: station.longitude }}
                        name={station.station_name}
                        address={`${station.street_address}, ${station.city}, ${station.state}`}
                        hours={station.access_days_time}
                    />
                ))}
                <InfoWindow
                    marker={activeMarker}
                    visible={showInfoWindow}
                >
                    <div>
                        <h2>{selectedPlace.name}</h2>
                        <h3>{selectedPlace.address}</h3>
                        {selectedPlace.hours && <h3>{`open ${selectedPlace.hours}`}</h3>}
                    </div>
                </InfoWindow>
            </Map>
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: mapApiKey
})(MapContainer)
