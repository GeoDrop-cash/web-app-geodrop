/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Plugins } from '@capacitor/core'
import { Row, Col, Content, Box, Button } from 'adminlte-2-react'
import { Helmet } from 'react-helmet'
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  MapConsumer
} from 'react-leaflet'
import L from 'leaflet'
import icon from '../constants'
import DraggableMarker from '../map-component/draggableMarker'

const { Geolocation } = Plugins

export default function View1 () {
  const initialState = {
    lng: -0.09,
    lat: 51.505,
    zoom: 4
  }
  const [coords, setCoords] = useState([{}])
  useEffect(async () => {
    const coordinates = await Geolocation.getCurrentPosition()
    console.log('Coordinates', coordinates.coords.latitude)
    const lat = coordinates.coords.latitude
    const lng = coordinates.coords.longitude
    setCoords({ lat: lat, lng: lng })
  }, [])

  const MyComponent = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng
        console.log('lat:', lat, 'lon:', lng)
        L.marker([lat, lng], {
          id: 1,
          icon: icon,
          draggable: true
        }).addTo(map)
      }
    })
    return null
  }

  return (
    <Row>
      <Col xs={12}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '100vh' }}
          // whenReady={(map) => {
          //   console.log(map);
          //   map.target.on("click", function (e) {
          //     const { lat, lng } = e.latlng;
          //     L.marker([lat, lng], { icon }).addTo(map.target);
          //   });
          // }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MyComponent />
          <DraggableMarker/>
          {/* <MapConsumer>
            {(map) => {
              map.locate({
                watch: true,
                setView: true,
              })
              map.on("click", function (e) {
                const { lat, lng } = e.latlng;
                L.marker([lat, lng], { icon }).addTo(map);
              });
              return null;
            }}
          </MapConsumer> */}
        </MapContainer>
      </Col>
    </Row>
  )
}
