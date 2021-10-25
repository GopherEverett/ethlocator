import { useState } from 'react'
import { useMount } from 'react-use'
import MapContainer from './components/MapContainer';
import Dropdown from 'react-bootstrap/Dropdown';
import Axios from 'axios'

const api_key = process.env.REACT_APP_NREL_KEY

function App() {
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [list, setList] = useState([])
  useMount(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude)
      setLng(position.coords.longitude)
      Axios.get('https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json', {
        params: {
          api_key: api_key,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          radius: 60.0,
          fuel_type: 'E85',
          access: 'public'
        }
      }).then((res) => {
        setList(res.data['fuel_stations'])
      })
    })

  })

  return (
    <div className="App">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          RADIUS
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">15 miles</Dropdown.Item>
          <Dropdown.Item href="#/action-2">30 miles</Dropdown.Item>
          <Dropdown.Item href="#/action-3">45 miles</Dropdown.Item>
          <Dropdown.Item href="#/action-3">60 miles</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <MapContainer lat={lat} lng={lng} list={list} />
    </div>
  );
}

export default App;