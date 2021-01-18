import React from 'react'
import PropTypes from 'prop-types'
import { Plugins } from '@capacitor/core'
import { Row, Col, Box } from 'adminlte-2-react'
import {
  MapContainer,
  TileLayer,
  useMap,
  Polygon,
  Popup
} from 'react-leaflet'
import L from 'leaflet'

const { Geolocation } = Plugins

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png'
})

let _this
let MyComponent

// This Variable will store a copy of a layer (pin)
// this will help us when we need to delete it
/* const _layerControl = {}

const _playerLastPosition = { lat: 0, lng: 0 } */
class PlayMap extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      latitude: '',
      longitude: ''

    }
    this._layerControl = {}
    this._playerLastPosition = { lat: 0, lng: 0 }

    MyComponent = (props) => {
      // console.log('Explore.MyComponent is mounted')
      // Get map
      const map = useMap()
      // console.log('explore map props', props)

      // Get geolocation from props
      const { lat, lng, campaign, userCoords } = props
      const playerLat = userCoords.latitude
      const playerLng = userCoords.longitude

      // Drop Marker
      if (lat && lng && campaign && !this._layerControl.dropLayer) {
        // console.log('adding drop layer', lat, lng)
        // User marker
        const dropLayer = L.marker(
          [lat, lng],
          { id: 2, icon: icon })
          .addTo(map)
        dropLayer.bindPopup(
                `<p>${campaign.tokenName}</p>`
        ).openPopup()
        // Prevents that multiple pins get added
        // in the same position
        this._layerControl.dropLayer = dropLayer
      }

      // Deletes the pin of the last position
      // to put the pin on the current position
      // of the player
      if (this._playerLastPosition.lat !== playerLat ||
        this._playerLastPosition.lng !== playerLng) {
        // console.log('updating my position')
        // console.log(`from [ ${this._playerLastPosition.lat} , ${this._playerLastPosition.lng}]`)
        // console.log(`to [ ${playerLat} , ${playerLng}]`)
        try {
          map.removeLayer(this._layerControl.playerLayer)
          this._layerControl.playerLayer = null
        } catch (error) {
          // There are no pins to delete
        }
      }

      // Marks the player position
      // after that the pin position
      // gets marked
      if (this._layerControl.dropLayer) {
      // User marker
        if (playerLat && playerLng && !this._layerControl.playerLayer) {
          // console.log('adding player layer', playerLat, playerLng)

          const playerLayer = L.marker(
            [playerLat, playerLng],
            { id: 1, icon: icon })
            .addTo(map)
          playerLayer.bindPopup(
          /* `<p>Lat: ${lat}, Lng: ${lng}</p>` */
            '<p>My Position</p>'
          ).openPopup()
          // Prevents that multiple pins get added
          // to the same position
          this._layerControl.playerLayer = playerLayer
          this._playerLastPosition.lat = userCoords.latitude
          this._playerLastPosition.lng = userCoords.longitude
        }
      }
      return null
    }
  }

  componentWillUnmount () {
    this._layerControl = {}
    this._playerLastPosition = { lat: 0, lng: 0 }
  }

  render () {
    const { latitude, longitude } = _this.props.playerPosition
    const { campaign, coordsToShearch } = _this.props
    const { nearestDrop, distance } = coordsToShearch
    let showPolygon = false
    if (nearestDrop) {
      showPolygon = latitude && longitude && nearestDrop.latitude && nearestDrop.longitude
    }
    return (
      <Row className='explore-map'>
        <Col xs={12}>
          {
            latitude && longitude && (
              <Box className='cashdrop-box border-none'>
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={15}
                  style={{ height: '70vh' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />
                  {nearestDrop &&
                 <MyComponent
                   lat={nearestDrop.latitude}
                   lng={nearestDrop.longitude}
                   campaign={campaign}
                   userCoords= {{ latitude, longitude }}
                 />}

                  { showPolygon && <Polygon
                    positions={
                      [
                        [nearestDrop.latitude, nearestDrop.longitude],
                        [latitude, longitude]
                      ]
                    }
                    pathOptions={{ color: 'green' }} >
                    <Popup>{`${distance} mts`}</Popup>
                  </Polygon>
                  }
                </MapContainer>
              </Box>
            )
          }
        </Col>
      </Row>

    )
  }

  async componentDidMount () {
    // await _this.getCurrentPosition()

    // This Function Sends test data to the form
    // to create the campaign model
    _this.getMapInfo()
  }

  /*   // Gets current GPS location of the user device
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
  } */

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

PlayMap.propTypes = {
  handleLocation: PropTypes.func.isRequired, // Function that notifies if the user location has been obtained
  handleMapInfo: PropTypes.func.isRequired, // Function to send the info to the parent component
  coordsToShearch: PropTypes.object,
  campaign: PropTypes.object, // Selected Campaign
  playerPosition: PropTypes.object
}
export default PlayMap
