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
import fetch from 'isomorphic-fetch'

import './explore.css'

const BchWallet =
  typeof window !== 'undefined'
    ? window.SlpWallet
    : null

let _this
class Explore extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      hasLocation: true,
      inFetch: true,
      coords: {},
      campaign: {}
    }
    this.BchWallet = BchWallet
  }

  render () {
    const { inFetch, hasLocation, coords, campaign } = _this.state

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
                    campaign={campaign}
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

  async componentDidMount () {
    _this.removeWarningElemente()
    await _this.handleCreateWallet()
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

  // Hides the splash 3 secs after loading all components
  hideSplash () {
    setTimeout(() => {
      const splash = document.getElementById('___splash')
      splash.style.display = 'none'
    }, 3000)
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
      const { lat, long } = campaign
      // Obtains the first drop of the campaign
      const drop = await _this.getDrop(campaign.drops[0])
      _this.setState(prevState => ({
        ...prevState,
        coords: {
          lat: drop.lat,
          long: drop.lng
        },
        campaign
      }))
    } catch (error) {
      console.error(error)
    }
  }

  async getDrop (dropId) {
    try {
      const SERVER = process.env.SERVER
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const data = await fetch(`${SERVER}/drops/${dropId}`, options)
      const drops = await data.json()

      console.log('drops', drops)
      if (!drops && drops.drops) {
        throw new Error('drops not found!')
      }
      return drops.drop
    } catch (error) {
      _this.setState({
        inFetch: false,
        errMsg: error.message
      })
    }
  }

  async handleCreateWallet () {
    try {
      const currentWallet = _this.props.walletInfo

      if (currentWallet.mnemonic) {
        console.warn('Wallet already exists')
        return
      }

      const apiToken = currentWallet.JWT
      const restURL = currentWallet.selectedServer
      const bchjsOptions = {}

      if (apiToken || restURL) {
        if (apiToken) {
          bchjsOptions.apiToken = apiToken
        }
        if (restURL) {
          bchjsOptions.restURL = restURL
        }
      }

      const bchWalletLib = new _this.BchWallet(null, bchjsOptions)

      // Update bchjs instances  of minimal-slp-wallet libraries
      bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)

      await bchWalletLib.walletInfoPromise // Wait for wallet to be created.

      const walletInfo = bchWalletLib.walletInfo
      walletInfo.from = 'created'

      Object.assign(currentWallet, walletInfo)

      const myBalance = await bchWalletLib.getBalance()

      const bchjs = bchWalletLib.bchjs

      let currentRate

      if (bchjs.restURL.includes('abc.fullstack')) {
        currentRate = await bchjs.Price.getBchaUsd() * 100
      } else {
        // BCHN price.
        currentRate = (await bchjs.Price.getUsd()) * 100
      }

      // console.log("myBalance", myBalance)
      // Update redux state
      _this.props.setWalletInfo(currentWallet)
      _this.props.updateBalance({ myBalance, currentRate })
      _this.props.setBchWallet(bchWalletLib)
    } catch (error) {
      console.error(error)
    }
  }
}

Explore.propTypes = {
  onShowCampaign: PropTypes.func,
  walletInfo: PropTypes.object.isRequired,
  setWalletInfo: PropTypes.func.isRequired,
  updateBalance: PropTypes.func.isRequired,
  setBchWallet: PropTypes.func.isRequired,
  menuNavigation: PropTypes.object
}
export default Explore
