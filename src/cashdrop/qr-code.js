import React from 'react'
import { Plugins } from '@capacitor/core'
import { Row, Col, Content, Box, Button, Inputs } from 'adminlte-2-react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

const QRCode = require('qrcode.react')

const { Text, Select } = Inputs
let _this
class CashDropQr extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      addr: 'address',
      amount: Math.floor(Math.random() * 100000)
    }
  }

  render () {
    const {
      amount
    } = _this.state
    return (
      <Row>
        <Col xs={12}>
          <Box className='border-none mt-2'>
            <QRCode
              id='CashDropQr'
              className='qr-code'
              value={_this.state.addr}
              size={256}
              includeMargin
              fgColor='#333'
            />
            <p>Amount : {amount}</p>
          </Box>

        </Col>
        <Col sm={12} className='text-center mb-2'>
          <Button
            text='Close'
            type=''
            className='btn-lg'
            onClick={_this.props.onHide}
          />
        </Col>
      </Row>
    )
  }

  async componentDidMount () {
    _this.handleScroll()
  }

  // Scrolls the view to the QR code
  handleScroll () {
    const card = document.getElementById('CashDropQr')
    card.scrollIntoView({ behavior: 'smooth' })
  }
}
CashDropQr.propTypes = {
  onHide: PropTypes.func.isRequired
}
export default CashDropQr
