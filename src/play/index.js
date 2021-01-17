/*
  This controls the Play View, which gives the gamer hints on how to find
  the CashDrops for the Campaign they selected.
*/

import React from 'react'
import { Content, Row, Col, Box, Button } from 'adminlte-2-react'
import './play.css'
import fetch from 'isomorphic-fetch'

let _this
class Play extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      output: '',
      showTerminal: true,
      foundDrop: false
    }
    _this = this
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

  componentDidMount () {
    _this.handleDrop()

    // Used for debugging. Can be removed later.
    if (window) window.getDirections = _this.getDirections
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
    setInterval(() => {
      _this.handleLog('No pins close by')

      // TODO: Get the Campaign ID of the campaign that the player selected
      // in the Explore View.

      // TODO: Get players current coordinates.

      // directions = await _this.getDirections(campaignId)
    }, 10000)
  }

  // Query the server for directions to the neaerest Drop, for the selected
  // Campaign ID.
  async getDirections (campaignId) {
    try {
      const body = {
        playerInfo: {
          campaignId,
          lat: 48.5002868,
          lng: -122.649676
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
      const campaign = await data.json()
      console.log(campaign)
    } catch (err) {
      console.error('Error in getDirections()')
      throw err
    }
  }
}

export default Play
