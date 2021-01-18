import React from 'react'
import PropTypes from 'prop-types'
import { Plugins } from '@capacitor/core'
import { Row, Col, Box } from 'adminlte-2-react'
import {
  MapContainer,
  TileLayer,
  useMap
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
let _layerControl
class ExploreMap extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      latitude: '',
      longitude: ''
    }

    MyComponent = (props) => {
      console.log('Explore.MyComponent is mounted')
      // Get map
      const map = useMap()
      console.log('explore map props', props)

      // Get geolocation from props
      const { lat, lng, campaign } = props
      if (!lat || !lng) { return null }

      // Validates if we are in the position
      // that we want to locate
      if (_layerControl &&
        _layerControl._latlng.lat === lat &&
        _layerControl._latlng.lng === lng) {
        return null
      }
      // console.log('_layerControl', _layerControl)
      // We move to the next point in the map
      if (lat && lng) {
        // Verify is there's a marker already
        if (_layerControl) {
        // Deletes the previous marker
          map.removeLayer(_layerControl)
        }
        const layer = L.marker([lat, lng], { id: 1, icon: icon }).addTo(map)

        layer.bindPopup(
          /* `<p>Lat: ${lat}, Lng: ${lng}</p>` */
          `<p>${campaign.tokenName || 'MyPosition'}</p>`
        ).openPopup()
        _layerControl = layer // Store the new marker

        console.log(`Fly To : lat: ${lat} , lng: ${lng}`)
        map.flyTo([lat, lng], map.getZoom()) // Animation
      }

      return null
    }
  }

  render () {
    const { latitude, longitude } = _this.state
    const { campaign } = _this.props
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
                  <MyComponent
                    lat={latitude}
                    lng={longitude}
                    campaign={campaign}
                  />
                </MapContainer>
              </Box>
            )
          }
        </Col>
      </Row>

    )
  }

  async componentDidMount () {
    await _this.getCurrentPosition()

    // This Function Sends test data to the form
    // to create the campaign model
    _this.getMapInfo()
  }

  async componentDidUpdate () {
    const { coordsToShearch } = _this.props
    const { lat, long } = coordsToShearch

    const { latitude, longitude } = _this.state
    if ((lat && long) && lat !== latitude) {
      console.log('change location to ', coordsToShearch.lat, coordsToShearch.long)
      _this.setState({
        latitude: coordsToShearch.lat || latitude,
        longitude: coordsToShearch.long || longitude
      })
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

ExploreMap.propTypes = {
  handleLocation: PropTypes.func.isRequired, // Function that notifies if the user location has been obtained
  handleMapInfo: PropTypes.func.isRequired, // Function to send the info to the parent component
  coordsToShearch: PropTypes.object,
  campaign: PropTypes.object // Selected Campaign
}
export default ExploreMap
