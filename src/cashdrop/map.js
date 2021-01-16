import React from 'react'
import PropTypes from 'prop-types'
import { Plugins } from '@capacitor/core'
import { Row, Col, Box } from 'adminlte-2-react'
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  MapConsumer
} from 'react-leaflet'
import L from 'leaflet'
import icon from '../constants'
// import DraggableMarker from '../map-component/draggableMarker'
const { Geolocation } = Plugins

let _this
class CashDropMap extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      latitude: '',
      longitude: ''
    }

    this.map = false
  }

  render () {
    const { latitude, longitude } = _this.state
    return (
      <Row className="chashdrop-map">
        <Col xs={12}>
          {latitude && longitude && (
            <Box className="cashdrop-box border-none">
              <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                style={{ height: '70vh' }}
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
                  {map => {
                    map.on('click', e => {
                      const { lat, lng } = e.latlng
                      console.log('lat:', lat, 'lon:', lng)
                      L.marker([lat, lng], {
                        icon: icon,
                        draggable: true
                      }).addTo(map)
                    })

                    // Create a handle to the map object after its been rendered.
                    _this.map = map

                    return null
                  }}
                </MapConsumer>
              </MapContainer>
            </Box>
          )}
        </Col>
      </Row>
    )
  }

  async componentDidMount () {
    await _this.getCurrentPosition()
    // This Function Sends test data to the form
    // to create the campaign model
    _this.getMapInfo()
    _this.props.handlePinCoordinates(_this.getPinCoordinates)
  }

  // This function pulls the coordinates for all the pins that were placed on
  // the map.
  // Returns an array of objects. Each object has a lat and lng property.
  getPinCoordinates () {
    try {
      if (!_this.map) {
        console.log('map object does not exist? Has the view been rendered?')
        return []
      }

      const map = _this.map

      const pinCoords = []

      // Get the coordinates for each pin.
      map.eachLayer(function (layer) {
        // console.log('layer: ', layer)
        // console.log(`layer._latlng: ${JSON.stringify(layer._latlng, null, 2)}`)

        // Add the pin coordinates to the array if it has a lat and lng. Not
        // all layers have these, and we want to ignore those that don't.
        if (layer._latlng) pinCoords.push(layer._latlng)
      })

      // Filter out the duplicates.
      const filteredCoords = _this.removeDuplicates(pinCoords)
      // console.log(`filteredCoords: ${JSON.stringify(filteredCoords, null, 2)}`)

      return filteredCoords
    } catch (err) {
      console.error('Error in map.js/getPinCoordinates()')
      throw err
    }
  }

  // Filters out duplicate coordinates from an array of coordinates. Returns an
  // array of unique coordinates.
  // This is needed because each marker placed on the map creates two pins in
  // the exact same spot.
  removeDuplicates (coordArray) {
    try {
      const filteredCoords = []

      // Loop through the input array.
      for (let i = 0; i < coordArray.length; i++) {
        const thisCoord = coordArray[i]

        // Flag to signal if a duplicate is found.
        let dupFound = false

        // Loop through all the coordinates we've already added to the
        // filteredCoords array.
        for (let j = 0; j < filteredCoords.length; j++) {
          const thisFilteredCoord = filteredCoords[j]

          // If a duplicate is found, set the flag.
          if (
            thisFilteredCoord.lat === thisCoord.lat &&
            thisFilteredCoord.lng === thisCoord.lng
          ) {
            dupFound = true
            break
          }
        }

        // Only add the coordinate if it's not a duplicate.
        if (!dupFound) {
          filteredCoords.push(thisCoord)
        }
      }

      return filteredCoords
    } catch (err) {
      console.error('Error in removeDuplicates()')
      throw err
    }
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

      this.props.handleLocation(latitude && longitude)
      return coordinates.coords
    } catch (error) {
      this.props.handleLocation(false)
      console.error(error)
    }
  }

  // Gets Latitud and longitude and radius from the map
  // to be sent to the form
  getMapInfo () {
    /**
     *
     *  TODO: Get map info to create
     *  a campaign model
     *
     */
    // Mock info
    const data = {
      latitude: _this.state.latitude, // Sends the latitude of the user
      longitude: _this.state.longitude, // Sends the longitude of the user
      radius: 20
    }
    // Sends the info to the form
    this.props.handleMapInfo(data)
  }
}

CashDropMap.propTypes = {
  handleLocation: PropTypes.func.isRequired, // Function that notifies if the user location has been obtained
  handleMapInfo: PropTypes.func.isRequired, // Function to send the info to the parent component
  handlePinCoordinates: PropTypes.func.isRequired
}

export default CashDropMap
