import React from 'react'
import { Row, Col, Box, Button, Inputs } from 'adminlte-2-react'
import CashDropQr from './qr-code'
import fetch from 'isomorphic-fetch'
import PropTypes from 'prop-types'

const { Text, Select } = Inputs

let _this

class CashDropForm extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      radiusOptions: ['15 min', 'Urban', 'Regional', 'Continental'],
      selectedRadius: 1000,
      rewardOptions: [1],
      selectedReward: 1,
      cashdropPins: '',
      cashdropTokenName: '',
      cashdropTokenTicker: '',
      cashdropTokenUrl: '',
      errMsg: '',
      showQr: '',
      amount: ''
    }
  }

  render () {
    const {
      rewardOptions,
      selectedReward,
      errMsg,
      showQr,
      amount,
      address
    } = _this.state
    return (
      <Row>
        <Col xs={12} className="cashdrop-form">
          <Box className="text-center cashdrop-box border-none">
            <Row>
              <Col sm={12}>
                <h3>
                  <span>
                    Pay this address and amount to add your pins to the game!
                  </span>
                </h3>
              </Col>
              {!showQr && (
                <section>
                  <Col sm={12} className="text-center mt-2 mb-1">
                    <Row>
                      <Col sm={12}>
                        <Text
                          id="cashdrop-token-name"
                          name="cashdropTokenName"
                          label="Token Name"
                          placeholder="Enter token name."
                          labelPosition="above"
                          onChange={_this.handleUpdate}
                        />
                      </Col>
                      <Col sm={12}>
                        <Text
                          id="cashdrop-token-ticker"
                          name="cashdropTokenTicker"
                          label="Token Ticker"
                          placeholder="Enter token ticker."
                          labelPosition="above"
                          onChange={_this.handleUpdate}
                        />
                      </Col>
                      <Col sm={12}>
                        <Text
                          id="cashdrop-token-url"
                          name="cashdropTokenUrl"
                          label="Website"
                          placeholder="Enter token url."
                          labelPosition="above"
                          onChange={_this.handleUpdate}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12} className="text-center mb-2">
                    {!showQr && (
                      <Button
                        text="Submit"
                        type="primary"
                        className="btn-lg"
                        onClick={_this.handleSubmit}
                      />
                    )}
                  </Col>
                </section>
              )}
              <Col sm={12} className="text-center">
                {errMsg && <p className="error-color">{errMsg}</p>}
              </Col>
              <Col sm={12} className="text-center">
                {showQr && (
                  <CashDropQr
                    handleOnHide={_this.hideQr}
                    amount={amount}
                    address={address}
                  />
                )}
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    )
  }

  async componentDidMount () {}

  handleUpdate (event) {
    const value = event.target.value
    _this.setState({
      [event.target.name]: value
    })
  }

  async handleSubmit () {
    try {
      // Validate form
      _this.validateInputs()

      const { mapInfo } = _this.props
      /**
       *
       * TODO: Validate mapInfo
       */

      /*
       *
       *
       * SUBMIT
       *
       * */

      // TODO: Get the pin coordinates from the map

      const {
        cashdropPins,
        cashdropTokenName,
        cashdropTokenTicker,
        cashdropTokenUrl
      } = _this.state

      const SERVER = process.env.SERVER

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaign: {
            drops: [1, 2, 3],
            merchant: 'test',
            lat: mapInfo.latitude,
            long: mapInfo.longitude,
            radius: mapInfo.radius,
            tokenName: cashdropTokenName,
            tokenTicker: cashdropTokenTicker,
            tokenUrl: cashdropTokenUrl,
            tokenQty: cashdropPins
          }
        })
      }

      const data = await fetch(`${SERVER}/campaigns`, options)
      const campaign = await data.json()
      console.log(campaign)

      console.log(`Pay this BCH address: ${campaign.campaign.bchAddr}`)
      if (!campaign.campaign.bchAddr) {
        throw new Error('Address not found!')
      }

      const sats = cashdropPins * 10000

      _this.setState({
        showQr: true,
        amount: _this.convertToBch(sats),
        address: campaign.campaign.bchAddr
      })
      _this.resetForm()
    } catch (error) {
      _this.setState({
        errMsg: error.message
      })
    }
  }

  validateInputs () {
    const {
      cashdropPins,
      cashdropTokenName,
      cashdropTokenTicker,
      cashdropTokenUrl
    } = _this.state

    // TODO: Get the number of pins placed on the map.
    // const pinsNumber = Number(cashdropPins)
    const pinsNumber = 5

    if (!pinsNumber) {
      throw new Error('Please place some pins on the map')
    }

    if (pinsNumber <= 0) {
      throw new Error('Amount must be greater than 1')
    }
    if (!cashdropTokenName) {
      throw new Error('Must add a token name')
    }
    if (!cashdropTokenTicker) {
      throw new Error('Must add a token ticker')
    }
    if (!cashdropTokenUrl) {
      throw new Error('Must add a token url')
    }
  }

  hideQr () {
    _this.setState({
      showQr: false
    })
  }

  convertToBch (amount) {
    try {
      const bch = (amount / 100000000).toFixed(8)

      return bch
    } catch (error) {
      console.error(error)
    }
  }

  resetForm () {
    _this.setState({
      selectedRadius: 1000,
      selectedReward: 1,
      cashdropPins: '',
      cashdropTokenName: '',
      cashdropTokenTicker: '',
      cashdropTokenUrl: '',
      errMsg: ''
    })
  }
}
CashDropForm.propTypes = {
  mapInfo: PropTypes.object
}
export default CashDropForm
