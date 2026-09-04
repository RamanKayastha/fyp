import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NEPAL_MAP_CENTER, nepalCityCenters } from '../data/nepalCityCenters'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const toPin = (latitude, longitude) => {
  if (latitude == null || longitude == null || latitude === '' || longitude === '') return null
  const lat = Number(latitude)
  const lng = Number(longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return [lat, lng]
}

const englishPlaceName = (data) => {
  const parts = [
    data.locality,
    data.city,
    data.principalSubdivision,
    data.countryName,
  ].filter((part, index, list) => part && list.indexOf(part) === index)
  return parts.join(', ')
}

const ClickToMark = ({ selectable, onChange }) => {
  useMapEvents({
    click(event) {
      if (!selectable || !onChange) return
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      })
    },
  })
  return null
}

const FitView = ({ city, latitude, longitude }) => {
  const map = useMap()
  const pin = toPin(latitude, longitude)

  useEffect(() => {
    if (pin) {
      map.setView(pin, 16)
      return
    }
    const cityCenter = nepalCityCenters[city]
    if (cityCenter) {
      map.setView(cityCenter, 13)
    }
  }, [city, latitude, longitude, map])

  return null
}

const DeliveryMap = ({
  city,
  latitude,
  longitude,
  selectable = false,
  onChange,
  className = '',
}) => {
  const pin = toPin(latitude, longitude)
  const start = pin || nepalCityCenters[city] || NEPAL_MAP_CENTER
  const [placeName, setPlaceName] = useState('')

  useEffect(() => {
    const current = toPin(latitude, longitude)
    if (!current) {
      setPlaceName('')
      return undefined
    }

    const [lat, lng] = current
    let cancelled = false

    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setPlaceName(englishPlaceName(data))
      })
      .catch(() => {
        if (!cancelled) setPlaceName('')
      })

    return () => {
      cancelled = true
    }
  }, [latitude, longitude])

  if (!selectable && !pin) {
    return <p className={`text-sm text-gray-500 ${className}`}>No delivery pin was saved for this order.</p>
  }

  const openUrl = pin
    ? `https://www.google.com/maps?hl=en&q=${pin[0]},${pin[1]}`
    : null

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange?.({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div className={className}>
      {selectable && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-600">
            {pin ? 'Delivery pin marked. Tap the map to move it.' : 'Tap the map to mark your delivery location.'}
          </p>
          <button type="button" onClick={useMyLocation} className="text-sm text-black underline">
            Use my location
          </button>
        </div>
      )}
      <MapContainer
        center={start}
        zoom={pin ? 16 : 13}
        className="h-64 w-full rounded-md border"
        scrollWheelZoom
      >
        <TileLayer
          attribution="Tiles &copy; Esri &copy; OpenStreetMap"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />
        <FitView city={city} latitude={latitude} longitude={longitude} />
        <ClickToMark selectable={selectable} onChange={onChange} />
        {pin && (
          <Marker position={pin}>
            {placeName ? <Popup>{placeName}</Popup> : null}
          </Marker>
        )}
      </MapContainer>
      {placeName && <p className="mt-2 text-sm text-gray-600">{placeName}</p>}
      {openUrl && (
        <a
          href={openUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-black underline"
        >
          Open in Google Maps
        </a>
      )}
    </div>
  )
}

export default DeliveryMap
