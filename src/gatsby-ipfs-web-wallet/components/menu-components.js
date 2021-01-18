/*
  This file is how you add new menu items to your site. It uses the Gatsby
  concept of Component Shadowing:
  https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/

  It over-rides he default file in the gatsby-ipfs-web-wallet Theme.
*/

import React from 'react'
import { Sidebar } from 'adminlte-2-react'

// Example/Demo component. This is how you would build a component internal to
// your wallet app/site.
import DemoComponent from '../../demo-component'
import View1 from '../../view1'
import View2 from '../../view2'
import About from '../../view3'

import CashDrop from '../../cashdrop'
import Explore from '../../explore'
import Play from '../../play'

// TX History Plugin.
// This is an example of an external plugin for the wallet. It's a modular
// approach to sharing 'lego blocks' between wallet apps.
// import TXHistory from 'gatsby-plugin-bch-tx-history/src/components/txhistory'
import TXHistory from 'gatsby-plugin-bch-tx-history'

// Default components from gatsby-ipfs-web-wallet.
import Wallet from 'gatsby-ipfs-web-wallet/src/components/admin-lte/wallet'
import Tokens from 'gatsby-ipfs-web-wallet/src/components/admin-lte/tokens'
import Configure from 'gatsby-ipfs-web-wallet/src/components/admin-lte/configure'
import SendReceive from 'gatsby-ipfs-web-wallet/src/components/admin-lte/send-receive'

const { Item } = Sidebar

const MenuComponents = props => {
  return [
    {
      active: true,
      key: 'Explore',
      component: <Explore key="Explore" {...props} />,
      menuItem: <Item icon="fas-cog" key="Explore" text="Explore" />
    },
    {
      key: 'Play',
      component: <Play key="Play" {...props} />,
      menuItem: <Item icon="fas-cog" key="Play" text="Play" />
    },
    {
      key: 'CashDrop',
      component: <CashDrop key="CashDrop" {...props} />,
      menuItem: <Item icon="fas-cog" key="CashDrop" text="CashDrop" />
    },
    {
      key: 'Tokens',
      component: <Tokens key="Tokens" {...props} />,
      menuItem: <Item icon="fas-coins" key="Tokens" text="Tokens" />
    },

    {
      key: 'Wallet',
      component: <Wallet key="Wallet" {...props} />,
      menuItem: <Item icon="fa-wallet" key="Wallet" text="Wallet" />
    },
    {
      key: 'Send/Receive BCH',
      component: <SendReceive key="Send/Receive BCH" {...props} />,
      menuItem: (
        <Item
          icon="fa-exchange-alt"
          key="Send/Receive BCH"
          text="Send/Receive BCH"
        />
      )
    },
    {
      key: 'Configure',
      component: <Configure key="Configure" {...props} />,
      menuItem: <Item icon="fas-cog" key="Configure" text="Configure" />
    },

    /*     {
      key: 'TX History',
      component: <TXHistory key='TX History' {...props} />,
      menuItem: (
        <Item icon='fas-cog' key='TX History' text='TX History' />
      )
    }, */
    // {
    //   key: 'Demo Component',
    //   component: <DemoComponent key='Demo Component' {...props} />,
    //   menuItem: (
    //     <Item icon='fas-cog' key='Demo Component' text='Demo Component' />
    //   )
    // },
    // {
    //   key: 'View1',
    //   component: <View1 key='View1' {...props} />,
    //   menuItem: (
    //     <Item icon='fas-cog' key='View1' text='View1' />
    //   )
    // },
    // {
    //   key: 'View2',
    //   component: <View2 key='View2' {...props} />,
    //   menuItem: (
    //     <Item icon='fas-cog' key='View2' text='View2' />
    //   )
    // },
    {
      key: 'About',
      component: <About key='About' {...props} />,
      menuItem: (
        <Item icon='fas-cog' key='About' text='About' />
      )
    }
  ]
}

export default MenuComponents
