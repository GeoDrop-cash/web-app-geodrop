import React from 'react'
import { Plugins } from '@capacitor/core'
import { Row, Col, Content, Box, Button, Inputs } from 'adminlte-2-react'
import { Helmet } from 'react-helmet'
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  MapConsumer
} from 'react-leaflet'
import L from 'leaflet'
import DraggableMarker from '../map-component/draggableMarker'
import icon from "../constants";

const { Geolocation } = Plugins

const { Text, Select } = Inputs
let _this
class CashDropMap extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      latitude: '',
      longitude: ''
    }
  }

  render () {
    const { latitude, longitude } = _this.state
    return (
      <Row>
        <Col xs={12}>
          {
            latitude && longitude && (
              <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                style={{ height: '50vh' }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* this.state.latitude != '' && this.state.longitude != ''
                  ? <DraggableMarker lat={latitude} lng={longitude} />
                  : <></>
                */}
                <MapConsumer>
                  {(map) => {
                    map.on("click", (e) => {
                      const { lat, lng } = e.latlng
                      console.log("lat:", lat, "lon:", lng)
                      L.marker([lat, lng], {
                      	 icon: icon,
                      	 draggable: true
                      }).addTo(map)
                    })
                    return null
                  }}
                </MapConsumer>
              </MapContainer>
            )
          }
        </Col>
      </Row>

    )
  }

  async componentDidMount () {
    await _this.getCurrentPosition()
  }

  // Gets current GPS location of the user device
  async getCurrentPosition () {
    try {
      console.log('Getting Current Position')
      const coordinates = await Geolocation.getCurrentPosition()
      console.log('Current', coordinates)

      const { latitude, longitude } = coordinates.coords

      _this.setState({
        latitude,
        longitude,
        inFetch: false
      })
      return coordinates.coords
    } catch (error) {
      console.error(error)
    }
  }
}

export default CashDropMap
