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

import './play.css'

const { Geolocation } = Plugins

let _this
class Play extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      output: '',
      showTerminal: true,
      foundDrop: false,
      longitude: '',
      latitude: ''
    }
    _this = this
    this.msgInterval = null
  }

  render () {
    const { showTerminal, output, dropFound } = _this.state
    return (
      <Content
        title='Play'
        subTitle='Play'
        browserTitle='Play'
      >
        <Row>
          <Col xs={12}>
            <Box className='border-none'>
              <span>
                {showTerminal && (
                  <textarea
                    id='playTerminal'
                    className='playTerminal'
                    name='ipfsTerminal'
                    rows='15'
                    cols='50'
                    readOnly
                    value={`${output ? `${output}>` : '>'}`}
                  />
                )}
              </span>
            </Box>
          </Col>
          <Col xs={12} className='text-center'>
            <Button
              text='Collect'
              type='primary'
              className='btn-lg'
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

  componentDidMount () {
    _this.handleDrop()
    _this.handleCampaign()
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
    }
  }

  handleDrop () {
    _this.handleLog('Get Current Position...')
    _this.msgInterval = setInterval(async () => {
      const { latitude, longitude } = await _this.getCurrentPosition()

      _this.handleLog(`No pins close by : [ ${latitude} , ${longitude} ]`)
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
    } catch (error) {
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
