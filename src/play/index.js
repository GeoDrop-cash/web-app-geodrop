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
      latitude: ''
    }
    _this = this
    this.msgInterval = null
    this.distanceToCollect = 10
  }

  render () {
    const { showTerminal, output, dropFound } = _this.state
    return (
      <Content title="Play" subTitle="Play" browserTitle="Play">
        <Row>
          <Col xs={12}>
            <Box className="border-none">
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
            </Box>
          </Col>
          <Col xs={12} className="text-center">
            <Button
              text="Collect"
              type="primary"
              className="btn-lg"
              disabled={!dropFound}
            />
          </Col>
        </Row>
      </Content>
    )
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
      this.props.handleLocation(false)
      console.error(error)
    }
  }

  async componentDidMount () {
    const campaignId = _this.handleCampaign()
    _this.handleDrop(campaignId)
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
    _this.handleLog('Get Current Position...')
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
        console.log(`directions: ${JSON.stringify(directions, null, 2)}`)

        // Validate the current position
        if (!latitude || !longitude) {
          _this.handleLog('Error getting location')
          return
        }

        const { distance, direction } = directions
        if (!distance || !direction) {
          _this.handleLog(`No pins close by : [ ${latitude} , ${longitude} ]`)
          return
        }
        // Validates if we are in an allowed distance
        // to pick up a drop
        if (distance <= _this.distanceToCollect) {
          _this.setState({
            dropFound: true
          })
          _this.handleLog('You can collect this drop.')
          return
        }
        _this.handleLog(`Closest Drop: ${directions.distance} meters in a ${directions.direction} direction.`)
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

      return campaign._id
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
      const directions = await data.json()
      // console.log(directions)

      return directions
    } catch (err) {
      console.error('Error in getDirections()')
      return false
    }
  }

  componentWillUnmount () {
    clearInterval(_this.msgInterval)
  }
}
Play.propTypes = {
  onShowCampaign: PropTypes.func,
  menuNavigation: PropTypes.object
}
export default Play
