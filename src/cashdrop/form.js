import React from 'react'
import { Plugins } from '@capacitor/core'
import { Row, Col, Content, Box, Button, Inputs } from 'adminlte-2-react'
import { Helmet } from 'react-helmet'
import CashDropQr from './qr-code'
const { Text, Select } = Inputs
let _this
class CashDropForm extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      radiusOptions: [1000, 2000, 3000, 4000],
      selectedRadius: 1000,
      rewardOptions: [1],
      selectedReward: 1,
      cashdropPins: '',
      errMsg: '',
      showQr: ''
    }
  }

  render () {
    const {
      radiusOptions,
      selectedRadius,
      rewardOptions,
      selectedReward,
      errMsg, showQr
    } = _this.state
    return (
      <Row>
        <Col xs={12}>
          <Box
            className='hover-shadow border-none mt-2'>
            <Row>
              <Col sm={12} className='text-center mt-2 mb-2'>
                <Row className=''>
                  <Col sm={12} lg={4}>
                    <Select
                      name='selectedRadius'
                      label='Radius'
                      labelPosition='above'
                      options={radiusOptions}
                      value={selectedRadius}
                      onChange={_this.handleUpdate}
                    />
                  </Col>
                  <Col sm={12} lg={4}>
                    <Text
                      id='cashdrop-pins'
                      name='cashdropPins'
                      label='Pins'
                      placeholder='How many pins to drop.'
                      labelPosition='above'
                      onChange={_this.handleUpdate}
                    />
                  </Col>
                  <Col sm={12} lg={4}>
                    <Select
                      id='cashdrop-reward'
                      name='selectedReward'
                      label='Reward'
                      labelPosition='above'
                      options={rewardOptions}
                      value={selectedReward}
                      onChange={_this.handleUpdate}
                    />
                  </Col>
                </Row>
              </Col>
              <Col sm={12} className='text-center mb-2'>
                { !showQr && (<Button
                  text='Submit'
                  type='primary'
                  className='btn-lg'
                  onClick={_this.handleSubmit}
                />)}
              </Col>
              <Col sm={12} className='text-center'>
                {errMsg && (
                  <p className='error-color'>{errMsg}</p>
                )}
              </Col>
              <Col sm={12} className='text-center'>
                {showQr && (
                  <CashDropQr onHide={_this.hideQr}/>
                )}
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    )
  }

  async componentDidMount () {
  }

  handleUpdate (event) {
    const value = event.target.value
    console.log(`${event.target.name} value`, value)
    _this.setState({
      [event.target.name]: value
    })
  }

  handleSubmit () {
    try {
      _this.validateInputs()
      /*
        *
        *
        * SUBMIT
        *
        * */
      _this.setState({
        errMsg: '',
        showQr: true
      })
    } catch (error) {
      _this.setState({
        errMsg: error.message
      })
    }
  }

  validateInputs () {
    const { cashdropPins } = _this.state
    const pinsNumber = Number(cashdropPins)

    if (!pinsNumber) {
      throw new Error('Pins must be a number')
    }

    if (pinsNumber <= 0) {
      throw new Error('Amount must be greater than 1')
    }
  }

  hideQr () {
    _this.setState({
      showQr: false
    })
  }
}

export default CashDropForm
