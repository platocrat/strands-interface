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
import { BigNumber } from "ethers";
import { useAccount, useNetwork, useProvider } from "wagmi";
// Locals
import BidButton from "./bid-button";
import AskButton from "./ask-button";
import BidAskMenu from "../../../Menus/BidAskMenu";
// Contexts
import { LyraOptionDataContext } from "../../../../contexts/LyraOptionDataContext";
import { ocqmsContext } from "../../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../../contexts/OneClickContext";
import { UnderlierContext } from "../../../../contexts/UnderlierContext";
import { BidAskMenuContext } from "../../../../contexts/BidAskMenuContext";
// APIs
import { getExistingPosition } from "../../../../contract-apis/apis/oneClicks";
// Constants
import {
  liqPriceBuffer,
  ocStrategyConfigs,
  OPTIMISM_MAINNET_CHAIN_ID,
  initExistingPosition__Display,
} from "../../../../utils/constants";
// Misc
import { bnToNumber, cl, numberWithCommas } from "../../../../utils/misc";
// Types and props
import { PriceCellProps } from "../../../../utils/props";
import {
  Web3UserType,
  ExistingPositionType__Display,
} from "../../../../utils/types";
// CSS
import { fonts } from "../../../../theme/styles";

/**
 * @dev Synthetic formula => C - P = F - X
 */
const PriceCell: FC<PriceCellProps> = ({ suspense, handleSocketPlugin }) => {
  // React contexts
  const { assetSymbol } = useContext(UnderlierContext);
  const { oneClicks, currentAssetPrice } = useContext(LyraOptionDataContext);
  const { oneClick, oneClickIndex } = useContext(OneClickContext);
  const { ocQuickMenuState, setOCQuickMenuState } = useContext(ocqmsContext);

  // web3 vars
  const account = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();

  // custom
  const [existingPositions, setExistingPositions] = useState<
    ExistingPositionType__Display[]
  >([
    initExistingPosition__Display,
    initExistingPosition__Display,
    initExistingPosition__Display,
    initExistingPosition__Display,
  ]);
  const [finalPositions, setFinalPositions] = useState<
    { size: number; isLong: boolean }[]
  >([
    { size: 0, isLong: true },
    { size: 0, isLong: true },
    { size: 0, isLong: true },
    { size: 0, isLong: true },
  ]);
  const [collaterals, setCollaterals] = useState<number[]>([0, 0, 0, 0]);
  // number | number[]
  const [syntheticFutureBidPrice, setSyntheticFutureBidPrice] =
    useState<number>(0);
  const [syntheticFutureAskPrice, setSyntheticFutureAskPrice] =
    useState<number>(0);
  const [liqPrices, setLiqPrices] = useState<number[]>([0, 0, 0, 0]);
  // booleans
  const [existingPositionsLoaded, setExistingPositionsLoaded] =
    useState<boolean>(false);
  const [existingPositionsLoading, setExistingPositionsLoading] =
    useState<boolean>(false);
  const [isSimpleView, setIsSimpleView] = useState<boolean>(true);

  const web3User: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  const showBidCheckmark =
    ocQuickMenuState.isBid && ocQuickMenuState.oneClickIndex === oneClickIndex;
  const showAskCheckmark =
    !ocQuickMenuState.isBid && ocQuickMenuState.oneClickIndex === oneClickIndex;

  const showBidAsk = useMemo((): boolean => {
    return (
      !suspense.isDataLoaded.dataIsLoading && suspense.isDataLoaded.dataIsLoaded
    );
  }, [suspense.isDataLoaded.dataIsLoaded, suspense.isDataLoaded.dataIsLoading]);
  const showSpinner = useMemo((): boolean => {
    return (
      suspense.isDataLoaded.dataIsLoading && !suspense.isDataLoaded.dataIsLoaded
    );
  }, [suspense.isDataLoaded.dataIsLoaded, suspense.isDataLoaded.dataIsLoading]);

  async function handleShowBidAskQuickMenu(
    isBid: boolean = true,
    isOpen?: boolean
  ): Promise<void> {
    const uid = Math.floor(Math.random() * 10000);

    setOCQuickMenuState({
      ...ocQuickMenuState,
      isBid: isBid,
      isSubmittingTrade: false,
      oneClickIndex: oneClickIndex,
      isOpenOCQuickMenu: isOpen ?? !ocQuickMenuState.isOpenOCQuickMenu,
    });

    if (!ocQuickMenuState.isOpenOCQuickMenu) {
      setExistingPositionsLoaded(false);
      setExistingPositionsLoading(true);

      await getExistingPositions(uid);
      await getDefaultLiqPrices(isBid);

      setExistingPositionsLoading(false);
      setExistingPositionsLoaded(true);
    }
  }

  function handleBidAsk(e: any, isBid: boolean = true): void {
    setOCQuickMenuState({
      ...ocQuickMenuState,
      isBid: isBid,
      legs: oneClick.legs,
      isSubmittingTrade: true,
      isOpenOCQuickMenu: false,
      oneClickIndex: oneClickIndex,
      strategyName: oneClick.strategyName as string,
    });

    console.log(`Request to submit trade for ${isBid ? "ask" : "bid"}`);
  }

  async function getDefaultLiqPrices(isBid: boolean): Promise<void> {
    let _liqPrices: number[] = [...liqPrices];

    if (currentAssetPrice != undefined && currentAssetPrice > 0) {
      oneClicks[oneClickIndex].legs.map((leg, i: number): void => {
        const isCall = ocStrategyConfigs[oneClick.strategyName][i][1];

        const scalingFactor = isCall
          ? 1 + liqPriceBuffer // 5% above spot price for calls
          : 1 - liqPriceBuffer; // 5% below spot price for puts

        let defaultLiqPrice = currentAssetPrice * scalingFactor;
        defaultLiqPrice = parseFloat(defaultLiqPrice.toFixed(2));

        // Set default liqPrice for trade function
        _liqPrices[i] = defaultLiqPrice;
        //cl('getDefaultLiqPrices legs[%s] isBid=%s isCall=%s spotPrice=%s sdefaultLiqPrice=%s',
        //i,isBid,isCall,currentAssetPrice,defaultLiqPrice)
      });

      setLiqPrices(_liqPrices);
    } else {
      cl("skip getDefaultLiqPrices spotPrice=%s", currentAssetPrice);
    }
  }

  /**
   * @dev Get existing positions for strategy
   * @notice The existing positions that set in this function are then used to
   * update the `finalPositions` array of objects.
   */
  async function getExistingPositions(uid): Promise<void> {
    let _existingPositions = [...existingPositions];

    await Promise.all(
      oneClicks[oneClickIndex].legs.map(
        async (leg, i: number): Promise<void> => {
          const strikeId = leg.strikeId;
          const isCall = ocStrategyConfigs[oneClick.strategyName][i][1];

          const _existingPosition: {
            positionId: BigNumber;
            positionAmount: BigNumber;
            isLong: boolean;
            collateral: BigNumber;
          } = (await getExistingPosition(
            assetSymbol,
            web3User,
            strikeId,
            isCall
          )) as {
            positionId: BigNumber;
            positionAmount: BigNumber;
            isLong: boolean;
            collateral: BigNumber;
          };

          // cl(
          //   `_existingPosition for leg ${i}: `,
          //   _existingPosition
          // )

          const existingCollateral =
            parseFloat(_existingPosition.collateral.toString()) / 1e18;
          const existingAmount =
            parseFloat(_existingPosition.positionAmount.toString()) / 1e18;
          const existingIsLong =
            existingAmount === 0 ? true : _existingPosition.isLong;

          const existingPosition_: ExistingPositionType__Display = {
            isCall: leg.isCall,
            isLong: existingIsLong,
            amount: existingAmount,
            collateral: existingCollateral,
          };

          _existingPositions[i] = existingPosition_;
          // console.log("[%s] existingPositionsLoading=%s  existingPositionsLoaded=%s", uid, i, existingPositionsLoading, existingPositionsLoaded)
          // console.log("[%s] ExistingPositions_ i=%s size=%s isLong=%s", uid, i, existingPosition_.amount, existingPosition_.isLong)
        }
      )
    );

    setExistingPositions(_existingPositions);

    //is
    // console.log("[%s] after setExistingPositions ExistingPositions[0|1].amount=%s|%s ",
    //   uid, existingPositions[0].amount, existingPositions[1].amount)
  }

  useLayoutEffect(() => {
    if (oneClick.legs[0].strikePrice !== "----") {
      const strikePrice = bnToNumber(oneClick.legs[0].strikePrice, 2);
      const bidPrice = oneClick.bidPrice;
      const askPrice = oneClick.askPrice;

      setSyntheticFutureBidPrice(strikePrice + bidPrice);
      setSyntheticFutureAskPrice(strikePrice + askPrice);
    }
  }, [oneClick.bidPrice]);

  useLayoutEffect(() => {
    if (
      ocQuickMenuState.isOpenOCQuickMenu &&
      ocQuickMenuState.oneClickIndex === oneClickIndex
    ) {
      handleShowBidAskQuickMenu(ocQuickMenuState.isBid);
    }
  }, [assetSymbol]);

  useEffect(() => {
    if (
      ocQuickMenuState.isOpenOCQuickMenu &&
      ocQuickMenuState.oneClickIndex === oneClickIndex
    ) {
      // cl("useEffect to set %s liqPrices", oneClick.strategyName)
      let _liqPrices = [...liqPrices],
        _finalPositions = [...finalPositions];
      oneClicks[oneClickIndex].legs.map((leg, i: number): void => {
        // cl("_finalPositions[%s].isLong=%s size=%s", i, _finalPositions[i].isLong, _finalPositions[i].size)
        if (!_finalPositions[i].isLong && _finalPositions[i].size !== 0) {
          let liqPriceElement: any;

          const bidOrAsk = ocQuickMenuState.isBid ? "bid" : "ask";
          const liqPriceId = `${i}-${oneClick.strategyName}-${bidOrAsk}-quick-menu-input`;
          liqPriceElement = document.getElementById(liqPriceId);

          if (liqPriceElement != null) {
            // cl("set liqPrice %s to %s", liqPrices[i], liqPriceId)
            liqPriceElement.value = _liqPrices[i];
          } else {
            cl("liqPriceElement[%s] not found", i);
          }
        }
      });
    }
  }, [
    isSimpleView,
    liqPrices[0],
    liqPrices[1],
    liqPrices[2],
    liqPrices[3],
    finalPositions[0],
    finalPositions[1],
    finalPositions[2],
    finalPositions[3],
  ]);

  return (
    <>
      <div>
        <div style={{ display: "flex" }}>
          <BidAskMenuContext.Provider
            value={{
              liqPrices,
              showBidAsk,
              collaterals,
              showSpinner,
              setLiqPrices,
              isSimpleView,
              finalPositions,
              setCollaterals,
              setIsSimpleView,
              showBidCheckmark,
              showAskCheckmark,
              existingPositions,
              setFinalPositions,
              setExistingPositions,
              existingPositionsLoaded,
              existingPositionsLoading,
              handleShowBidAskQuickMenu,
              setExistingPositionsLoaded,
              setExistingPositionsLoading,
            }}
          >
            <BidAskMenu isBuy={false} handleSocketPlugin={handleSocketPlugin} />
            <BidButton handleBidAsk={handleBidAsk} />

            <div>
              <p
                style={{
                  color: fonts.colors.solid.pink,
                  margin: false ? "10px 40px 10px 40px" : "0px 10px",
                  filter: fonts.filters["drop-shadow"].solid.hardDarkPink,
                }}
              >
                {`@ `}
              </p>
            </div>

            <AskButton handleBidAsk={handleBidAsk} />
            <BidAskMenu isBuy={true} handleSocketPlugin={handleSocketPlugin} />
          </BidAskMenuContext.Provider>
        </div>

        {oneClickIndex === 0 && (
          <>
            <div
              style={{
                display: "inline-block",
                opacity: suspense.isDataLoaded.dataIsLoaded ? "" : "0",
                width: "100%",
                color: fonts.colors.solid.white,
                fontSize: fonts.sizes.small,
                padding: "5px 40px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  float: "left",
                }}
              >
                {numberWithCommas(syntheticFutureBidPrice)}
              </div>
              <div
                style={{
                  display: "inline-block",
                  float: "right",
                }}
              >
                {numberWithCommas(syntheticFutureAskPrice)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default memo(PriceCell);
