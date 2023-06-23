# Ethocator

This React app was bootstrapped with Create React App and uses the [NREL (National Renewable Energy Laboratory) API](https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/) to find locations of gas stations selling E85 fuel within a chosen radius fom users location and displays those as pins on a Google Map utilizing the [Google Map API](https://developers.google.com/maps/documentation).

To run locally you will need keys for both APIs in an `.env` file as:
`REACT_APP_MAP_KEY` and `REACT_APP_NREL_KEY`