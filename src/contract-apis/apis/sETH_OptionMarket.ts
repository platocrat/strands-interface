// Externals
import { ethers, Signer } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { GetAccountResult, Provider } from "@wagmi/core";
// Locals
import { clErrors, clTx } from "../utils";
// Constants
import { sETH_OPTION_MARKET_OPTIMISM_MAINNET } from "../../utils/constants";
// Types
import { OptionMarket } from "../types/OptionMarket";
// Artifacts
import OptionMarket__ABI from "../artifacts/OptionMarket.json";

/**
 * @notice Approves sETH spends from msg.sender.
 */
export async function approve(
  // Web3 user variables
  account: GetAccountResult<Provider>,
  chainId: number,
  provider: Provider,
  // Vars to get vault contract
  vaultName: string,
  // Method variables
  value: BigNumber
) {
  if (account.address === null || account.address === undefined)
    return Error("Account not found!");

  let approve_, sETH_OptionMarket: OptionMarket;

  console.log("sETH_OptionMarket approve");

  sETH_OptionMarket = new ethers.Contract(
    sETH_OPTION_MARKET_OPTIMISM_MAINNET,
    OptionMarket__ABI
  ) as OptionMarket;

  const signer: Signer = await account.connector?.getSigner();

  try {
    approve_ = await sETH_OptionMarket.connect(signer);

    clTx(chainId, "approve()", approve_);

    return approve_;
  } catch (error: any) {
    return clErrors(error, "approve()");
  }
}
