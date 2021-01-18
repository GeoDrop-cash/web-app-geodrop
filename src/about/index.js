/*
  About page
*/

import React from 'react'
import { Row, Col, Content, Box, Button } from 'adminlte-2-react'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'

const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

let _this
class About extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      unconfirmedBalance: 0,
      confirmedBalance: 0,
      totalBalance: 0,
      inFetch: false,
      bchWallet: '',
      isChecked: ''
    }
  }

  render () {
    const {
      unconfirmedBalance,
      confirmedBalance,
      totalBalance,
      inFetch,
      isChecked
    } = _this.state
    return (
      <Content
        title="About GeoDrop.cash"
        subTitle="A map-based scavenger hunt game"
        browserTitle="About | GeoDrop.cash"
      >
        <Row>
          <Col xs={12}>
            <Box title="About the Game:" type="primary" loaded={!inFetch}>
              <p>
                GeoDrop.cash is a map-based scavenger hunt game, similar to
                Pokemon Go. It was built for the{' '}
                <a
                  href="https://devpost.com/software/purelypeer"
                  target="_blank"
                >
                  CoinParty Hackathon
                </a>{' '}
                by the PurelyPeer team.
              </p>
              <br></br>

              <h4>Merchants:</h4>
              <p>
                Merchants can use this game to promote their business. They can
                place SLP tokens around their town, which can represent coupons,
                collectibles, or anything you can think of.
              </p>
              <p>
                The cost is 10,000 satoshis per Drop, approximately $0.05 at the
                time this app was launched. 3,000 satoshis are rewarded to the
                player, when the Drop is claimed. Some goes to pay for
                transaction fees. The rest is sent to{' '}
                <a href="https://eatbch.org/" target="_blank">
                  eatBCH
                </a>{' '}
                to help feed people in need around the world.
              </p>
              <br></br>

              <h4>Gamers:</h4>
              <p>
                Players can select a Campaign on the Explore page, and they will
                recieve guided directions to the nearest Drop. When the get
                close enough, they can collect the Drop, which will give them an
                SLP token and 3000 satoshis of BCH.
              </p>
              <br></br>

              <h4>Developers:</h4>
              <p>
                This app is 100% open source and MIT licensed. It runs on
                Bitcoin Cash infrastructure provided by{' '}
                <a href="https://fullstack.cash" target="_blank">
                  FullStack.cash
                </a>
              </p>
              <p>Source Code:</p>
              <ul>
                <li>
                  <a
                    href="https://github.com/GeoDrop-cash/web-app-geodrop"
                    target="_blank"
                  >
                    Front end web app
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/GeoDrop-cash/server-geodrop"
                    target="_blank"
                  >
                    Back end server
                  </a>
                </li>
              </ul>
              <br></br>

              <h4>Android App</h4>
              <p>
                This app can also be downloaded and installed as an Android app.
              </p>
              <ul>
                <li>
                  <a
                    href="https://github.com/GeoDrop-cash/web-app-geodrop/blob/master/geodrop-android.apk"
                    target="_blank"
                  >
                    Android APK File
                  </a>
                </li>
              </ul>
            </Box>
          </Col>
        </Row>
      </Content>
    )
  }

  componentDidMount () {
    _this.instanceWallet() // Creates a web wallet instance
  }

  // Get wallet balance
  async handleGetBalance () {
    try {
      _this.setState({
        inFetch: true
      })

      const addr = 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3'

      const bchWallet = _this.state.bchWallet
      const bchjs = bchWallet.bchjs

      // Get the Balance
      const balances = await bchjs.Electrumx.balance(addr)

      const totalBalance =
        balances.balance.confirmed + balances.balance.unconfirmed

      _this.setState({
        inFetch: false,
        unconfirmedBalance: balances.balance.unconfirmed,
        confirmedBalance: balances.balance.confirmed,
        totalBalance: totalBalance,
        isChecked: true
      })
    } catch (error) {
      console.error(error)
      _this.setState({
        inFetch: false
      })
    }
  }

  // Creates an instance  of minimal-slp-wallet, with
  // the local storage information if it exists
  instanceWallet () {
    try {
      const localStorageInfo = getWalletInfo()
      if (!localStorageInfo.mnemonic) return null

      const jwtToken = localStorageInfo.JWT
      const restURL = localStorageInfo.selectedServer
      const bchjsOptions = {}

      if (jwtToken) {
        bchjsOptions.apiToken = jwtToken
      }
      if (restURL) {
        bchjsOptions.restURL = restURL
      }
      const bchWalletLib = new BchWallet(
        localStorageInfo.mnemonic,
        bchjsOptions
      )

      // Update bchjs instances  of minimal-slp-wallet libraries
      bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)

      _this.setState({
        bchWallet: bchWalletLib
      })
      return bchWalletLib
    } catch (error) {
      console.warn(error)
    }
  }
}

export default About
