// Externals
import { BigNumber } from 'ethers'
// Locals
import {
  ocAddresses,
  OPTIMISM_GOERLI_CHAIN_ID,
  ARBITRUM_MAINNET_CHAIN_ID,
  ALCHEMY_ARBITRUM_PROVIDER_1,
} from '../../../utils/constants'
// Metadata
import { evmContracts } from '../../../utils/globalMetadata'
import { cl, uid } from '../../../utils/misc'
// Types
import { Web3UserType } from '../../../utils/types'
// Utils
import { getUSDCContract } from '../../utils'


/**
 * @notice Gets the allowance of `account`
 */
export async function allowance(
  web3User: Web3UserType,
  strategyName?: string | undefined,
  isOneClicks?: boolean | undefined,
  isArbi?: boolean | undefined
): Promise<Error | BigNumber> {
  if (web3User.account.address === null || web3User.account.address === undefined)
    return Error('Account not found!')

  let allowance_: BigNumber, spender: string | undefined

  const usdc = getUSDCContract(isArbi
    ? ARBITRUM_MAINNET_CHAIN_ID
    : web3User.chainId
  )
  const provider = isArbi
    ? ALCHEMY_ARBITRUM_PROVIDER_1
    : ALCHEMY_ARBITRUM_PROVIDER_1

  // Method arguments
  const owner = web3User.account.address

  spender = isOneClicks
    ? ocAddresses[isArbi ? 'arbitrum' : 'optimism']
    : strategyName !== undefined
      ? evmContracts.vaults[strategyName].address[
      isArbi || web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID
        ? 'arbitrum'
        : 'optimism'
      ][
      web3User.chainId === OPTIMISM_GOERLI_CHAIN_ID
        ? 'testnet'
        : 'mainnet'
      ]
      : undefined

  allowance_ = await usdc.connect(provider).allowance(owner, spender)
  return allowance_
}




/**
 * @notice Gets the balance of an account.
 */
export async function balanceOf(
  web3User: Web3UserType,
  isArbi: boolean
): Promise<BigNumber | Error> {
  if (web3User.account.address === null || web3User.account.address === undefined)
    return Error('Account not found!')

  let balanceOf_: BigNumber

  const provider = ALCHEMY_ARBITRUM_PROVIDER_1

  const usdc = getUSDCContract(isArbi
    ? ARBITRUM_MAINNET_CHAIN_ID
    : web3User.chainId
  )

  balanceOf_ = await usdc.connect(provider).balanceOf(web3User.account.address)
  return balanceOf_
}

