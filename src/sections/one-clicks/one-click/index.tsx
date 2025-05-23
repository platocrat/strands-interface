// Constants
import {
  ARBITRUM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// CSS
import { fonts } from "../../../theme/styles";
import { cstb } from "../../../theme/componentStyles";
// Types
import { ocType, Web3UserType } from "../../../utils/types";
// Images
import {
  FC,
  Fragment,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useAccount, useNetwork, useProvider } from "wagmi";
import styled from "@emotion/styled";
import { Board, Strike } from "@lyrafinance/lyra-js";
// Locals
import PriceCell from "../../../components/Tables/Cells/PriceCell";
import StrategyCell from "../../../components/Tables/Cells/StrategyCell";
// Contexts
import { OneClickContext } from "../../../contexts/OneClickContext";
// Request
import { bnToNumber } from "../../../utils/misc";
// Types
import { OneClickSectionProps } from "../../../utils/props";
//Util
import { LyraOptionDataContext } from "../../../contexts/LyraOptionDataContext";
import {
  getOptionDetails,
  getTargetOption,
} from "../../../utils/requests/one-clicks/utils";
import { getMarketAddress } from "../../../contract-apis/utils";
import { getStrategyBidAsk } from "../../../utils/requests/one-clicks";
import { UnderlierContext } from "../../../contexts/UnderlierContext";
import { ReactComponent as DropdownSVG } from "../../../assets/svg/dropdown.svg";
import useOnClickOutside from "../../../hooks/useOnclickOutside";
// Constants
import { ocStrategyConfigs } from "../../../../src/utils/constants";

const OneClickSection: FC<OneClickSectionProps> = ({
  suspense,
  handleSocketPlugin,
}) => {
  const { chain } = useNetwork();

  const { arbitrumOCs, optimismOCs, ocIndex, boards } =
    useContext(OneClickContext);

  const isOnArbitrum = useMemo((): boolean => {
    return chain?.id === ARBITRUM_MAINNET_CHAIN_ID;
  }, [chain?.id]);

  const oneClick = useMemo((): ocType => {
    return isOnArbitrum ? arbitrumOCs[ocIndex] : optimismOCs[ocIndex];
  }, [isOnArbitrum, arbitrumOCs, optimismOCs, ocIndex]);

  const { assetSymbol } = useContext(UnderlierContext);
  const {
    setArbitrumOCs,
    setOptimismOCs,
    allBoards,
    selectedMode,
    isApprovedForAll,
  } = useContext(LyraOptionDataContext);

  const [legState, setLegState] = useState<
    {
      boardId: number;
      expiry: string;
      strikes: { strikeId: number; strikePrice: number }[];
    }[]
  >([]);

  const [selectedExpiry1, setSelectedExpiry1] = useState<string>("");
  const [selectedExpiry1Id, setSelectedExpiry1Id] = useState<number>(0);
  const [selectedExpiry2, setSelectedExpiry2] = useState<string>("");
  const [selectedExpiry2Id, setSelectedExpiry2Id] = useState<number>(0);

  const [defaultLegs, setDefaultlegs] = useState<any[]>([
    { price: 0, isCall: false, isLong: false, strikeId: 0 },
  ]);

  const [selectedLeg1StrikeId, setSelectedLeg1StrikeId] = useState<number>(0);
  const [selectedLeg1StrikePrice, setSelectedLeg1StrikePrice] =
    useState<number>(0);

  const [valueOfSecondLeg, setValueOfSecondLeg] = useState<
    "Higher" | "Lower" | "Equal"
  >("Equal");

  const [selectedLeg2StrikeId, setSelectedLeg2StrikeId] = useState<number>(0);
  const [selectedLeg2StrikePrice, setSelectedLeg2StrikePrice] =
    useState<number>(0);

  useEffect(() => {
    let tempSelectedBoards: any = [];
    const selectedChainId =
      chain?.id === OPTIMISM_MAINNET_CHAIN_ID
        ? ARBITRUM_MAINNET_CHAIN_ID
        : OPTIMISM_MAINNET_CHAIN_ID;

    if (allBoards?.[selectedChainId]?.[assetSymbol]?.length > 1) {
      if (selectedMode === 2) {
        tempSelectedBoards = allBoards?.[selectedChainId]?.[assetSymbol].filter(
          (item) =>
            boards.find(
              (_item) => _item.expiryTimestamp === item.expiryTimestamp
            )
        );
      }
    }

    const legState = boards.map(
      (
        board: Board
      ): {
        boardId: number;
        expiry: string;
        strikes: { strikeId: number; strikePrice: number }[];
      } => ({
        boardId: board.id,
        expiry: new Date(board.expiryTimestamp * 1000)
          .toDateString()
          .slice(4, 10),
        // List all strikes
        strikes:
          Object.keys(
            tempSelectedBoards.find(
              (item: any) => item.expiryTimestamp === board.expiryTimestamp
            ) ?? {}
          ).length > 0
            ? board
                .strikes()
                .filter((item) =>
                  tempSelectedBoards
                    .find(
                      (item: any) =>
                        item.expiryTimestamp === board.expiryTimestamp
                    )
                    ?.strikes()
                    .some(
                      (strike) =>
                        strike.strikePrice === item.strikePrice &&
                        bnToNumber(strike.call().delta, 4) < 0.9 &&
                        bnToNumber(strike.call().delta, 4) > 0.1
                    )
                )
                .map(
                  (
                    strike: Strike
                  ): { strikeId: number; strikePrice: number } => ({
                    strikeId: strike.id,
                    strikePrice: Math.round(bnToNumber(strike.strikePrice)),
                  })
                )
            : board
                .strikes()
                .map(
                  (
                    strike: Strike
                  ): { strikeId: number; strikePrice: number } => ({
                    strikeId: strike.id,
                    strikePrice: Math.round(bnToNumber(strike.strikePrice)),
                  })
                ),
      })
    );
    setLegState(legState);
  }, [allBoards, assetSymbol, boards, chain?.id, selectedMode]);

  useEffect(() => {
    const tmpArr = oneClick.legs.map((itm) => {
      return {
        strikeId: itm.strikeId,
        price: itm.strikePrice !== "----" ? bnToNumber(itm.strikePrice) : 0,
        isLong: itm.isLong,
        isCall: itm.isCall,
      };
    });
    setDefaultlegs(tmpArr);
    if (!oneClick.noStrikeFound) {
      setSelectedExpiry1(String(oneClick?.legs[0]?.expiry).slice(4, 10));
      setSelectedExpiry1Id(oneClick?.legs[0]?.boardId);
      if (oneClick?.legs?.length > 2) {
        setSelectedExpiry2(String(oneClick?.legs[2]?.expiry).slice(4, 10));
        setSelectedExpiry2Id(oneClick?.legs[2]?.boardId);
      }
      if (tmpArr.length > 1) {
        const tempStrikes = legState
          .find(
            (itm) =>
              itm.expiry === String(oneClick?.legs[0]?.expiry).slice(4, 10)
          )
          ?.strikes.sort((a, b) => a.strikePrice - b.strikePrice);
        switch (true) {
          // Strangle and Put Spread
          case oneClick.strategyName === "Put Spread":
            setValueOfSecondLeg("Lower");
            if (
              tmpArr[0]?.strikeId === tempStrikes?.[0]?.strikeId ||
              !tmpArr[0]?.strikeId ||
              !tmpArr[1]?.strikeId
            ) {
              setSelectedLeg1StrikePrice(tempStrikes?.[0]?.strikePrice ?? 0);
              setSelectedLeg1StrikeId(tempStrikes?.[0]?.strikeId ?? 0);
              setSelectedLeg2StrikePrice(tempStrikes?.[1]?.strikePrice ?? 0);
              setSelectedLeg2StrikeId(tempStrikes?.[1]?.strikeId ?? 0);
            } else {
              setSelectedLeg1StrikePrice(tmpArr[0].price);
              setSelectedLeg1StrikeId(tmpArr[0].strikeId);
              setSelectedLeg2StrikePrice(tmpArr[1].price);
              setSelectedLeg2StrikeId(tmpArr[1].strikeId);
            }
            break;
          // call Spread
          case oneClick.strategyName === "Strangle":
          case oneClick.strategyName === "Call Spread":
            setValueOfSecondLeg("Higher");
            if (
              tmpArr[0]?.strikeId === tempStrikes?.at(-1)?.strikeId ||
              !tmpArr[0]?.strikeId ||
              !tmpArr[1]?.strikeId
            ) {
              setSelectedLeg1StrikePrice(tempStrikes?.at(-2)?.strikePrice ?? 0);
              setSelectedLeg1StrikeId(tempStrikes?.at(-2)?.strikeId ?? 0);
              setSelectedLeg2StrikePrice(tempStrikes?.at(-1)?.strikePrice ?? 0);
              setSelectedLeg2StrikeId(tempStrikes?.at(-1)?.strikeId ?? 0);
            } else {
              setSelectedLeg1StrikePrice(tmpArr[0].price);
              setSelectedLeg1StrikeId(tmpArr[0].strikeId);
              setSelectedLeg2StrikePrice(tmpArr[1].price);
              setSelectedLeg2StrikeId(tmpArr[1].strikeId);
            }
            break;
          // Roll
          case oneClick.strategyName === "Roll":
            setValueOfSecondLeg("Equal");
            setSelectedLeg1StrikePrice(tmpArr[0]?.price ?? 0);
            setSelectedLeg1StrikeId(tmpArr[0]?.strikeId ?? 0);
            setSelectedLeg2StrikePrice(tmpArr[2]?.price ?? 0);
            setSelectedLeg2StrikeId(tmpArr[2]?.strikeId ?? 0);
            break;
          // Combo (Synthetic) and Straddle
          default:
            setValueOfSecondLeg("Equal");
            setSelectedLeg1StrikePrice(tmpArr[0]?.price ?? 0);
            setSelectedLeg1StrikeId(tmpArr[0]?.strikeId ?? 0);
            setSelectedLeg2StrikePrice(tmpArr[1]?.price ?? 0);
            setSelectedLeg2StrikeId(tmpArr[1]?.strikeId ?? 0);
        }
      }
    } else {
      if (oneClick?.legs?.length > 1) {
        setSelectedExpiry1(String(oneClick?.legs[0]?.expiry).slice(4, 10));
        setSelectedExpiry1Id(oneClick?.legs[0]?.boardId);
        if (oneClick?.legs?.length > 2) {
          setSelectedExpiry2(String(oneClick?.legs[2]?.expiry).slice(4, 10));
          setSelectedExpiry2Id(oneClick?.legs[2]?.boardId);
        } else {
          setSelectedExpiry2("");
          setSelectedExpiry2Id(0);
        }
      } else {
        setSelectedExpiry1("");
        setSelectedExpiry1Id(0);
        setSelectedExpiry2("");
        setSelectedExpiry2Id(0);
      }
      setSelectedLeg1StrikePrice(0);
      setSelectedLeg1StrikeId(0);
      setSelectedLeg2StrikePrice(0);
      setSelectedLeg2StrikeId(0);
    }
  }, [legState, oneClick]);

  const isDeltaBetween01and09 = (strike, index, val = 0) => {
    const delta = Math.abs(
      bnToNumber(
        boards
          .find(
            (item) =>
              item.id ===
              (val ? val : index < 2 ? selectedExpiry1Id : selectedExpiry2Id)
          )
          ?.strikes()
          .find((item) => item.id === strike.strikeId)
          ?.[defaultLegs[index].isCall ? "call" : "put"]().delta ?? "0"
      )
    );

    return delta < 0.9 && delta > 0.1;
  };

  const boardChangeHandler = (e, index, _legs) => {
    const boardId = legState.find(
      (item) => item.expiry === e.target.value
    )?.boardId;
    if (_legs.length > 3 && index > 1) {
      setSelectedExpiry2(e.target.value);
      setSelectedExpiry2Id(boardId || 0);
    } else {
      setSelectedExpiry1(e.target.value);
      setSelectedExpiry1Id(boardId || 0);
      if (e.target.value <= selectedExpiry2) {
        const index = legState.findIndex(
          (item) => item.expiry === e.target.value
        );
        const strikeId = legState[index - 1]?.strikes.find(
          (itm) => itm.strikePrice === selectedLeg2StrikePrice
        )?.strikeId;
        if (strikeId) {
          setSelectedLeg2StrikeId(strikeId);
        } else {
          setSelectedLeg2StrikePrice(0);
          setSelectedLeg2StrikeId(0);
        }
        setSelectedExpiry2(legState[index - 1].expiry);
        setSelectedExpiry2Id(legState[index - 1].boardId);
      }
    }

    let tempSelectedBoards = [];

    const selectedChainId =
      chain?.id === OPTIMISM_MAINNET_CHAIN_ID
        ? ARBITRUM_MAINNET_CHAIN_ID
        : OPTIMISM_MAINNET_CHAIN_ID;

    if (allBoards?.[selectedChainId]?.[assetSymbol]?.length > 1) {
      if (selectedMode === 2) {
        tempSelectedBoards = allBoards?.[selectedChainId]?.[assetSymbol].filter(
          (item) =>
            boards.find(
              (_item) => _item.expiryTimestamp === item.expiryTimestamp
            )
        );
      }
    }

    if (_legs.length < 3 || index < 2) {
      const ocStrategyConfig = ocStrategyConfigs[oneClick.strategyName];
      const isCall = ocStrategyConfig[0][1];
      const deltas = ocStrategyConfig[0][2];
      const board = boards.find((item: Board) => item.id === boardId);
      const strikeId = getTargetOption(
        board,
        deltas,
        isCall,
        tempSelectedBoards.find(
          (item: any) => item.expiryTimestamp === board.expiryTimestamp
        )
      ).strikeId;
      // const strikeId = legState
      //   .find((itm) => itm.expiry === e.target.value)
      //   ?.strikes.filter((item) => isDeltaBetween01and09(item, index, boardId))
      //   .find((itm) => itm.strikePrice === selectedLeg1StrikePrice)?.strikeId;

      if (strikeId) {
        setSelectedLeg1StrikeId(strikeId);
        setSelectedLeg1StrikePrice(
          legState
            .find((itm) => itm.expiry === e.target.value)
            ?.strikes.find((itm) => itm.strikeId === strikeId)?.strikePrice ?? 0
        );
      } else {
        setSelectedLeg1StrikePrice(0);
        setSelectedLeg1StrikeId(0);
      }
    }
    if (_legs.length < 3 || index > 1) {
      const ocStrategyConfig = ocStrategyConfigs[oneClick.strategyName];
      const isCall = ocStrategyConfig[1][1];
      const deltas = ocStrategyConfig[1][2];
      const board = boards.find((item: Board) => item.id === boardId);
      const strikeId = getTargetOption(
        board,
        deltas,
        isCall,
        tempSelectedBoards.find(
          (item: any) => item.expiryTimestamp === board.expiryTimestamp
        )
      ).strikeId;
      // const strikeId = legState
      //   .find((itm) => itm.expiry === e.target.value)
      //   ?.strikes.find(
      //     (itm) => itm.strikePrice === selectedLeg2StrikePrice
      //   )?.strikeId;

      if (strikeId) {
        setSelectedLeg2StrikeId(strikeId);
        setSelectedLeg2StrikePrice(
          legState
            .find((itm) => itm.expiry === e.target.value)
            ?.strikes.find((itm) => itm.strikeId === strikeId)?.strikePrice ?? 0
        );
      } else {
        setSelectedLeg2StrikePrice(0);
        setSelectedLeg2StrikeId(0);
      }
    }
  };

  const priceChangeHandler = (e, index, _length) => {
    const strikePrice = Number(e.target.value);
    const tempLegState = legState.find(
      (item) => item.expiry === selectedExpiry1
    );
    const tempLegState2 = legState.find(
      (item) => item.expiry === selectedExpiry2
    );
    const strikeIndex =
      tempLegState?.strikes.findIndex(
        (item) => item.strikePrice === Number(e.target.value)
      ) ?? 0;
    const strikeIndex2 =
      tempLegState2?.strikes.findIndex(
        (item) => item.strikePrice === Number(e.target.value)
      ) ?? 0;
    ((_length > 2 && index < 2) || index === 0
      ? setSelectedLeg1StrikePrice
      : setSelectedLeg2StrikePrice)(strikePrice);
    ((_length > 2 && index < 2) || index === 0
      ? setSelectedLeg1StrikeId
      : setSelectedLeg2StrikeId)(
      _length > 2 && index > 1
        ? tempLegState2?.strikes[strikeIndex2]?.strikeId ?? 0
        : tempLegState?.strikes[strikeIndex]?.strikeId ?? 0
    );

    if (index === 0 && valueOfSecondLeg !== "Equal") {
      if (
        valueOfSecondLeg === "Lower" &&
        (!selectedLeg2StrikePrice || strikePrice <= selectedLeg2StrikePrice)
      ) {
        setSelectedLeg2StrikePrice(
          tempLegState?.strikes[strikeIndex - 1]?.strikePrice ?? 0
        );
        setSelectedLeg2StrikeId(
          tempLegState?.strikes[strikeIndex - 1]?.strikeId ?? 0
        );
      }
      if (
        valueOfSecondLeg === "Higher" &&
        (!selectedLeg2StrikePrice || strikePrice >= selectedLeg2StrikePrice)
      ) {
        setSelectedLeg2StrikePrice(
          tempLegState?.strikes[strikeIndex + 1]?.strikePrice ?? 0
        );
        setSelectedLeg2StrikeId(
          tempLegState?.strikes[strikeIndex + 1]?.strikeId ?? 0
        );
      }
    } else {
      if (_length < 3) {
        setSelectedLeg2StrikePrice(strikePrice);
        setSelectedLeg2StrikeId(
          tempLegState?.strikes[strikeIndex]?.strikeId ?? 0
        );
      }
    }
  };

  const updateCustomizedLegs = async () => {
    const updateLegForChain = async (chainId) => {
      if (selectedExpiry1Id && selectedLeg1StrikeId && selectedLeg2StrikeId) {
        let temp;
        if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
          temp = [...optimismOCs];
        } else {
          temp = [...arbitrumOCs];
        }

        const expiryTimestamp = allBoards[chain?.id ?? 10][assetSymbol].find(
          (item: Board) => item.id === selectedExpiry1Id
        ).expiryTimestamp;

        const expiryTimestamp2 = allBoards[chain?.id ?? 10][assetSymbol].find(
          (item: Board) => item.id === selectedExpiry2Id
        )?.expiryTimestamp;

        const tempBoards = allBoards[chainId][assetSymbol];

        const index = temp.findIndex(
          (item) => item?.strategyName === oneClick.strategyName
        );

        const board = tempBoards.find(
          (item: Board) => item.expiryTimestamp === expiryTimestamp
        );
        const board2 = tempBoards.find(
          (item: Board) => item.expiryTimestamp === expiryTimestamp2
        );

        const strikePrice1 = boards
          .find((item) => item.id === selectedExpiry1Id)
          .strikes()
          .find((item) => item.id === selectedLeg1StrikeId).strikePrice;

        const strikePrice2 = boards
          .find(
            (item) =>
              item.id === (board2 ? selectedExpiry2Id : selectedExpiry1Id)
          )
          .strikes()
          .find((item) => item.id === selectedLeg2StrikeId).strikePrice;

        const tempLeg1StrikeId = board
          .strikes()
          .find((item) => item.strikePrice === strikePrice1).id;

        const tempLeg2StrikeId = (board2 ? board2 : board)
          .strikes()
          .find((item) => item.strikePrice === strikePrice2).id;

        const newLegs = board2
          ? [
              await getOptionDetails(
                board,
                tempLeg1StrikeId,
                defaultLegs[0].isCall,
                defaultLegs[0].isLong
              ),
              await getOptionDetails(
                board,
                tempLeg1StrikeId,
                defaultLegs[1].isCall,
                defaultLegs[1].isLong
              ),
              await getOptionDetails(
                board2,
                tempLeg2StrikeId,
                defaultLegs[2].isCall,
                defaultLegs[2].isLong
              ),
              await getOptionDetails(
                board2,
                tempLeg2StrikeId,
                defaultLegs[3].isCall,
                defaultLegs[3].isLong
              ),
            ]
          : [
              await getOptionDetails(
                board,
                tempLeg1StrikeId,
                defaultLegs[0].isCall,
                defaultLegs[0].isLong
              ),
              await getOptionDetails(
                board,
                tempLeg2StrikeId,
                defaultLegs[1].isCall,
                defaultLegs[1].isLong
              ),
            ];

        temp[index].legs = newLegs;

        const marketAddress = getMarketAddress(chainId, assetSymbol);

        const strategyBidAsk = await getStrategyBidAsk(
          chainId,
          marketAddress,
          newLegs
        );

        temp[index].askPrice = strategyBidAsk.ask;
        temp[index].bidPrice = strategyBidAsk.bid;
        temp[index].noStrikeFound = false;
        if (selectedMode !== 2) {
          if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
            setOptimismOCs(temp);
          }
          if (chainId === ARBITRUM_MAINNET_CHAIN_ID) {
            setArbitrumOCs(temp);
          }
        } else {
          return await temp;
        }
      }
    };
    if (selectedMode === 2) {
      Promise.all([
        updateLegForChain(OPTIMISM_MAINNET_CHAIN_ID),
        updateLegForChain(ARBITRUM_MAINNET_CHAIN_ID),
      ]).then((result) => {
        if (result[0]) {
          setOptimismOCs(result[0]);
        }
        if (result[1]) {
          setArbitrumOCs(result[1]);
        }
      });
    } else {
      updateLegForChain(chain?.id);
    }
  };

  return (
    <>
      <Str2
        style={{
          marginTop: oneClick.strategyName === "Synthetic" ? "20px" : "",
        }}
      >
        {/**
         * @dev Align this value cell to be aligned with the header cell
         */}
        <Std role="cell" style={{ maxWidth: "234px" }}>
          <StrategyCell isDataLoaded={suspense.isDataLoaded} />
        </Std>
        <Std
          role="cell"
          style={{
            justifyContent: "center",
            maxWidth: "300px",
          }}
        >
          <PriceCell
            isApprovedForAll={isApprovedForAll}
            suspense={suspense}
            handleSocketPlugin={handleSocketPlugin}
          />
        </Std>

        {/* { customize.isCustomizePanelOpen ? null : (
          <> */}
        <Std role="cell" style={{ fontSize: "13px", width: "20%" }}>
          {oneClick &&
            oneClick.legs.length > 0 &&
            oneClick.legs.map((itm, index, _legs) => (
              <Fragment key={`${oneClick.strategyName}-${index}-itm.strikeId`}>
                {((_legs.length === 4 && (index === 0 || index === 2)) ||
                  _legs.length === 2) && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      minWidth:
                        oneClick.strategyName === "Roll" ? "230px" : "190px",
                      width: "50%",
                      marginBottom: index === 0 ? "5px" : "0",
                      paddingRight:
                        oneClick.strategyName === "Roll" ? "4px" : "",
                    }}
                  >
                    <ComboBoxContainer>
                      {_legs.length === 2 ? (
                        <>
                          <p style={{ color: "#fff2fb" }}>
                            {itm.isLong ? "+1" : "- 1"}
                          </p>
                          <p style={{ color: "#fff2fb", marginRight: "5px" }}>
                            {itm.isCall ? "C" : "P"}
                          </p>
                        </>
                      ) : (
                        <p
                          style={{
                            color: "#fff2fb",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {index === 0 ? "+1 Combo  " : "- 1 Combo"}
                        </p>
                      )}
                      <Selector
                        isOnArbitrum={isOnArbitrum}
                        disabled={index === 1 || index === 3}
                        value={
                          _legs.length > 2 && index > 1
                            ? selectedExpiry2
                            : selectedExpiry1
                        }
                        expiry
                      >
                        {legState &&
                          legState.length &&
                          legState
                            .sort(
                              (a, b) =>
                                new Date(a.expiry).getTime() -
                                new Date(b.expiry).getTime()
                            )
                            .map((itm, itmIndex) => (
                              <Fragment key={itm.boardId}>
                                {_legs.length < 3 ||
                                (index < 2 && itmIndex !== 0) ||
                                (index > 1 &&
                                  new Date(itm.expiry) <
                                    new Date(selectedExpiry1)) ? (
                                  <SelectorMenuOption
                                    isOnArbitrum={isOnArbitrum}
                                    key={itm.boardId}
                                    value={itm.expiry}
                                    onClick={(e) => {
                                      boardChangeHandler(e, index, _legs);
                                    }}
                                  >
                                    {itm.expiry}
                                  </SelectorMenuOption>
                                ) : null}
                              </Fragment>
                            ))}
                      </Selector>
                      <Selector
                        isOnArbitrum={isOnArbitrum}
                        disabled={
                          (index === 1 || index === 3) &&
                          valueOfSecondLeg === "Equal"
                        }
                        value={Math.round(
                          (_legs.length > 2 && index < 2) || index === 0
                            ? selectedLeg1StrikePrice
                            : selectedLeg2StrikePrice
                        )}
                      >
                        <SelectorMenuOption
                          isOnArbitrum={isOnArbitrum}
                          disabled
                          value={0}
                          style={{ opacity: "0.5" }}
                        >
                          ----
                        </SelectorMenuOption>
                        {legState &&
                          legState.length &&
                          legState
                            .find(
                              (itm) =>
                                itm.expiry ===
                                (index < 2 ? selectedExpiry1 : selectedExpiry2)
                            )
                            ?.strikes.sort(
                              (a, b) => a.strikePrice - b.strikePrice
                            )
                            .filter((__item) =>
                              isDeltaBetween01and09(__item, index)
                            )
                            .map((itm, strikeIndex, stikeArray) => (
                              <Fragment key={itm.strikeId}>
                                {(index === 0 &&
                                  (strikeIndex !== 0 ||
                                    valueOfSecondLeg !== "Lower") &&
                                  (strikeIndex !== stikeArray.length - 1 ||
                                    valueOfSecondLeg !== "Higher")) ||
                                (index !== 0 &&
                                  ((valueOfSecondLeg === "Lower" &&
                                    itm.strikePrice <
                                      selectedLeg1StrikePrice) ||
                                    (valueOfSecondLeg === "Higher" &&
                                      itm.strikePrice >
                                        selectedLeg1StrikePrice) ||
                                    valueOfSecondLeg === "Equal")) ? (
                                  <SelectorMenuOption
                                    isOnArbitrum={isOnArbitrum}
                                    value={Math.round(itm.strikePrice)}
                                    onClick={(e) => {
                                      priceChangeHandler(
                                        e,
                                        index,
                                        _legs.length
                                      );
                                    }}
                                  >
                                    {Math.round(itm.strikePrice)}
                                  </SelectorMenuOption>
                                ) : null}
                              </Fragment>
                            ))}
                      </Selector>
                    </ComboBoxContainer>
                  </div>
                )}
              </Fragment>
            ))}
        </Std>

        {/**
         * @dev Align value cell with the appropriate header cell
         */}
        <Std
          role="cell"
          onClick={updateCustomizedLegs}
          style={{
            maxWidth: "234px",
            justifyContent: "center",
          }}
        >
          <UpdateButton isOnArbitrum={isOnArbitrum} style={{}}>
            Update
          </UpdateButton>
        </Std>
      </Str2>
    </>
  );
};

const Selector = ({
  children,
  disabled,
  value,
  isOnArbitrum,
  expiry = false,
}) => {
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsDropDownOpen(false));

  return (
    <>
      <div ref={ref} style={{ position: "relative" }}>
        <SelectorDiv
          isOnArbitrum={isOnArbitrum}
          style={{
            opacity: disabled ? "0.5" : "1",
            cursor: disabled ? "not-allowed" : "pointer",
            minWidth: expiry ? "81px" : "75px",
          }}
          onClick={() => !disabled && setIsDropDownOpen(!isDropdownOpen)}
        >
          <SelectorValue>{value ? value : "----"}</SelectorValue>
          <DropdownSVG />
        </SelectorDiv>
        {isDropdownOpen && (
          <SelectionDropDown
            isOnArbitrum={isOnArbitrum}
            onClick={() => {
              setIsDropDownOpen(false);
            }}
          >
            {children}
          </SelectionDropDown>
        )}
      </div>
    </>
  );
};

interface IsOnArbitrumProp {
  isOnArbitrum: boolean;
}

const UpdateButton = styled.button<IsOnArbitrumProp>`
  padding: 5px;
  width: 100%;
  max-width: 100px;
  border-color: ${(props) =>
    props.isOnArbitrum ? "#3da9f1" : "rgba(253, 172, 205, 1)"};
  border-width: 1px;
  border-style: solid;
  border-radius: 2rem;

  font-family: InterVariable, sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: ${(props) =>
    props.isOnArbitrum ? "#3da9f1" : "rgba(253, 172, 205, 1)"};

  cursor: pointer;

  background-color: transparent;
  backdrop-filter: blur(18px);
  box-shadow: ${(props) =>
    props.isOnArbitrum
      ? "0px 0px 10px rgb(61 169 241 / 70%)"
      : "0px 0px 10px rgba(253, 172, 205, 0.7)"};

  transition: 0.07s ease;

  &:hover {
    transition: 0.055s ease;
    opacity: 0.8;
    transform: scaleX(0.985) scaleY(0.985);
    background-color: rgba(72, 48, 62, 1);
  }

  &:active {
    transition: 0.055s ease;
    opacity: 0.95;
    transform: scaleX(0.9725) scaleY(0.9725);
    background-color: transparent;
  }
`;

const SelectorMenuOption = styled.option<IsOnArbitrumProp>`
  color: ${(props) =>
    props.isOnArbitrum ? "#3da9f1" : "rgba(253, 172, 205, 1)"};
  text-align: center;
  padding: 1px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    opacity: 0.9;
    background-color: rgba(40, 29, 35, 0.79);
  }
`;

const SelectionDropDown = styled.div<IsOnArbitrumProp>`
  position: absolute;
  right: 0;
  left: 0;
  top: 32px;
  z-index: 100;
  overflow: hidden;

  box-shadow: ${(props) =>
    props.isOnArbitrum
      ? "0px 0px 10px rgb(61 169 241 / 40%)"
      : "0px 0px 10px rgba(253, 172, 205, 0.4)"};
  backdrop-filter: blur(40px);
  color: rgb(255, 242, 251);
  border-radius: 1rem;
  background-color: rgba(50, 39, 45, 0.8);
  transform-origin: var(--popper-transform-origin);
  visibility: visible;
  opacity: 1;
  transform: none;
`;

const SelectorValue = styled.div`
  margin-right: 5px;
  white-space: nowrap;
`;

const SelectorDiv = styled.div<IsOnArbitrumProp>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${(props) =>
    props.isOnArbitrum ? "#3da9f1" : "rgba(253, 172, 205, 1)"};
  cursor: pointer;
  background: transparent;
  -webkit-backdrop-filter: blur(2.5px);
  backdrop-filter: blur(2.5px);
  border-radius: 20px;
  margin: 0 2px;
  min-width: 75px;
  padding: 5px 8px 5px 12px;
  box-shadow: ${(props) =>
    props.isOnArbitrum
      ? "0px 0px 10px rgb(61 169 241 / 30%)"
      : "0px 0px 10px rgba(253, 172, 205, 0.3)"};
  border: 1px solid;
  border-color: ${(props) =>
    props.isOnArbitrum ? "#3da9f1" : "rgba(253, 172, 205, 1)"};
`;

const ComboBoxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: auto;
  min-width: 225px;
`;

export const RightArrowSVGContent = styled.div`
  display: flex;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;

  width: 16px;
  height: 16px;
`;

export const RightArrowSVGWrapper = styled.div`
  display: flex;
  -webkit-box-pack: end;
  justify-content: flex-end;

  padding-left: 8px;
`;

/**
 * @todo Hard coded `width` becomes an issue for flex-grow to work without
 *       refreshing the page.
 */
const Std = styled.td`
  display: flex;
  flex-wrap: wrap;
  padding: 16px 24px;

  flex: 150 0 auto;
  width: 150px;

  -webkit-box-align: center;
  align-items: flex-start;
`;

export const Str2 = styled.tr`
  display: flex;
`;

export default memo(OneClickSection);
