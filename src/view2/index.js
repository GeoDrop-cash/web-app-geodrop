/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/
import React from 'react'
import { Plugins } from '@capacitor/core'
import { Row, Col, Box } from 'adminlte-2-react'

const { Geolocation } = Plugins

let _this
class View2 extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      inFetch: true,
      coords: {},
      timestamp: ''
    }
  }

  render () {
    const { inFetch, coords, timestamp } = _this.state
    return (
      <Row>
        <Col xs={12}>
          <Box
            title='Geolocation'
            loaded={!inFetch}
          >
            <p>Latitude : {coords.latitude || 'Not Found'}</p>
            <p>Longitude : {coords.longitude || 'Not Found'}</p>
            <p>Timestamp : {timestamp || 'Not Found'}</p>
          </Box>
          {coords.latitude && coords.longitude && (
            <div id='mapid' style={{ height: '100vh' }} />
          )}
        </Col>
      </Row>
    )
  }

  async componentDidMount () {
    const coords = await _this.getCurrentPosition()
    // console.log(window)
    setTimeout(() => {
      _this.initMap(coords)
    }, 2000)
  }

  async getCurrentPosition () {
    console.log('Getting Current Position')
    const coordinates = await Geolocation.getCurrentPosition()
    console.log('Current', coordinates)
    _this.setState({
      coords: coordinates.coords,
      timestamp: coordinates.timestamp,
      inFetch: false
    })
    return coordinates.coords
  }

  initMap (coords) {
    try {
      const API_KEY = 'pk.eyJ1IjoiZXJpY2tnb256YWxlemRldiIsImEiOiJja2p2Mm91bjkwMHdjMnlvM2w1bWh1OTc5In0.1FH61V5ajjIEU0IBVgmQ5g'
      var mymap = window.L.map('mapid').setView([coords.latitude, coords.longitude], 13)

      window.L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
      }).addTo(mymap)
    } catch (error) {
      console.error(error)
    }
  }
}

export default View2
