/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/

import React from 'react'
import { Row, Col, Content, Box } from 'adminlte-2-react'
import CashDropForm from './form'
import CashDropMap from './map'
import './cashdrop.css'
let _this
class CashDrop extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      hasLocation: true,
      inFetch: true,
      mapInfo: {}
    }
  }

  render () {
    const { inFetch, hasLocation, mapInfo } = _this.state
    return (

      <Content
        browserTitle='CashDrop'
      >
        {hasLocation ? (
          /* Shows map and form */
          <Box
            loaded={!inFetch}
            className='border-none'
          >
            <Row>
              <Col xs={12} lg={6}>
                <CashDropMap
                  handleLocation={_this.onLocation}
                  handleMapInfo={_this.onMapInfo}
                />
              </Col>
              <Col xs={12} lg={6}>
                <CashDropForm mapInfo={mapInfo} />
              </Col>
            </Row>

          </Box>
        )
          : (
            /* Notifies the user */
            <Box className='text-center'>
              <span>We couldn't access to your location</span>

            </Box>
          )}

      </Content>
    )
  }

  async componentDidMount () {
  }

  // Verifies if the user location has been obtained
  onLocation (hasLocation) {
    _this.setState({
      hasLocation,
      inFetch: false
    })
  }

  // Function to receive information sent from the Map component
  onMapInfo (info) {
    _this.setState({
      mapInfo: info
    })
  }
}

export default CashDrop
