import { useCallback, useEffect, useState } from 'react'

/**
 * Wraps navigator.geolocation.
 * status: 'pending' | 'ready' | 'denied' | 'unsupported'
 */
export default function useUserLocation() {
    const [coords, setCoords] = useState(null)
    const [status, setStatus] = useState('pending')

    const locate = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus('unsupported')
            return
        }
        setStatus('pending')
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
                setStatus('ready')
            },
            () => setStatus('denied'),
            { timeout: 10000 }
        )
    }, [])

    useEffect(() => {
        locate()
    }, [locate])

    return { coords, status, locate }
}
