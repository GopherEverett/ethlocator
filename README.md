# Ethlocator

This React app was bootstrapped with Create React App and uses the [NREL (National Renewable Energy Laboratory) API](https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/) to find locations of gas stations selling E85 fuel within a chosen radius and displays those as pins on a Google Map utilizing the [Google Map API](https://developers.google.com/maps/documentation).

On load the map centers on the user's location (if they allow location access) and shows nearby stations. Users can also search any city, address or ZIP code in the US or Canada; search text is converted to coordinates with OpenStreetMap's [Nominatim](https://nominatim.org/) geocoder, since the NREL API no longer accepts free-text locations.

To run locally you will need keys for both APIs in an `.env` file as:
`REACT_APP_MAP_KEY` and `REACT_APP_NREL_KEY`