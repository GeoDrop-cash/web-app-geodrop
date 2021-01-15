import React from 'react'
import PropTypes from 'prop-types'
import { Plugins } from '@capacitor/core'
import { Row, Col, Box } from 'adminlte-2-react'
import {
  MapContainer,
  TileLayer
} from 'react-leaflet'

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
  }

  render () {
    const { latitude, longitude } = _this.state
    return (
      <Row className='chashdrop-map'>
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
}
CashDropMap.propTypes = {
  handleLocation: PropTypes.func.isRequired // Function that notifies if the user location has been obtained

}
export default CashDropMap
