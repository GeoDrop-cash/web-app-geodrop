/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/

import React from 'react'
import { Content, Box, Row, Col } from 'adminlte-2-react'
import ExploreMap from './map'
import ExploreTable from './table'
import PropTypes from 'prop-types'

import './explore.css'
let _this
class Explore extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      hasLocation: true,
      inFetch: true,
      coords: {}
    }
  }

  render () {
    const { inFetch, hasLocation, coords } = _this.state

    return (
      <>
        <Content
          title='Explore'
          subTitle='Explore'
          browserTitle='Explore'
        >
          {hasLocation ? (
          /* Shows map and form */
            <Box
              loaded={!inFetch}
              className='border-none'
            >
              <Row>
                <Col xs={12} lg={6}>
                  <ExploreMap
                    handleLocation={_this.onLocation}
                    handleMapInfo={_this.onMapInfo}
                    coordsToShearch={coords}
                  />
                </Col>
                <Col xs={12} lg={6}>
                  <ExploreTable
                    onShowCampaign={_this.handleShowCampaign}
                    menuNavigation={_this.props.menuNavigation}
                  />
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
      </>
    )
  }

  componentDidMount () {
    _this.removeWarningElemente()

    _this.hideSplash()
  }

  // NOTE: Due that there's no wrapper this function
  // needs to be called on the first loaded component
  // in this case the 'explore' component
  //
  // Function to remove the 'warning alpha version' tag
  removeWarningElemente () {
    const interval = setInterval(() => {
      try {
        // Locate the parent element
        const navbarElem = document.getElementsByClassName('navbar-nav')
        if (!navbarElem || !navbarElem.length) throw new Error('Warning alpha not found')
        // get the childrent element that
        // we want to delete
        const children = navbarElem[0].children[0]

        if (!children) {
          // deleted. exits
          clearInterval(interval)
          return
        }
        // Deletes the element
        navbarElem[0].removeChild(children)
        clearInterval(interval)
      } catch (error) {
        // If we dont found the parent element, retry until
        // that gets rendered and we can locate it
        clearInterval(interval)
        this.removeWarningElemente()
      }
    }, 200)
  }

  // Hides the splash 1.5 secs after loading all components
  hideSplash () {
    setTimeout(() => {
      const splash = document.getElementById('___splash')
      splash.style.display = 'none'
    }, 1500)
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

  handleShowCampaign (campaign) {
    try {
      const { drops } = campaign
      // Obtains the first drop to show on the map
      // TODO: Add all the pins to the map
      const { lat, lng } = drops[0]

      _this.setState({
        coords: {
          lat,
          long: lng
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
Explore.propTypes = {
  onShowCampaign: PropTypes.func,
  menuNavigation: PropTypes.object
}
export default Explore
