// Externals
import {
  FC,
  memo,
  useMemo,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";
import { ethers } from "ethers";
import Wei, { wei } from "@synthetixio/wei";
import { Board, Option } from "@lyrafinance/lyra-js";
import { BigNumber } from "@ethersproject/bignumber";
import { useAccount, useNetwork, useProvider } from "wagmi";
// Locals
import QuickMenu from "./QuickMenu";
import QuickMenuButton from "./QuickMenuButton";
import QuotePrice, { getTotalCost } from "./QuotePrice";
import OneClickOptionLegs from "../../OptionLegs/1Clicks";
// Contexts
import { ocqmsContext } from "../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../contexts/OneClickContext";
import { UnderlierContext } from "../../../contexts/UnderlierContext";
import { EVMTxSuspenseContext } from "../../../contexts/EVMTxSuspense";
import { BidAskMenuContext } from "../../../contexts/BidAskMenuContext";
import { LyraOptionDataContext } from "../../../contexts/LyraOptionDataContext";
// APIs
import { OneClicks } from "../../../contract-apis/types/OneClicks";
import { allowance, balanceOf } from "../../../contract-apis/apis/sUSD";
import { getMarketAddress, sendTx } from "../../../contract-apis/utils";
import { isApprovedForAll } from "../../../contract-apis/apis/optionToken";
// Requests
import { getStrategyBidAsk } from "../../../utils/requests/one-clicks";
// Utils
import { lyra } from "../../../utils/lyra";
import { getLots } from "../../../utils/one-clicks";
import getMinCollateralForSpotPrice from "../../../utils/from-lyra";
import {
  cl,
  toBN,
  debounce,
  bnToNumber,
  web3UserIsUndefined,
} from "../../../utils/misc";
// Props
import { BidAskMenuProps } from "../../../utils/props";
// Constants
import {
  MIN_COLLATERAL,
  liqPriceBuffer,
  ocStrategyConfigs,
  estimatedCostBuffer,
  initLegDetailsStruct,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// Types
import {
  ocLegType,
  Web3UserType,
  MethodInfoType,
  TxSuspenseStateVarsType,
} from "../../../utils/types";

const BidAskMenu: FC<BidAskMenuProps> = ({ isBuy, handleSocketPlugin }) => {
  const { currentAssetPrice } = useContext(LyraOptionDataContext);
  const {
    setTxHash,
    txConfirmed,
    setTxConfirmed,
    pendingTxConfirmation,
    setPendingTxConfirmation,
  } = useContext(EVMTxSuspenseContext);
  const { assetSymbol } = useContext(UnderlierContext);
  const { ocQuickMenuState } = useContext(ocqmsContext);
  const { oneClick, oneClickIndex } = useContext(OneClickContext);
  const {
    liqPrices,
    collaterals,
    setLiqPrices,
    finalPositions,
    setCollaterals,
    setFinalPositions,
    existingPositions,
    existingPositionsLoaded,
  } = useContext(BidAskMenuContext);

  const account = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

  let web3User: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  // Wei
  const [allowance_, setAllowance] = useState<Wei>(wei(0));
  const [approvedAllowance, setApprovedAllowance] = useState<Wei>(wei(0));
  // numbers
  const [size, setSize] = useState<number>(1);
  const [ocQuote, setOCQuote] = useState<number>(0);
  const [quoteBalance, setQuoteBalance] = useState<number>(0);
  // boolean
  const [ctcCallReverted, setCtcCallReverted] = useState<boolean>(false);
  const [isApprovedForAll_, setIsApprovedForAll] = useState<boolean>(false);
  const [quoteDataIsLoaded, setQuoteDataIsLoaded] = useState<boolean>(false);
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false);
  // String
  const [revertMsg, setRevertMsg] = useState<string>("");

  const legs = oneClick.legs;
  const isValidAmount = size > 0;

  let boardIds: number[] = [],
    expiries: string[] = [],
    strikeIds: number[] = [];

  legs.forEach((leg: ocLegType): void => {
    boardIds.push(leg.boardId);
    expiries.push(leg.expiry.toDateString());
    strikeIds.push(leg.strikeId);
  });

  const onSizeChange = (e: any): void =>
    setSize(parseFloat(e.target.value ?? "0"));

  // debounce for 500ms
  const debouncedOnSizeChange = useMemo(
    (): ((...args: any) => void) => debounce(onSizeChange, 1_000),
    [size]
  );

  /**
   * @dev Update state of liquidation price.
   * @notice Liquidation price is used to fetch the necessary collateral for the
   * given liquidation price.
   */
  const onLiqPriceChange = (
    e: any,
    i: number,
    isBuy: boolean,
    isCall: boolean
  ): void => {
    let _liqPrices = [...liqPrices];

    if (isNaN(parseFloat(e.target.value))) {
      _liqPrices[i] = 0;
    } else {
      let liqPrice = parseFloat(e.target.value);

      const scalingFactor = isCall
        ? 1 + liqPriceBuffer // 5% above spot price for calls
        : 1 - liqPriceBuffer; // 5% below spot price for puts

      let defaultLiqPrice = currentAssetPrice * scalingFactor;
      defaultLiqPrice = parseFloat(defaultLiqPrice.toFixed(2));

      //cl(`onLiqPriceChange: leg[%s] liqPrice=%s (default=%s, spotPrice=%s)`,
      // i, liqPrice, defaultLiqPrice,currentAssetPrice)

      if (
        isCall
          ? liqPrice < defaultLiqPrice - 0.01
          : liqPrice > defaultLiqPrice - 0.01
      ) {
        // cl('setting liqPrice to default')
        liqPrice = defaultLiqPrice;

        // to update liquidation price value on display
        const bidOrAsk = isBuy ? "ask" : "bid";
        const liqPriceId = `${i}-${oneClick.strategyName}-${bidOrAsk}-quick-menu-input`;

        let liqPriceDisplay: any;
        // First, set collateral value
        liqPriceDisplay = document.getElementById(liqPriceId);
        // change slider value and liqPrice value to default liq price
        liqPriceDisplay.style.border = "0.5px solid red";

        //having to update display here as well cause if entering bad liqPrice result in liqPrice
        //set to default but useEffect won't get trigger second time because default = default
        liqPriceDisplay.value = liqPrice;
      } else {
        // to update liquidation price value on display
        const bidOrAsk = isBuy ? "ask" : "bid";
        const liqPriceId = `${i}-${oneClick.strategyName}-${bidOrAsk}-quick-menu-input`;

        let liqPriceDisplay: any;
        // First, set collateral value
        liqPriceDisplay = document.getElementById(liqPriceId);
        // change slider value and liqPrice value to default liq price
        liqPriceDisplay.style.border = "1px solid rgba(253, 172, 205, 0.5)";
      }

      _liqPrices[i] = liqPrice;
    }

    setLiqPrices(_liqPrices);
  };

  // debounce for 1000ms
  const debouncedOnLiqPriceChange = useMemo(
    (): ((...args: any) => void) => debounce(onLiqPriceChange, 1_000),
    [liqPrices[0], liqPrices[1], liqPrices[2], liqPrices[3]]
  );

  const needSUSD = useMemo((): boolean => {
    let estimatedCost_ = 0;
    // `isBid` is the opposite of `isBuy`, since `isBid` is from MM's
    // perspective
    estimatedCost_ += collaterals.reduce(
      (prev, next): number => prev + next,
      0
    );
    // Add premium
    estimatedCost_ += isBuy ? ocQuote : ocQuote * -1;
    // Subtract existing collateral
    estimatedCost_ -=
      existingPositions !== undefined
        ? existingPositions.reduce(
            (prev, next): number => prev + next.collateral,
            0
          )
        : 0;
    estimatedCost_ *= estimatedCostBuffer; // add 10% buffer

    return quoteBalance < estimatedCost_;
  }, [
    size,
    ocQuote,
    txConfirmed,
    quoteBalance,
    collaterals[0],
    collaterals[1],
    collaterals[2],
    collaterals[3],
  ]);
  const needGreaterAllowance = useMemo((): boolean => {
    if (!web3UserIsUndefined(web3User)) {
      const totalCost = getTotalCost(
        ocQuote,
        collaterals,
        !isBuy,
        oneClick.strategyName,
        size
      );

      const a_ = allowance_.bn.toString();
      const needGreaterAllowance_ = parseFloat(a_) / 1e18 < totalCost;

      return needGreaterAllowance_;
    } else {
      return false;
    }
  }, [
    ocQuote,
    allowance_,
    txConfirmed,
    pendingTxConfirmation,
    web3User.account.address,
    web3User.account.connector,
    web3User.provider.network.chainId,
  ]);

  const oih = { debouncedOnSizeChange };
  const osh = {
    handleTrade: handleTrade,
    handleApprove: handleApproveProxysUSD,
    handleSocketPlugin: handleSocketPlugin,
    handleSetApprovalForAll: handleSetApprovalForAll,
  };

  // ---------------------------- Async functions ------------------------------
  async function getOption(
    _isCall: boolean,
    _strikeId: number
  ): Promise<Option> {
    const chainId = provider.network.chainId;
    const marketAddress = getMarketAddress(chainId, assetSymbol);
    const strikeId = parseFloat(_strikeId.toString());

    const option = await lyra.option(marketAddress, strikeId, _isCall);
    return option;
  }

  async function handleTrade(
    e: any,
    isBid: boolean,
    strategyName: string = oneClick.strategyName
  ) {
    e.preventDefault();

    let estimatedCost_: number | BigNumber = 0,
      legs_: OneClicks.LegDetailsStruct[] = [
        initLegDetailsStruct,
        initLegDetailsStruct,
      ];

    // Used to create `LegDetails` structs for each leg later...
    const ocStrategyConfig = ocStrategyConfigs[strategyName];

    // Meta function param (0)
    const methodInfo: MethodInfoType = {
      ctcName: "OneClicks",
      methodName: "tradeOneClick",
      isApproval: false,
    };
    // Meta function param (1)
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: setTxHash,
      setRevertMsg: setRevertMsg,
      setTxConfirmed: setTxConfirmed,
      setCtcCallReverted: setCtcCallReverted,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };
    // Meta function param (2)
    const limiters = [chain?.id === OPTIMISM_MAINNET_CHAIN_ID, isValidAmount];

    // Create `LegDetails` struct for every leg in config and cache leg in array
    ocStrategyConfig.forEach(async (leg, i: number): Promise<void> => {
      const isCall_: boolean = ocStrategyConfig[i][1] as boolean;
      const strikeId_ = toBN(legs[i].strikeId);
      const collateral_ = wei(collaterals[i]).bn;
      const size_ = getLots(size);
      const isLong_ = isBid ? !leg[0] : leg[0];
      // cl("leg=", leg)

      const legDetails: OneClicks.LegDetailsStruct = {
        amount: size_,
        strikeId: strikeId_,
        isLong: isLong_,
        isCall: isCall_,
        finalPositionCollateral: collateral_,
      };

      legs_[i] = legDetails;
    });

    // cl("ocQuote=%s", ocQuote)

    estimatedCost_ =
      ocQuote === 0
        ? 0
        : isBid
        ? Math.max(0, ocQuote * -1)
        : Math.max(0, ocQuote);

    // Meta function param (3)
    const txArguments: any = {
      assetSymbol: assetSymbol,
      name: strategyName,
      underlier: assetSymbol,
      /**
       * @todo Need to let user know on the UI that we add a 10% buffer to the
       * estimated cost for the user's safety.
       */
      estimatedCost: wei(estimatedCost_ * estimatedCostBuffer).bn, // add 10% for slippage
      legs: legs_,
    };

    // cl(`name: `, strategyName)
    // cl(`underlier: `, assetSymbol)
    // cl(`estimatedCost: `, parseFloat(wei(estimatedCost_ * estimatedCostBuffer).bn.toString()) / 1e18)
    // cl(`legs: `, legs_)
    // cl(`finalPositionCollaterals: `, legs_.map(legs => parseFloat(legs.finalPositionCollateral.toString()) / 1e18))

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
  }

  async function handleApproveProxysUSD(e: any, methodName = "approve") {
    e.preventDefault();

    const methodInfo: MethodInfoType = {
      ctcName: "sUSD",
      methodName: methodName,
      isApproval: true,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: setTxHash,
      setRevertMsg: setRevertMsg,
      setCtcCallReverted: setCtcCallReverted,
      setTxConfirmed: setTxConfirmed,
      setApprovedAllowance: setApprovedAllowance,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };
    const limiters = [chain?.id === OPTIMISM_MAINNET_CHAIN_ID, isValidAmount];
    const txArguments: any = {
      oneClicks: { isOneClicks: true, assetSymbol: assetSymbol },
      amount: toBN(50_000),
      approveAmountBuffer: wei(1).bn,
    };

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
    await getAllowance();
  }

  async function handleSetApprovalForAll(
    e: any,
    methodName = "setApprovalForAll"
  ) {
    e.preventDefault();

    const methodInfo: MethodInfoType = {
      ctcName: "OptionToken",
      methodName: methodName,
      isApproval: true,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setRevertMsg: setRevertMsg,
      setTxHash: setTxHash,
      setCtcCallReverted: setCtcCallReverted,
      setTxConfirmed: setTxConfirmed,
      setApprovedAllowance: setApprovedAllowance,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };
    const limiters = [chain?.id === OPTIMISM_MAINNET_CHAIN_ID, isValidAmount];
    const txArguments: any = {
      web3User: web3User,
      assetSymbol: assetSymbol,
    };

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
  }

  // ---------------------------- Async functions ------------------------------
  async function getBidOrAskQuote(
    strategyName: string = oneClick.strategyName
  ): Promise<void> {
    if (isNaN(size)) {
      setOCQuote(0);
    } else {
      const chainId = chain ? chain?.id : OPTIMISM_MAINNET_CHAIN_ID;
      const ma = getMarketAddress(chainId, assetSymbol as string);
      await Promise.all(
        legs.map(async (leg, i: number): Promise<void> => {
          leg.size = size;
        })
      );
      const strategyBidAsk = await getStrategyBidAsk(ma, legs);

      setOCQuote(isBuy ? strategyBidAsk.ask : strategyBidAsk.bid);
    }
  }

  async function getAllowance(): Promise<void> {
    const isOneClicks = true;
    const strategyName = undefined;

    const _allowance = await allowance(web3User, strategyName, {
      isOneClicks: isOneClicks,
      assetSymbol: assetSymbol,
    });

    if (ethers.BigNumber.isBigNumber(_allowance)) {
      setAllowance(wei(parseFloat(_allowance.toString()) / 1e18));
    }
  }

  async function getQuoteBalanceOf(): Promise<void> {
    const userBalance_ = await balanceOf(web3User);
    if (ethers.BigNumber.isBigNumber(userBalance_)) {
      // used for checking if user balance is sufficient
      setQuoteBalance(bnToNumber(userBalance_, 2));
    }
  }

  async function getIsApprovedForAll(): Promise<void> {
    const _isApproveForAll = await isApprovedForAll(web3User, assetSymbol);
    if (typeof _isApproveForAll === "boolean")
      setIsApprovedForAll(_isApproveForAll);
  }

  async function updateFinalPositions(): Promise<void> {
    let finalPositions_ = [...finalPositions],
      _finalCollateral = [...collaterals],
      _liqPrices = [...liqPrices];
    const uid = Math.floor(Math.random() * 10000);

    const strategyName = oneClick.strategyName;
    const ocStrategyConfig = ocStrategyConfigs[strategyName];
    // cl('[%s] %s isBuy=%s', uid, strategyName, isBuy)

    await Promise.all(
      ocStrategyConfig.map(async (leg, i: number): Promise<void> => {
        const isCall = leg[1];

        const oldSize = existingPositions[i].amount;
        const oldIsLong = existingPositions[i].isLong;

        // Flip direction of input long based on whether the direction of the
        // strategy the user has selected `isBuy`
        const isInputLong = isBuy
          ? ocStrategyConfigs[strategyName][i][0]
          : !ocStrategyConfigs[strategyName][i][0];
        const isInputCall = ocStrategyConfigs[strategyName][i][1];

        let finalPosition_: { size: number; isLong: boolean } = {
            size: size,
            isLong: isInputLong,
          },
          finalCollateral: BigNumber | number = 0;

        if (oldIsLong === isInputLong) {
          finalPosition_.size = size + oldSize;
          finalPosition_.isLong = isInputLong;
        } else {
          if (size > oldSize) {
            finalPosition_.size = size - oldSize;
            finalPosition_.isLong = !oldIsLong;
          } else if (size < oldSize) {
            finalPosition_.size = oldSize - size;
            finalPosition_.isLong = oldIsLong;
          } else {
            //size=oldSize
            finalPosition_.size = 0;
            finalPosition_.isLong = true;
          }
        }

        // cl(`[%s] legs[%s] oldSize:%s%s  tradeSize:%s%s  finalPositionSize:%s%s`,
        //   uid, i, oldIsLong ? '+' : '-', oldSize, isInputLong ? '+' : '-', size,
        //   finalPosition_.isLong ? '+' : '-', finalPosition_.size)

        const strikeId = oneClick.legs[i].strikeId;
        const finalSize = getLots(finalPosition_.size);

        if (!finalPosition_.isLong && finalPosition_.size > 0) {
          const option = await getOption(isInputCall, strikeId);
          // Set spotPrice to the user's liquida1tion price
          const liqPrice = wei(_liqPrices[i]).bn;

          finalCollateral = getMinCollateralForSpotPrice(
            option,
            finalSize,
            liqPrice
          );
        }

        finalCollateral = Math.ceil(
          parseFloat(finalCollateral.toString()) / 1e18
        );

        if (finalCollateral > 0 && isCall) {
          finalCollateral = Math.max(MIN_COLLATERAL, finalCollateral);
        } else if (finalCollateral < 0) {
          finalCollateral = 0;
        }

        // cl(`[%s] legs[%s] liqPrice:%s oldCollateral:%s  finalCollateral:%s`, uid, i, _liqPrices[i], oldCollateral.toFixed(2), finalCollateral.toFixed(2))
        finalPositions_[i] = finalPosition_;
        _finalCollateral[i] = finalCollateral;
      })
    );

    setCollaterals(_finalCollateral);
    setFinalPositions(finalPositions_);
  }

  // ----------------------------- useEffects ----------------------------------
  useLayoutEffect(() => {
    if (
      !web3UserIsUndefined(web3User) &&
      isValidAmount &&
      approvedAllowance.gt(0)
    ) {
      setAllowance(approvedAllowance);
    }
  }, [approvedAllowance]);

  // Update `finalPositions`
  useEffect(() => {
    if (
      ocQuickMenuState.isOpenOCQuickMenu &&
      ocQuickMenuState.isBid === !isBuy &&
      ocQuickMenuState.oneClickIndex === oneClickIndex &&
      oneClick.strategyName !== undefined &&
      existingPositionsLoaded
    ) {
      // cl('updateFinalPositions useEffect for %s with liqPrices[0|1]=%s|%s', oneClick.strategyName, liqPrices[0], liqPrices[1])

      const requests = [updateFinalPositions()];
      Promise.all(requests).then((response: any) => {});
    }
  }, [
    size,
    existingPositionsLoaded,
    JSON.stringify(liqPrices),
    ocQuickMenuState.isOpenOCQuickMenu,
  ]);

  useEffect(() => {
    const timeout = 1 / 1e9;

    const getBidOrAskQuoteTimeout = setTimeout(() => {
      if (
        ocQuickMenuState.isOpenOCQuickMenu &&
        ocQuickMenuState.oneClickIndex === oneClickIndex
      ) {
        setQuoteDataIsLoaded(false);

        const requests = [getBidOrAskQuote()];
        Promise.all(requests).then((response: any) => {});

        setQuoteDataIsLoaded(true);
      }
    }, timeout);

    return () => {
      clearTimeout(getBidOrAskQuoteTimeout);
    };
  }, [size, ocQuickMenuState.isOpenOCQuickMenu]);

  // ------------- Updates that only happen when wallet is connected -----------
  useLayoutEffect(() => {
    const timeout = 1 / 1e9;

    const getAllowanceAndApprovalTimeout = setTimeout(() => {
      if (!web3UserIsUndefined(web3User)) {
        Promise.all([getAllowance(), getIsApprovedForAll()]);
      }
    }, timeout);

    return () => {
      clearTimeout(getAllowanceAndApprovalTimeout);
    };
  }, [
    txConfirmed,
    web3User.account.address,
    web3User.account.connector,
    web3User.provider.network.chainId,
  ]);

  // Timeout to get user's quote balance
  useLayoutEffect(() => {
    const timeout = 1 / 1e9;

    const getQuoteBalanceTimeout = setTimeout(() => {
      if (!web3UserIsUndefined(web3User)) {
        const requests = [getQuoteBalanceOf()];
        Promise.all(requests).then((response: any) => {});
      }
    }, timeout);

    return () => {
      clearTimeout(getQuoteBalanceTimeout);
    };
  }, [
    txConfirmed,
    web3User.account.address,
    web3User.account.connector,
    web3User.provider.network.chainId,
  ]);

  return (
    <>
      <QuickMenuButton isBid={!isBuy} />

      <QuickMenu
        oih={oih}
        osh={osh}
        isBid={!isBuy}
        web3User={web3User}
        trader={{
          needSUSD: needSUSD,
          isApprovedForAll: isApprovedForAll_,
          needGreaterAllowance: needGreaterAllowance,
        }}
      >
        <OneClickOptionLegs
          size={size}
          isBuy={isBuy}
          web3User={web3User}
          debouncedOnLiqPriceChange={debouncedOnLiqPriceChange}
        />

        <QuotePrice
          size={size}
          isBid={!isBuy}
          ocQuote={ocQuote}
          web3User={web3User}
          trader={{
            needSUSD: needSUSD,
            isApprovedForAll: isApprovedForAll_,
            needGreaterAllowance: needGreaterAllowance,
          }}
          txSuspense={{
            revertMsg: revertMsg,
            ctcCallReverted: ctcCallReverted,
            pendingUserAction: pendingUserAction,
            pendingTxConfirmation: pendingTxConfirmation,
          }}
        />
      </QuickMenu>
    </>
  );
};

export default memo(BidAskMenu);
