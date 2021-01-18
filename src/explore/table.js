/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/

import React from 'react'
import { Row, Col, Box, Button } from 'adminlte-2-react'
import fetch from 'isomorphic-fetch'
import PropTypes from 'prop-types'

let _this
class ExploreTable extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      inFetch: true,
      errMsg: '',
      campaigns: []
    }
  }

  render () {
    const { campaigns, inFetch } = _this.state
    return (
      <>
        <Row>
          <Col xs={12}>
            <Box
              loaded={!inFetch}
              className='border-none explore-table'
            >
              <table>
                <thead>
                  <tr>
                    <th colSpan='2'>Campaigns</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    campaigns.length ? campaigns.map((val, i) => {
                      return (
                        <tr key={val.tokenName + i}>
                          <td style={{ width: '50%' }}>{val.tokenName}</td>
                          <td>
                            <Button
                              text='Show on Map'
                              type='primary'
                              className='btn-lg table-btn'
                              onClick={() => _this.showOnMap(val)}
                            />
                            <Button
                              text='Play'
                              type='primary'
                              className='btn-lg table-btn'
                              onClick={() => _this.playCampaign(val)}
                            />
                          </td>
                        </tr>
                      )
                    })
                      : (
                        <tr key='campaignsNotFound'>
                          <td className='text-center'>
                            {'There are no campaigns yet'}
                          </td>

                        </tr>)
                  }

                </tbody>
              </table>
            </Box>

          </Col>
        </Row>
      </>
    )
  }

  async componentDidMount () {
    await this.handleGetCampaigns()
  }

  async handleGetCampaigns () {
    try {
      const SERVER = process.env.SERVER
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const data = await fetch(`${SERVER}/campaigns`, options)
      const campaigns = await data.json()
      console.log('campaigns', campaigns)
      if (!campaigns && campaigns.campaigns) {
        throw new Error('Campaings not found!')
      }
      _this.setState({
        inFetch: false,
        campaigns: _this.filterPaidCampaigns(campaigns.campaigns)
      })
      console.log()
    } catch (error) {
      console.error('Error trying to fetch campaign data from the server: ', error)

      _this.setState({
        inFetch: false,
        errMsg: error.message
      })
    }
  }

  async showOnMap (campaign) {
    try {
      console.log('campaigns to locate', campaign)
      _this.handleScroll()
      await _this.props.onShowCampaign(campaign)
    } catch (error) {
      console.log(error)
    }
  }

  // Filter the campaigns that has been paid
  filterPaidCampaigns (campaigns) {
    const paidCampaigns = []
    try {
      if (!campaigns.length) { return campaigns }
      campaigns.map(val => {
        if (val.hasBeenPaid && val.isActive) {
          paidCampaigns.push(val)
        }
      })
      return paidCampaigns
    } catch (error) {
      console.error(error)
    }
  }

  // Change to the 'Play' view
  // pass the values of the selected campaign
  playCampaign (val) {
    try {
      console.log('Navigate to play view ')
      _this.props.menuNavigation.changeTo('Play', { campaign: val })
    } catch (error) {

    }
  }

  // Focus the map on the screen
  handleScroll () {
    const mapElement = document.getElementsByClassName('explore-map')
    mapElement[0].scrollIntoView({ behavior: 'smooth' })
  }
}
ExploreTable.propTypes = {
  onShowCampaign: PropTypes.func,
  menuNavigation: PropTypes.object
}
export default ExploreTable
