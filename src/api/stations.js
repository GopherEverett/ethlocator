import Axios from 'axios'

const STATIONS_URL = 'https://developer.nlr.gov/api/alt-fuel-stations/v1/nearest.json'
// The NREL API no longer accepts free-text locations, so search text is
// turned into coordinates with OpenStreetMap's Nominatim geocoder first.
// Its usage policy allows light, user-triggered use like this (max ~1 req/s).
const GEOCODE_URL = 'https://nominatim.openstreetmap.org/search'
const apiKey = process.env.REACT_APP_NREL_KEY

/** Turn "Minneapolis, MN" / "55401" / an address into { lat, lng }. */
export async function geocode(query) {
    let results
    try {
        const { data } = await Axios.get(GEOCODE_URL, {
            params: {
                q: query,
                format: 'jsonv2',
                limit: 1,
                // The station database only covers the US and Canada.
                countrycodes: 'us,ca',
            },
        })
        results = data
    } catch (err) {
        throw new Error('Location search is unavailable right now. Please try again.')
    }
    if (!results || !results.length) {
        throw new Error(`Couldn't find "${query}". Try a city, address or ZIP code.`)
    }
    return { lat: Number(results[0].lat), lng: Number(results[0].lon) }
}

/**
 * Find public E85 stations within `radius` miles of either a free-text
 * location (`query`) or a { lat, lng } pair (`coords`).
 *
 * Resolves to { stations, center }, where center is the point searched
 * from, so the map can move there.
 */
export async function fetchStations({ query, coords, radius }) {
    const center = query ? await geocode(query) : coords
    if (!center) throw new Error('Enter a location to search.')

    try {
        const { data } = await Axios.get(STATIONS_URL, {
            params: {
                api_key: apiKey,
                latitude: center.lat,
                longitude: center.lng,
                radius,
                fuel_type: 'E85',
                access: 'public',
            },
        })
        return { stations: data.fuel_stations || [], center }
    } catch (err) {
        throw new Error('Something went wrong looking up stations. Please try again.')
    }
}
