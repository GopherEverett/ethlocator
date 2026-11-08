import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

export const RADIUS_OPTIONS = [5, 10, 15, 30, 45, 60]

function SearchBar({ radius, onRadiusChange, onSearch, onUseMyLocation, canUseLocation, loading }) {
    const [query, setQuery] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(query.trim())
    }

    return (
        <Form className="searchBar" onSubmit={handleSubmit}>
            <InputGroup>
                <Form.Control
                    type="search"
                    placeholder="City, address or ZIP"
                    aria-label="Search location"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Form.Select
                    className="radiusSelect"
                    aria-label="Search radius"
                    value={radius}
                    onChange={(e) => onRadiusChange(Number(e.target.value))}
                >
                    {RADIUS_OPTIONS.map((miles) => (
                        <option key={miles} value={miles}>{miles} miles</option>
                    ))}
                </Form.Select>
                <Button type="submit" variant="success" disabled={loading}>
                    {loading ? 'Searching…' : 'Search'}
                </Button>
            </InputGroup>
            <Button
                variant="link"
                className="useLocation"
                onClick={() => {
                    setQuery('')
                    onUseMyLocation()
                }}
                disabled={!canUseLocation || loading}
            >
                Use my location
            </Button>
        </Form>
    )
}

export default SearchBar
