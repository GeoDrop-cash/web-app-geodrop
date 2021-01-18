import React from 'react'
import { Row, Col, Button, Box } from 'adminlte-2-react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const QRCode = require('qrcode.react')

let _this
class CashDropQr extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      txId: '',
      errMsg: '',
      canPay: false,
      inFetch: false
    }
  }

  render () {
    const { txId, errMsg, canPay, inFetch } = _this.state
    const showPayBtn = (canPay && !txId)
    return (
      <Box loaded={!inFetch } className="border-none">
        <Row>
          <Col xs={12}>
            <QRCode
              id='CashDropQr'
              className='qr-code'
              value={_this.props.address}
              size={256}
              includeMargin
              fgColor='#333'
            />
            <Row className='mb-1'>
              <Col xs={12} >
                <span>{_this.props.address}</span>
                <FontAwesomeIcon
                  className='icon btn-animation ml-1'
                  size='lg'
                  onClick={() => _this.copyToClipBoard(_this.props.address)}
                  icon='copy'
                />
              </Col>
            </Row>
            <p className='cashdrop-amount'>Amount : <b>{_this.props.amount}</b></p>

          </Col>

          <Col sm={12} className='text-center qr-btn-container'>
            <Row>
              <Col sm={12} lg={6}>
                {showPayBtn && (
                  <Button
                    text='Pay From Wallet'
                    type="primary"
                    className='btn-lg mt-1 qr-btn-send'
                    onClick={_this.handleSend}
                  />)}
              </Col>
              <Col sm={12} lg={showPayBtn ? 6 : 12}>
                <Button
                  text='Close'
                  className={`btn-lg mt-1 ${showPayBtn ? 'qr-btn-close' : 'qr-btn-close2'}`}
                  onClick={_this.props.handleOnHide}
                />
              </Col>
            </Row>

          </Col>
          {(txId || errMsg) && (
            <Col xs={12} className="mt-1">
              {
                txId
                  ? <span className="success-color">Success!!</span>
                  : <span className="error-color">{errMsg}</span>
              }
            </Col>
          )
          }
        </Row>
      </Box>
    )
  }

  async componentDidMount () {
    // _this.handleScroll()
    await _this.validateBalance()
  }

  // Scrolls the view to the QR code
  handleScroll () {
    const card = document.getElementById('CashDropQr')
    card.scrollIntoView({ behavior: 'smooth' })
  }

  async handleSend () {
    try {
      const { address, amount } = _this.props

      const bchWalletLib = _this.props.bchWallet

      const amountToSend = Math.floor(Number(amount) * 100000000)
      console.log(`Sending ${amountToSend} satoshis to ${address}`)

      const receivers = [
        {
          address,
          // amount in satoshis, 1 satoshi = 0.00000001 Bitcoin
          amountSat: amountToSend
        }
      ]
      // console.log("receivers", receivers)

      if (!bchWalletLib) {
        throw new Error('Wallet not found')
      }
      _this.setState({
        inFetch: true
      })

      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWalletLib.walletInfo.address
      await bchWalletLib.utxos.initUtxoStore(walletAddr)

      // Send the BCH.
      const result = await bchWalletLib.send(receivers)
      // console.log('result',result)
      _this.setState({
        txId: result,
        inFetch: false
      })

      // update balance
      setTimeout(async () => {
        const myBalance = await bchWalletLib.getBalance()
        const bchjs = bchWalletLib.bchjs

        let currentRate

        if (bchjs.restURL.includes('abc.fullstack')) {
          currentRate = (await bchjs.Price.getBchaUsd()) * 100
        } else {
          // BCH price.
          currentRate = (await bchjs.Price.getUsd()) * 100
        }

        _this.props.updateBalance({ myBalance, currentRate })
      }, 1500)

      console.log('Payment Sucess')
    } catch (error) {
      console.error(error)
      _this.setState({
        inFetch: false,
        errMsg: error.message
      })
    }
  }

  // Validates if the balance is enough
  // to create the tokens
  async validateBalance () {
    const bchWalletLib = _this.props.bchWallet
    const myBalance = await bchWalletLib.getBalance()
    console.log(`My Wallet Balance : ${myBalance}`)

    const { amount } = _this.props

    const amountToSend = Math.floor(Number(amount) * 100000000)
    if (myBalance > amountToSend) {
      _this.setState({
        canPay: true
      })
    }
  }

  // copy info  to clipboard
  copyToClipBoard (val) {
    const textArea = document.createElement('textarea')
    textArea.value = val // copyText.textContent;
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()
  }
}
CashDropQr.propTypes = {
  handleOnHide: PropTypes.func.isRequired, // Function to close
  amount: PropTypes.string.isRequired, // Quantity of sats to show
  address: PropTypes.string.isRequired,
  bchWallet: PropTypes.object,
  updateBalance: PropTypes.func.isRequired

}
export default CashDropQr
