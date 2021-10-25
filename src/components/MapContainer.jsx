import React, { useState } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react-17'

const mapApiKey = process.env.REACT_APP_MAP_KEY

const mapStyles = {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '97%',
    height: '90%'
}

function MapContainer(props) {
    const [showInfoWindow, setShowInfoWindow] = useState(false)
    const [activeMarker, setActiveMarker] = useState({})
    const [selectedPlace, setSelectedPlace] = useState({})

    const onMarkerClick = (props, marker, e) => {
        setSelectedPlace(props)
        setActiveMarker(marker)
        setShowInfoWindow(true)
    }

    const onMapClick = (props) => {
        if (showInfoWindow) {
            setShowInfoWindow(false)
            setActiveMarker(null)
        }
    }

    return (
        <div>
            {props.lat && props.lng ?
                <Map
                    google={props.google}
                    onClick={onMapClick}
                    zoom={14}
                    style={mapStyles}
                    initialCenter={{
                        lat: props.lat,
                        lng: props.lng
                    }}
                >
                    {props.list.map((station, idx) => (
                        <Marker
                        onClick={onMarkerClick}
                        key={idx}
                        position={{lat: station.latitude, lng: station.longitude}}
                        name={station.station_name}
                        address={station.street_address}
                        />
                    ))}
                    <InfoWindow
                    marker={activeMarker}
                    visible={showInfoWindow}
                    >
                        <h1>{selectedPlace.name}</h1>
                        <h3>{selectedPlace.address}</h3>
                    </InfoWindow>
                </Map>: null
            }
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: mapApiKey
})(MapContainer)
