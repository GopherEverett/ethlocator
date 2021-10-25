import { useState } from 'react'
import { useMount } from 'react-use'
import MapContainer from './components/MapContainer';
import DropdownButton from 'react-bootstrap/DropdownButton';
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
    })
  })
  const fetchList = (e) => {
    Axios.get('https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json', {
      params: {
        api_key: api_key,
        latitude: lat,
        longitude: lng,
        radius: e,
        fuel_type: 'E85',
        access: 'public'
      }
    }).then((res) => {
      setList(res.data['fuel_stations'])
    })
  }


  return (
    <div className="App">

      <DropdownButton
        align="end"
        title="RADIUS"
        id="dropdown-menu-align-right"
        onSelect={fetchList}
      >
        <Dropdown.Item eventKey="15">15 miles</Dropdown.Item>
        <Dropdown.Item eventKey="30">30 miles</Dropdown.Item>
        <Dropdown.Item eventKey="45">45 miles</Dropdown.Item>
        <Dropdown.Item eventKey="60">60 miles</Dropdown.Item>
      </DropdownButton>
      <MapContainer lat={lat} lng={lng} list={list} />
    </div >
  );
}

export default App;