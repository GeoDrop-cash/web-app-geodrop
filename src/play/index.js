/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/

import React from 'react'
import { Content, Row, Col, Box, Button } from 'adminlte-2-react'
import PropTypes from 'prop-types'
import { Plugins } from '@capacitor/core'
import fetch from 'isomorphic-fetch'
import PlayMap from './map'
import './play.css'

const { Geolocation } = Plugins

let _this
class Play extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      output: '',
      showTerminal: true,
      dropFound: false,
      longitude: '',
      latitude: '',

      // Hard coding this value for testing.
      playerAddr: 'simpleledger:qzsavwau7kuxg4esklg7av77cfjpcu566ysc38tsqf',
      campaignId: '',
      hasLocation: true,
      inFetch: true,
      coords: {},
      campaign: {},
      directions: {}

    }
    _this = this
    this.msgInterval = null
    this.distanceToCollect = 100
  }

  render () {
    const {
      showTerminal,
      output,
      dropFound,
      directions,
      campaign,
      latitude,
      longitude
    } = _this.state
    return (
      <Content title="Play" subTitle="Play" browserTitle="Play">
        <Row>
          <Col xs={12} lg={6}>
            <PlayMap
              handleLocation={_this.onLocation}
              handleMapInfo={_this.onMapInfo}
              coordsToShearch={directions}
              campaign={campaign}
              playerPosition={{ latitude, longitude }}
            />
          </Col>
          <Col xs={12} lg={6}>
            <Box className="border-none terminal-box">
              <span>
                {showTerminal && (
                  <textarea
                    id="playTerminal"
                    className="playTerminal"
                    name="ipfsTerminal"
                    rows="15"
                    cols="50"
                    readOnly
                    value={`${output ? `${output}>` : '>'}`}
                  />
                )}
              </span>
              <Col xs={12} className="text-center">
                <Button
                  text="Collect"
                  type="primary"
                  className="btn-lg mt-2"
                  disabled={!dropFound}
                  onClick={_this.handleCollect}
                />
              </Col>
            </Box>
          </Col>
        </Row>
      </Content>
    )
  }

  // Click handler for the Collect button
  async handleCollect () {
    try {
      console.log(`Campaign ID: ${_this.state.campaignId}`)
      console.log(`Player latitude: ${_this.state.latitude}`)
      console.log(`Player longitude: ${_this.state.longitude}`)
      console.log(`Player address: ${_this.state.playerAddr}`)

      const body = {
        playerInfo: {
          playerAddr: _this.state.playerAddr,
          playerLat: _this.state.latitude,
          playerLng: _this.state.longitude,
          campaignId: _this.state.campaignId
        }
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }

      const SERVER = process.env.SERVER

      const data = await fetch(`${SERVER}/play/claim`, options)
      const directions = await data.json()
      console.log('directions', directions)
    } catch (err) {
      console.error('Error in handleCollect()')
      throw err
    }
  }

  // Gets current GPS location of the user device
  async getCurrentPosition () {
    try {
      // console.log('Getting Current Position')
      const coordinates = await Geolocation.getCurrentPosition()
      // console.log('Current', coordinates)

      const { latitude, longitude } = coordinates.coords

      _this.handleLog(`player: lat: ${latitude}, lng: ${longitude}`)

      _this.setState({
        latitude,
        longitude,
        inFetch: false
      })

      return coordinates.coords
    } catch (error) {
      this.props.handleLocation(false)
      console.error(error)
    }
  }

  async componentDidMount () {
    try {
      _this.handleLog('Finding the closest Drop...')

      const campaign = _this.handleCampaign()
      const campaignId = campaign ? campaign._id : ''

      _this.setState({
        campaignId
      })
      await _this.handleShowCampaign(campaign)
      _this.handleDrop(campaignId)

      await _this.getNearestDrop(campaignId)
    } catch (error) {
      // prevention
    }
  }

  // Finds the nearest drop 
  // to the player location
  async getNearestDrop (campaignId) {
    try {
      const { latitude, longitude } = await _this.getCurrentPosition()
      const playerPosition = {
        latitude,
        longitude
      }
      const directions = await _this.getDirections(campaignId, playerPosition)
      _this.setState({
        directions: directions
      })
      return directions.nearestDrop
    } catch (error) {
      console.error(error)
    }
  }

  // Adds a line to the terminal
  handleLog (str) {
    try {
      _this.setState({
        output: _this.state.output + '   ' + str + '\n'
      })
      _this.keepScrolled()
    } catch (error) {
      console.warn(error)
    }
  }

  // Keeps the terminal scrolled to the last line
  keepScrolled () {
    try {
      // Keeps scrolled to the bottom
      var textarea = document.getElementById('playTerminal')
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight
      }
    } catch (error) {
      console.warn(error)
      return {}
    }
  }

  handleDrop (campaignId) {
    // _this.handleLog('Get Current Position...')
    _this.msgInterval = setInterval(async () => {
      try {
        // Get current user position
        const { latitude, longitude } = await _this.getCurrentPosition()

        const playerPosition = {
          latitude,
          longitude
        }
        // Get Directions
        const directions = await _this.getDirections(campaignId, playerPosition)
        // console.log(`directions: ${JSON.stringify(directions, null, 2)}`)
        _this.setState({ directions })
        // Validate the current position
        if (!latitude || !longitude) {
          _this.handleLog('Error getting location')
          _this.handleLog(' ')
          return
        }

        const { distance, direction } = directions
        if (!distance || !direction) {
          _this.handleLog(`No pins close by : [ ${latitude} , ${longitude} ]`)
          _this.handleLog(' ')
          return
        }

        // Validates if we are in an allowed distance
        // to pick up a drop
        if (distance <= _this.distanceToCollect) {
          _this.setState({
            dropFound: true
          })
          _this.handleLog('You can collect this drop.')
          _this.handleLog(`You are ${distance} meters away from the drop.`)
          _this.handleLog(' ')
          return
        }

        _this.handleLog(`Closest Drop: ${distance} meters in a ${directions.direction} direction.`)

        _this.handleLog(' ')
      } catch (error) {
        console.error(error)
      }
    }, 10000)
  }

  // Obtains the info of the campaign
  // from the 'Explore' view
  handleCampaign () {
    try {
      const { campaign } = _this.props.menuNavigation.data
      if (!campaign) {
        return
      }
      console.log('Campaign to collect :', campaign)
      _this.setState({
        campaign
      })
      return campaign
    } catch (error) {}
  }

  // Query the server for directions to the neaerest Drop, for the selected
  // Campaign ID.
  async getDirections (campaignId, playerPosition) {
    try {
      const body = {
        playerInfo: {
          campaignId,
          lat: playerPosition.latitude,
          lng: playerPosition.longitude
        }
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }

      const SERVER = process.env.SERVER

      const data = await fetch(`${SERVER}/play/directions`, options)
      // console.log(data)

      if (data.status > 400) {
        console.log(data)
        _this.handleLog('No Drops Found! Select a campaign on the Explore view.')
        _this.handleLog(' ')
      }

      const directions = await data.json()
      // console.log(directions)

      return directions
    } catch (err) {
      console.error('Error in getDirections(): ', err)
      throw err
    }
  }

  componentWillUpdate () {
    // Update player address
    const { playerAddr } = _this.state
    const { slpAddress } = _this.props.walletInfo
    if (playerAddr !== slpAddress) {
      console.log(`Player Address :${slpAddress}`)
      _this.setState({
        playerAddr: slpAddress
      })
    }
  }

  componentWillUnmount () {
    clearInterval(_this.msgInterval)
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

  async handleShowCampaign (campaign) {
    try {
      _this.setState(prevState => ({
        ...prevState,
        campaign
      }))
    } catch (error) {
      console.error(error)
    }
  }
}
Play.propTypes = {
  onShowCampaign: PropTypes.func,
  menuNavigation: PropTypes.object,
  walletInfo: PropTypes.object.isRequired
}
export default Play
