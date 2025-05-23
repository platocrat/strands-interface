// Externals
import { BigNumber } from 'ethers'
import { useProvider } from 'wagmi'
import { wei } from '@synthetixio/wei'
import { Board, Option } from '@lyrafinance/lyra-js'
import { Dispatch, FC, SetStateAction, useEffect, useLayoutEffect, useMemo, useState } from 'react'
// Locals
import { Std } from '..'
import CustomizeSpreadExpiry from './expiry'
import CustomizeSpreadStrike from './strike'
// Utils
import { lyra } from '../../../../utils/lyra'
import { getLots } from '../../../../utils/one-clicks'
import { getMarketAddress } from '../../../../contract-apis/utils'
import { getMinCollateralForSpotPrice } from '../../../../utils/from-lyra'
// Constants
import { ocStrategyConfigs } from '../../../../utils/constants'
// Types
import { ocLegType, ocType } from '../../../../utils/types'
// CSS
import { selectorStyle } from '../../../../theme/componentStyles'
import { cl } from '../../../../utils/misc'






export type CustomizeSpreadProps = {
  oneClick: ocType
  assetSymbol: string
  liveBoards: Board[]
  oneClickIndex: number
  suspense: {
    liveBoardsLoading: boolean
  }
  legState: {
    liveExpiries: string[]
    selectedSizes: number[]
    defaultExpiry: string
    selectedLiqPrices: number[]
    collaterals: { [key: string]: BigNumber }
    getExpiryAtBoard: (boardId: number) => string | -1
    setSelectedExpiries: Dispatch<SetStateAction<any>>
    setSelectedSizes: Dispatch<SetStateAction<number[]>>
    selectedExpiries: string[] | { [key: string]: string }
    handleSelectStrike: (e: any, legIndex: number) => void
    handleSelectExpiry: (e: any, legIndex: number) => void
    setSelectedLiqPrices: Dispatch<SetStateAction<number[]>>
    defaultStrikes?: { strikeId: number, strikePrice: number }[]
    selectedStrikes: { strikeId: number, strikePrice: number }[]
    setCollaterals: Dispatch<SetStateAction<{ [key: string]: BigNumber }>>
    strikesAtExpiry: (expiry: string) => {
      strikeId: number
      strikePrice: number
    }[]
  }
}



const CustomizeSpread: FC<CustomizeSpreadProps> = ({
  legState,
  oneClick,
  suspense,
  liveBoards,
  assetSymbol,
  oneClickIndex,
}) => {
  // const provider = useProvider()

  const comboBottomPosition = oneClickIndex === 0 ? '8px' : ''


  // async function getOption(
  //   _isCall: boolean,
  //   _strikeId: number
  // ): Promise<Option> {
  //   const chainId = provider.network.chainId
  //   const marketAddress = getMarketAddress(chainId, assetSymbol)
  //   const strikeId = parseFloat(_strikeId.toString())

  //   const option = await lyra.option(marketAddress, strikeId, _isCall)
  //   return option
  // }


  // async function getMinCollateralsFromLiqPrices(): Promise<void> {
  //   let collaterals_: { [key: string]: BigNumber } = {}

  //   const amounts = Object.values(legState.selectedSizes)
  //   const liqPrices = Object.values(legState.selectedLiqPrices).map(
  //     (lP: number): BigNumber => wei(lP).bn
  //   )
  //   const sizes = amounts.map((a: number): BigNumber => getLots(a))

  //   const ocStrategyConfig = ocStrategyConfigs[oneClick.strategyName]

  //   // What we had used before in 1Click bid-ask menu
  //   // const isLong: boolean = isBid
  //   //   ? ocStrategyConfig[i][0] as boolean
  //   //   : !ocStrategyConfig[i][0] as boolean
  //   const isCall: boolean = ocStrategyConfig[legIndex][1] as boolean
  //   const strikeId: number = (
  //     (
  //       legState.selectedStrikes[legIndex] as unknown
  //     ) as { strikeId: number, strikePrice: string }
  //   ).strikeId

  //   const option = await getOption(isCall, strikeId)
  //   const minCollateral = getMinCollateralForSpotPrice(
  //     option,
  //     sizes[legIndex],
  //     liqPrices[legIndex],
  //   ) as BigNumber

  //   collaterals_ = { ...legState.collaterals, [`${legIndex}`]: minCollateral }

  //   legState.setCollaterals(collaterals_)
  // }

  // // --------------------------- `useEffect`s ----------------------------
  // useEffect(() => {
  //   const requests = [
  //     getMinCollateralsFromLiqPrices(),
  //   ]
  //   Promise.all(requests).then((response: any) => { })
  // }, [
  //   legState.selectedSizes,
  //   legState.selectedStrikes,
  //   legState.selectedExpiries,
  //   legState.selectedLiqPrices,
  // ])


  // Update expiry of the second leg when the expiry of the first changes
  useEffect(() => {
    const id = `c-spread-select-expiry-${1}`
    const secondExpiry: any = document.getElementById(id)

    try {
      secondExpiry.value = legState.selectedExpiries[0]
    } catch (error) {
      console.error(`Error!  `, error)
    }
  }, [legState.selectedExpiries])


  // useLayoutEffect(() => {
  //   let defaultStrike0: { strikeId: number, strikePrice: string } = {
  //     strikeId: 0,
  //     strikePrice: '$0.00'
  //   },
  //     defaultStrike1: { strikeId: number, strikePrice: string } = {
  //       strikeId: 0,
  //       strikePrice: '$0.00'
  //     }

  //   if (oneClick.legs[1] && liveBoards.length > 1 && legState.defaultExpiry) {
  //     const firstOCStrikeId = oneClick.legs[0].strikeId
  //     const secondOCStrikeId = oneClick.legs[1].strikeId

  //     const defaultExpiry_ = legState.selectedExpiries[0]
  //     cl('defaultExpiry_: ', defaultExpiry_)

  //     // `f`irst `l`eg `d`efault strike id
  //     const fldStrikeIdIndex = legState.strikesAtExpiry(defaultExpiry_).findIndex(
  //       (strike: { strikeId: number, strikePrice: string }): boolean => {
  //         return strike.strikeId === firstOCStrikeId
  //       }
  //     )
  //     // `s`econd `l`eg `d`efault strike id 
  //     const sldStrikeIdIndex = legState.strikesAtExpiry(defaultExpiry_).findIndex(
  //       (strike: { strikeId: number, strikePrice: string }): boolean => {
  //         return strike.strikeId === secondOCStrikeId
  //       }
  //     )

  //     defaultStrike0 = legState.strikesAtExpiry(defaultExpiry_)[fldStrikeIdIndex]
  //     defaultStrike1 = legState.strikesAtExpiry(defaultExpiry_)[sldStrikeIdIndex]
  //   }
  // }, [])




  return (
    <>
      <Std role='cell' style={ { fontSize: '13px' } }>
        <div
          style={ {
            right: '30px',
            position: 'relative',
            bottom: comboBottomPosition,
          } }
        >
          <div style={ { display: 'flex', flexDirection: 'row' } }>
            <div style={ { display: 'flex', flexDirection: 'row' } }>
              {/**
                * @todo Need to reverse the order of legs for strike prices
                */
              }
              { oneClick.legs.reverse().map((leg: ocLegType, legIndex: number) => (
                <>
                  <div style={ selectorStyle }>
                    <label
                      style={ {
                        padding: '5px 20px',
                        backgroundColor: 'red'
                      } }
                    >
                      { oneClick.legs[legIndex].isCall ? `C` : `P` }
                    </label>
                    {/* Expiry */ }
                    <CustomizeSpreadExpiry
                      oneClick={ oneClick }
                      legIndex={ legIndex }
                      legState={ {
                        liveExpiries: legState.liveExpiries,
                        getExpiryAtBoard: legState.getExpiryAtBoard,
                        selectedExpiries: legState.selectedExpiries,
                        handleSelectExpiry: legState.handleSelectExpiry,
                      } }
                    />
                    {/* Strike */ }
                    <CustomizeSpreadStrike
                      leg={ leg }
                      oneClick={ oneClick }
                      legIndex={ legIndex }
                      legState={ {
                        defaultExpiry: legState.defaultExpiry as any,
                        // defaultStrikes: legState.defaultStrikes as any,
                        strikesAtExpiry: legState.strikesAtExpiry,
                        selectedExpiries: legState.selectedExpiries,
                        handleSelectStrike: legState.handleSelectStrike,
                      } }
                    />
                  </div>
                </>
              )) }
            </div>
          </div>
        </div>
      </Std>
    </>
  )
}


export default CustomizeSpread