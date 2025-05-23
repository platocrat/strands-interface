// Externals
import styled from "@emotion/styled";
import { BigNumber, ethers } from "ethers";
import Wei, { wei } from "@synthetixio/wei";
import { useParams } from "react-router-dom";
import { FC, useMemo, useState, useEffect, useLayoutEffect } from "react";
// Locals
import CustomInput from "./CustomInput";
import DWButtonText from "./DWButtonText";
import HeaderSection from "./HeaderSection";
import TxTernaries from "../../../components/TxTernaries";
import SocketBridge from "../../../components/SocketBridge";
import { OuterCard } from "../../../components/ProductInfo";
import PendingTxToast from "../../../components/Toasts/PendingTxToast";
import SuccessfulTxToast from "../../../components/Toasts/SuccessfulTxToast";
// APIs
import {
  getAllowanceForContract,
  balanceOf,
} from "../../../contract-apis/apis/erc20";
import { sendTx } from "../../../contract-apis/utils";
import {
  withdrawalsStruct,
  accountVaultBalance,
} from "../../../contract-apis/apis/strandsLyraVault";
// Misc utils
import {
  toBN,
  bnToNumber,
  nFormatter,
  fixedDecimals,
  web3UserIsUndefined,
  getVaultButtonState,
} from "../../../utils/misc";
// Types
import { MethodInfoType, TxSuspenseStateVarsType } from "../../../utils/types";
import { DepositWithdrawProps } from "../../../utils/props";
// Constants
import {
  INIT_ZERO,
  vaultInputMin,
  OPTIMISM_GOERLI_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  ARBITRUM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// CSS
import { cards, fonts } from "../../../theme/styles";
import { bsbc } from "../../../theme/componentStyles";

const isSocketPluginOneClicks = false;

const DepositWithdraw: FC<DepositWithdrawProps> = ({
  vault,
  amount,
  web3User,
  suspense,
  setAmount,
  assetSymbol,
  switchNetwork,
}) => {
  const { vaultName } = useParams(); // Page params
  const wrappedSymbol =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + assetSymbol;
  const quoteAsset =
    web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "USDC" : "sUSD";

  // ------------------------------- State vars --------------------------------
  // Number
  const [withdrawalRound_, setWithdrawalRound] = useState<number>(0);
  // Wei
  const [allowance_, setAllowance] = useState<BigNumber>(toBN(0));
  const [approvedAllowance, setApprovedAllowance] = useState<Wei>(wei(0));
  // BigNumbers
  const [quoteBalance, setQuoteBalance] = useState<BigNumber>(INIT_ZERO);
  // booleans
  const [pendingTxConfirmation, setPendingTxConfirmation] =
    useState<boolean>(false);
  const [isDeposit, setIsDeposit] = useState<boolean>(true);
  const [ctcCallReverted, setCtcCallReverted] = useState<boolean>(false);
  const [isCorrectChainId, setIsCorrectChainId] = useState<boolean>(false);
  const [openSocketPlugin, setOpenSocketPlugin] = useState<boolean>(false);
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false);
  // String
  const [txHash, setTxHash] = useState<string>("");
  const [revertMsg, setRevertMsg] = useState<string>("");

  //---------------------------- Constant booleans -----------------------------
  const canCompleteWithdrawal = useMemo((): boolean => {
    if (!web3UserIsUndefined(web3User)) {
      return (
        vault.withdrawalShares.gt(0) && withdrawalRound_ < vault.currentRound
      );
    } else {
      return false;
    }
  }, [
    amount,
    suspense.txConfirmed,
    withdrawalRound_,
    web3User.chainId,
    web3User.provider,
    vault.currentRound,
    vault.withdrawalShares,
    web3User.account.address,
  ]);
  const hasPendingWithdrawal = useMemo((): boolean => {
    if (!web3UserIsUndefined(web3User)) {
      return (
        withdrawalRound_ <= vault.currentRound &&
        vault.accountVaultBalance.eq(0) &&
        parseFloat(vault.withdrawalShares.toString()) / 1e18 > 0.0000001
      );
    } else {
      return false;
    }
  }, [
    vault.shares,
    web3User.chainId,
    withdrawalRound_,
    web3User.provider,
    vault.currentRound,
    suspense.txConfirmed,
    vault.withdrawalShares,
    web3User.account.address,
  ]);
  const isValidAmount = useMemo((): boolean => {
    return BigNumber.isBigNumber(amount)
      ? parseFloat(amount.toString()) / 1e18 > 0
      : amount > 0;
  }, [amount, web3User.chainId, web3User.provider, web3User.account.address]);
  const needGreaterAllowance = useMemo((): boolean => {
    if (!web3UserIsUndefined(web3User)) {
      return allowance_.lte(amount);
    } else {
      return false;
    }
  }, [
    amount,
    allowance_,
    web3User.chainId,
    web3User.provider,
    web3User.account.address,
  ]);
  const needMoreDepositAsset = useMemo((): boolean => {
    return BigNumber.isBigNumber(amount)
      ? quoteBalance.lt(amount)
      : bnToNumber(quoteBalance) < amount;
  }, [
    amount,
    quoteBalance,
    web3User.chainId,
    web3User.provider,
    suspense.txConfirmed,
    web3User.account.address,
  ]);
  const isPinkButton = useMemo(() => {
    if (pendingTxConfirmation || pendingUserAction) {
      return false;
    } else {
      return getVaultButtonState(
        web3User,
        {
          isDeposit: isDeposit,
          isValidAmount: isValidAmount,
          needMoreDepositAsset: needMoreDepositAsset,
          needGreaterAllowance: needGreaterAllowance,
          hasPendingWithdrawal: hasPendingWithdrawal,
          canCompleteWithdrawal: canCompleteWithdrawal,
        },
        amount,
        vault.shares,
        4
      );
    }
  }, [
    amount,
    isDeposit,
    vault.shares,
    web3User.chainId,
    web3User.provider,
    pendingUserAction,
    suspense.txConfirmed,
    hasPendingWithdrawal,
    pendingTxConfirmation,
    canCompleteWithdrawal,
    web3User.account.address,
  ]);
  const cursorPointer = useMemo((): string => {
    if (pendingTxConfirmation || pendingUserAction) {
      return "not-allowed";
    } else {
      return getVaultButtonState(
        web3User,
        {
          needMoreDepositAsset: needMoreDepositAsset,
          isDeposit: isDeposit,
          isValidAmount: isValidAmount,
          needGreaterAllowance: needGreaterAllowance,
          hasPendingWithdrawal: hasPendingWithdrawal,
          canCompleteWithdrawal: canCompleteWithdrawal,
        },
        amount,
        vault.shares,
        3
      );
    }
  }, [
    amount,
    isDeposit,
    vault.shares,
    web3User.chainId,
    web3User.provider,
    pendingUserAction,
    suspense.txConfirmed,
    hasPendingWithdrawal,
    pendingTxConfirmation,
    canCompleteWithdrawal,
    web3User.account.address,
  ]);
  const isButtonDisabled = useMemo((): boolean => {
    if (pendingTxConfirmation || pendingUserAction) {
      return true;
    } else {
      return getVaultButtonState(
        web3User,
        {
          isDeposit: isDeposit,
          isValidAmount: isValidAmount,
          needGreaterAllowance: needGreaterAllowance,
          needMoreDepositAsset: needMoreDepositAsset,
          hasPendingWithdrawal: hasPendingWithdrawal,
          canCompleteWithdrawal: canCompleteWithdrawal,
        },
        amount,
        vault.shares,
        2
      );
    }
  }, [
    amount,
    isDeposit,
    vault.shares,
    web3User.chainId,
    web3User.provider,
    pendingUserAction,
    hasPendingWithdrawal,
    suspense.txConfirmed,
    canCompleteWithdrawal,
    pendingTxConfirmation,
    web3User.account.address,
  ]);

  //------------------------- Regular function handlers ------------------------
  function handleMax(e: any): void {
    e.preventDefault();

    const quoteBalance_ = quoteBalance;
    const vaultShares_ = vault.shares;

    let input: any = document.getElementById("custom-input");

    if (isDeposit) {
      input.value = bnToNumber(quoteBalance_);
    } else {
      if (vaultShares_.eq(0)) {
        input.value = 0;
      } else if (parseFloat(vaultShares_.toString()) / 1e18 <= vaultInputMin) {
        input.value = bnToNumber(vaultShares_).toFixed(18);
      } else {
        input.value = parseFloat(vaultShares_.toString()) / 1e18;
      }
    }

    setAmount(
      isDeposit ? quoteBalance_ : vaultShares_.eq(0) ? toBN(0) : vaultShares_
    );
  }

  function onAmountChange(value: string) {
    setAmount(
      value === ""
        ? 0
        : parseFloat(value) < 1
        ? parseFloat(value)
        : parseFloat(value)
    );
  }

  function handleSwitchNetwork(e: any): void {
    if (!isCorrectChainId) switchNetwork?.(OPTIMISM_MAINNET_CHAIN_ID);
  }

  function handleSocketPlugin(e: any) {
    e.preventDefault();
    setOpenSocketPlugin(true);
  }

  //------------------------- Tx function handlers -----------------------------
  async function handleDeposit(e: any, methodName = "deposit"): Promise<void> {
    e.preventDefault();

    setCtcCallReverted(false);

    const methodInfo: MethodInfoType = {
      ctcName: "StrandsLyraVault",
      methodName: methodName,
      isApproval: false,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: setTxHash,
      setRevertMsg: setRevertMsg,
      setTxConfirmed: suspense.setTxConfirmed,
      setCtcCallReverted: setCtcCallReverted,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };

    const limiters = [isCorrectChainId, isValidAmount];
    const txArguments: any = {
      amount: BigNumber.isBigNumber(amount)
        ? amount
        : ethers.utils.parseUnits(amount.toString(), 18),
      web3User: web3User,
      vaultName: vaultName,
    };

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
    // update quote balance
    getQuoteBalanceOf();
  }

  async function handleInitiateWithdraw(
    e: any,
    methodName = "initiateWithdraw"
  ) {
    e.preventDefault();

    setCtcCallReverted(false);

    const methodInfo: MethodInfoType = {
      ctcName: "StrandsLyraVault",
      methodName: methodName,
      isApproval: false,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: setTxHash,
      setRevertMsg: setRevertMsg,
      setTxConfirmed: suspense.setTxConfirmed,
      setCtcCallReverted: setCtcCallReverted,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };
    const limiters = [isCorrectChainId, isValidAmount];
    const txArguments: any = {
      web3User: web3User,
      numShares: BigNumber.isBigNumber(amount)
        ? amount
        : ethers.utils.parseUnits(amount.toString(), 18),
      vaultName: vaultName,
    };

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
  }

  async function handleCompleteWithdraw(
    e: any,
    methodName = "completeWithdraw"
  ) {
    e.preventDefault();

    setCtcCallReverted(false);

    const methodInfo: MethodInfoType = {
      ctcName: "StrandsLyraVault",
      methodName: methodName,
      isApproval: false,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: setTxHash,
      setRevertMsg: setRevertMsg,
      setTxConfirmed: suspense.setTxConfirmed,
      setCtcCallReverted: setCtcCallReverted,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };
    const limiters = [isCorrectChainId, true];
    const txArguments: any = {
      web3User: web3User,
      vaultName: vaultName,
    };

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
  }

  async function handleApproveDepositAsset(e: any, methodName = "approve") {
    e.preventDefault();

    setCtcCallReverted(false);

    const methodInfo: MethodInfoType = {
      ctcName: vaultName === "coveredCall" ? wrappedSymbol : quoteAsset,
      methodName: methodName,
      isApproval: true,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: setTxHash,
      setRevertMsg: setRevertMsg,
      setCtcCallReverted: setCtcCallReverted,
      setTxConfirmed: suspense.setTxConfirmed,
      setApprovedAllowance: setApprovedAllowance,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };

    const defaultAllowance = ethers.utils.parseUnits(
      "50000",
      web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? 6 : 18
    );
    const limiters = [isCorrectChainId, isValidAmount];
    const txArguments: any = {
      amount: defaultAllowance,
      web3User: web3User,
      vaultName: vaultName,
      approveAmountBuffer: wei(1).bn,
    };

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
    await getAllowance();
  }

  async function handleOnSubmit(e: any) {
    e.preventDefault();

    /**
     * @todo This could be simplified by some kind of tree...
     *
     *                                         web3UserIsUndefined(web3User)
     *                                        /                             \
     *                          isDeposit                                    !isDeposit
     *            /            /          |          \             \                       \
     *     (if label #2)   needMoreDepositAsset   (if label #3)   else       canCompleteWithdrawal    !canCompleteWithdrawal
     *     /                |             |             |                    |                            \
     *   0   handleSocketPlugin()  handleApproveSETH()  handleDeposit()  handleCompleteWithdraw()        hasPendingWithdraw
     *                                                                                                /             \ .             \
     *                                                                                              0             ( if label #3) .  (if label #4)
     *                                                                                                            /                    \
     *                                                                                                           0                   handleInitiateWithdraw()
     */
    if (web3UserIsUndefined(web3User)) {
      e.preventDefault();
    } else {
      if (isDeposit) {
        // if label #2
        if (
          BigNumber.isBigNumber(amount)
            ? amount.eq(0) ||
              parseFloat(amount.toString()) / 1e18 <= 0.000000999999999999999999
            : amount === 0 || amount <= 0.0000009999999999
        ) {
          e.preventDefault();
        } else if (needMoreDepositAsset) {
          e.preventDefault();
          return handleSocketPlugin(e);
          // if label #3
        } else if (needGreaterAllowance) {
          e.preventDefault();
          return handleApproveDepositAsset(e);
        } else {
          e.preventDefault();
          return handleDeposit(e);
        }
      } else {
        if (canCompleteWithdrawal) {
          e.preventDefault();
          return handleCompleteWithdraw(e);
        } else {
          if (hasPendingWithdrawal) {
            e.preventDefault();
          } else {
            // if label #3
            if (
              BigNumber.isBigNumber(amount)
                ? amount.eq(0) ||
                  parseFloat(amount.toString()) / 1e18 <=
                    0.000000999999999999999999
                : amount === 0 || amount <= 0.000000999999999999999999
            ) {
              e.preventDefault();
            } else {
              // if label #4
              if (
                BigNumber.isBigNumber(amount)
                  ? parseFloat(amount.toString()) / 1e18 <=
                    parseFloat(vault.shares.toString()) / 1e18
                  : amount <= parseFloat(vault.shares.toString()) / 1e18
              ) {
                e.preventDefault();
                return handleInitiateWithdraw(e);
              } else {
                e.preventDefault();
              }
            }
          }
        }
      }
    }
  }

  //------------------------- Async function getters ---------------------------
  async function getAllowance(): Promise<void> {
    if (!web3UserIsUndefined(web3User)) {
      let _allowance: BigNumber | Error;
      const quoteAsset =
        web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "USDC" : "sUSD";
      const baseAsset =
        (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") +
        assetSymbol;

      vaultName === "coveredCall"
        ? (_allowance = await getAllowanceForContract(
            web3User,
            web3User.chainId,
            baseAsset,
            false,
            vaultName as string
          ))
        : (_allowance = await getAllowanceForContract(
            web3User,
            web3User.chainId,
            quoteAsset,
            false,
            vaultName as string
          ));

      if (BigNumber.isBigNumber(_allowance)) setAllowance(_allowance);
    }
  }

  async function getQuoteBalanceOf(): Promise<void> {
    if (!web3UserIsUndefined(web3User)) {
      let balanceOf_: BigNumber | Error;

      const quoteAsset =
        web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "USDC" : "sUSD";
      const baseAsset =
        (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") +
        assetSymbol;

      vaultName === "coveredCall"
        ? (balanceOf_ = await balanceOf(web3User, web3User.chainId, baseAsset))
        : (balanceOf_ = await balanceOf(
            web3User,
            web3User.chainId,
            quoteAsset
          ));

      if (BigNumber.isBigNumber(balanceOf_)) setQuoteBalance(balanceOf_);
    }
  }

  async function getWithdrawalsStruct(): Promise<void> {
    if (!web3UserIsUndefined(web3User)) {
      const _withdrawalsStruct = (await withdrawalsStruct(
        web3User,
        vaultName as string
      )) as any;
      setWithdrawalRound(_withdrawalsStruct.round);
      vault.setWithdrawalShares(_withdrawalsStruct.shares);
    }
  }

  async function getAccountVaultBalance(): Promise<void> {
    if (!web3UserIsUndefined(web3User)) {
      const _accountVaultBalance = (await accountVaultBalance(
        web3User,
        vaultName as string
      )) as BigNumber;
      vault.setAccountVaultBalance(_accountVaultBalance);
    }
  }

  // --------------------------- Function getters ------------------------------
  function getIsRoundInProgress() {
    vault.setIsRoundInProgress(vault.vaultState.roundInProgress);
  }

  // //----------------------------  useEffect hooks ------------------------------
  // /**
  //  * @dev Updates `allowance` only when a new `approvedAllowance` is detected
  //  */
  // useEffect(() => {
  //   if (!web3UserIsUndefined(web3User)) setAllowance(approvedAllowance);
  // }, [approvedAllowance]);

  //---------------------------- useLayoutEffect hooks -------------------------
  useLayoutEffect(() => {
    setIsCorrectChainId(
      web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ||
        web3User.chainId === OPTIMISM_MAINNET_CHAIN_ID
    );
  }, [web3User.provider.network.name, web3User.provider.network.chainId]);

  /**
   * @dev Updates only when `amount`, `suspense.txConfirmed`, and `web3User` changes
   */
  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      // Regular functions
      getIsRoundInProgress();

      const requests = [
        getQuoteBalanceOf(),
        getWithdrawalsStruct(),
        getAccountVaultBalance(),
      ];

      Promise.all(requests).then((response: any) => {});
    }
  }, [
    vaultName,
    suspense.txConfirmed,
    vault.vaultState.round,
    web3User.account.address,
    web3User.provider.network.name,
    vault.vaultState.roundInProgress,
    web3User.provider.network.chainId,
  ]);

  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      const requests = [getAllowance()];

      Promise.all(requests).then((response: any) => {});
    }
  }, [
    vaultName,
    suspense.txConfirmed,
    web3User.account.address,
    web3User.provider.network.name,
    web3User.provider.network.chainId,
  ]);

  /**
   * @dev Updates only when the page initially loads
   */
  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User)) {
      getIsRoundInProgress();

      const requests = [
        getAllowance(),
        getQuoteBalanceOf(),
        getWithdrawalsStruct(),
        getIsRoundInProgress(),
        getAccountVaultBalance(),
      ];

      Promise.all(requests).then((response: any) => {});
    }
  }, []);

  // Reset `amount` to 0 and clear input value when the user switches between
  // `Deposit` and `Withdraw`.
  useLayoutEffect(() => {
    setAmount(0);
    //const input: any = document.getElementById('custom-input')
  }, [isDeposit]);

  return (
    <>
      <DepositWithdrawSection>
        <Card style={{ backdropFilter: cards.blur }}>
          <OuterCard>
            <HeaderSection isDeposit={isDeposit} setIsDeposit={setIsDeposit} />

            <CardContent autoComplete="off">
              <>
                {canCompleteWithdrawal && !isDeposit ? null : (
                  <>
                    <Section>
                      <div className="text">Amount</div>
                      <AmountInputSection>
                        <AmountInputWrapper>
                          <CustomInput
                            id="custom-input"
                            placeholder="0.0"
                            step={0.000000001}
                            disabled={!isCorrectChainId}
                            onChange={(e: any, v: any) => onAmountChange(v)}
                          />
                          <MaxButtonWrapper>
                            <MaxButton
                              id="max-button"
                              onClick={(e: any) => handleMax(e)}
                            >
                              {`Max`}
                            </MaxButton>
                          </MaxButtonWrapper>
                        </AmountInputWrapper>
                      </AmountInputSection>
                    </Section>

                    {isDeposit ? (
                      <>
                        <Section>
                          <div
                            className="text"
                            style={{ fontSize: fonts.sizes.biggieSmalls }}
                          >
                            {`Balance`}
                          </div>
                          <div
                            className="text"
                            style={{
                              fontSize: fonts.sizes.biggieSmalls,
                              color: fonts.colors.solid.white,
                            }}
                          >
                            <span
                              style={{
                                color: "inherit",
                                margin: "0px",
                                textDecoration: "none",
                                fontSize: fonts.sizes.biggieSmalls,
                              }}
                            >
                              {/**
                               * @todo Refactor: truncate the balance amount with an
                               * ellipsis (e.g. `0.54...341 sETH`) but make the value
                               * clickable. Once clicked, the value will expand to show
                               * the a long-form version of the value, up to 8 decimal
                               * places.
                               */}
                              {`${nFormatter(
                                bnToNumber(
                                  quoteBalance.eq(0)
                                    ? 0
                                    : quoteBalance.toString()
                                ),
                                fixedDecimals(
                                  bnToNumber(
                                    quoteBalance.eq(0)
                                      ? 0
                                      : quoteBalance.toString()
                                  ),
                                  6
                                )
                              )} ${
                                vaultName === "coveredCall"
                                  ? assetSymbol
                                  : "sUSD"
                              }`}
                            </span>
                          </div>
                        </Section>
                      </>
                    ) : (
                      <>
                        <Section>
                          <div
                            className="text"
                            style={{ fontSize: fonts.sizes.biggieSmalls }}
                          >
                            {`Withdrawable Balance`}
                          </div>
                          <div
                            className="text"
                            style={{
                              fontSize: fonts.sizes.biggieSmalls,
                              color: fonts.colors.solid.white,
                            }}
                          >
                            <span
                              style={{
                                color: "inherit",
                                margin: "0px",
                                textDecoration: "none",
                                fontSize: fonts.sizes.biggieSmalls,
                              }}
                            >
                              {/**
                               * @todo Refactor: truncate the balance amount with an
                               * ellipsis (e.g. `0.54...341 sETH`) but make the value
                               * clickable. Once clicked, the value will expand to show
                               * the a long-form version of the value, up to 8 decimal
                               * places.
                               */}
                              {`${nFormatter(
                                vault.shares.eq(0)
                                  ? 0
                                  : bnToNumber(vault.shares),
                                fixedDecimals(
                                  vault.shares.eq(0)
                                    ? 0
                                    : bnToNumber(vault.shares),
                                  6
                                )
                              )} shares`}
                            </span>
                          </div>
                        </Section>
                      </>
                    )}
                  </>
                )}
              </>
            </CardContent>

            {/* Start a withdrawal button */}
            <CardContent
              autoComplete="off"
              onSubmit={(e: any) => handleOnSubmit(e)}
            >
              <>
                {/* Web3 button */}
                <ButtonContainer>
                  <>
                    {isCorrectChainId ? (
                      <>
                        <DWButton
                          type="submit"
                          disabled={isButtonDisabled}
                          className={`${isPinkButton}`}
                          style={{ cursor: cursorPointer }}
                        >
                          <TxTernaries
                            conditional1={pendingUserAction}
                            conditional2={pendingTxConfirmation}
                          >
                            <DWButtonText
                              amount={amount}
                              web3User={web3User}
                              shares={vault.shares}
                              vaultName={vaultName as string}
                              statesAndBalances={{
                                isDeposit: isDeposit,
                                isValidAmount: isValidAmount,
                                needMoreDepositAsset: needMoreDepositAsset,
                                hasPendingWithdrawal: hasPendingWithdrawal,
                                needGreaterAllowance: needGreaterAllowance,
                                canCompleteWithdrawal: canCompleteWithdrawal,
                              }}
                            />
                          </TxTernaries>
                        </DWButton>
                      </>
                    ) : (
                      <NetworkButton
                        onClick={(e: any) => handleSwitchNetwork(e)}
                      >
                        {`Switch to Optimism`}
                      </NetworkButton>
                    )}

                    {/** @todo Refactor error message to its own component */}
                    {ctcCallReverted && (
                      <>
                        <h2
                          style={{
                            color: "#fc5151",
                            textAlign: "center",
                            marginTop: "15px",
                          }}
                        >
                          {`⛔️ ${revertMsg}`}
                        </h2>
                      </>
                    )}
                  </>
                </ButtonContainer>
              </>
            </CardContent>
          </OuterCard>
        </Card>
      </DepositWithdrawSection>

      {openSocketPlugin ? (
        <>
          <SocketBridge
            provider={web3User.provider}
            isOneClicks={isSocketPluginOneClicks}
            setOpenSocketPlugin={setOpenSocketPlugin}
          />
        </>
      ) : null}

      {/* Toasts */}
      <>
        <PendingTxToast
          txHash={txHash}
          isCloseable={false}
          pending={pendingTxConfirmation}
        />
        <SuccessfulTxToast pending={suspense.txConfirmed} txHash={txHash} />
      </>
    </>
  );
};

export const DWButton = styled.button`
  @media screen and (max-width: 900px) {
    border: none;
    padding: 0px;
  }

  margin-right: auto;
  margin-left: auto;

  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 46px;
  width: 210px;
  opacity: 1;
  appearance: none;

  padding: 8px 2px;

  border-image: initial;
  border-width: 1px;
  border-style: solid;
  border-color: ${fonts.colors.transparent.darkerPink};
  border-radius: 99999px;
  border-radius: ${bsbc.borderRadius};

  color: ${bsbc.color};
  backdrop-filter: ${bsbc.backdropFilter};
  box-shadow: ${(props) => (props.className === "true" ? bsbc.boxShadow : "")};

  outline: none;
  font-family: Sohne, sans-serif;
  font-weight: 600;
  font-size: ${fonts.sizes.biggieSmalls};

  text-align: center;
  line-height: inherit;
  text-decoration: none;

  transition: 0.2s ease-in-out;

  :hover {
    transition: 0.1s ease;
    opacity: ${(props) => (props.className === "true" ? "0.8" : "")};
    transform: ${(props) =>
      props.className === "true" ? "scaleX(0.99) scaleY(0.99)" : ""};
    background-color: ${(props) =>
      props.className === "true" ? fonts.colors.solid.darkPink : ""};
  }

  :active {
    transition: 0.1s ease;
    border-style: ${(props) => (props.className === "true" ? "inset" : "")};
    border-width: ${(props) => (props.className === "true" ? "3.5px" : "")};
    opacity: ${(props) => (props.className === "true" ? "1" : "")};
    transform: ${(props) =>
      props.className === "true" ? "scaleX(0.98) scaleY(0.98)" : ""};
    background-color: ${(props) =>
      props.className === "true" ? "rgba(94, 72, 86, 0.5)" : ""};
    box-shadow: ${(props) =>
      props.className === "true"
        ? "0px 0px 15px rgba(253, 172, 205, 0.9)"
        : ""};
  }
`;

export const NetworkButton = styled.button`
  @media screen and (max-width: 900px) {
    border: none;
    padding: 0px;

    height: 52px;

    width: 350px;
  }

  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 56px;
  width: 100%;
  opacity: 1;
  margin: 0px 0px 12px;
  appearance: none;
  padding: 8px 12px;

  border-image: initial;
  border-width: 1px;
  border-style: solid;
  border-color: #1f242999;

  font-family: Sohne, sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #b5beca;
  background-color: #1f242999;

  text-align: center;
  text-decoration: none;
  line-height: inherit;

  border-radius: 99999px;
  cursor: pointer;
  :hover {
    background-color: #1d2124;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: -45px; // use this ONLY when the delay elements are removed
  // margin: 8px 0px 0px;
  display: grid;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
`;

const MaxButton = styled.button`
  appearance: none;
  text-align: center;
  line-height: inherit;
  text-decoration: none;
  padding: 8px;
  border: 1px solid transparent;
  font-family: InterVariable, sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border-radius: 99999px;
  height: 28px;
  background-color: transparent;
  color: #ffffff;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  opacity: 1;
`;

const MaxButtonWrapper = styled.div`
  margin: 0px 8px 0px 0px;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const AmountInputWrapper = styled.div`
  font-family: InterVariable, sans-serif;
  background-color: #1f242999;
  border-radius: 18px;
  border: 1px solid transparent;
  min-height: 35px;
  cursor: text;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
`;

const AmountInputSection = styled.div`
  position: relative;
  width: 50%;
`;

const Section = styled.div`
  margin: 0px 0px 16px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  display: flex;
`;

const CardContent = styled.form`
  border-bottom-width: 3px;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  flex-direction: column;
  padding: 24px;
  display: flex;
`;

const Card = styled.div`
  border-radius: 28px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  text-decoration: none;
  background-color: #1f242980;
  position: relative;
  flex-direction: column;
  overflow: hidden auto;
  display: flex;
`;

export const DepositWithdrawSection = styled.div`
  @media screen and (max-width: 901px) {
    display: none;
  }

  position: sticky;
  top: 64px;
  max-height: 80vh;
  min-width: 360px;
  width: 360px;
`;

export default DepositWithdraw;
