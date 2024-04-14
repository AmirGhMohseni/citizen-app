import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import React from 'react'
import { NftProvider } from 'use-nft'
import { WagmiConfig, createClient } from 'wagmi'
import { connectors, provider as externalProvider } from '../lib/connectors'
import { ErrorProvider } from '../components/ErrorProvider'
import Layout from '../components/Layout'
import '../styles/globals.css'

function App({ Component, pageProps }: any) {
  const [client, setClient] = useState<any>()

  useEffect(() => {
    let provider = externalProvider

    const userProvider =
      window.ethereum || (window as unknown as any).web3?.currentProvider
    console.log(userProvider)
    console.log(process.env.NEXT_PUBLIC_CHAIN)
    if (userProvider && process.env.NEXT_PUBLIC_CHAIN !== 'local') {
      provider = () => {
        console.log(
          `Provider: Connected to the user's provider on chain with ID ${parseInt(
            userProvider.networkVersion,
          )}`,
        )

        return ethers.getDefaultProvider(process.env.NEXT_PUBLIC_CHAIN, {
          infura: process.env.NEXT_PUBLIC_INFURA_ID,
          alchemy: process.env.NEXT_PUBLIC_ALCHEMY_ID,
          quorum: 1,
        });
      }
    }
    setClient(
      createClient({
        autoConnect: true,
        connectors,
        provider: provider(),
      }),
    )
  }, [])

  return (
    <>
      {client && (
        <WagmiConfig client={client}>
          <NftProvider fetcher={['ethers', { provider: externalProvider() }]}>
            <ErrorProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ErrorProvider>
          </NftProvider>
        </WagmiConfig>
      )}
    </>
  )
}

export default App
