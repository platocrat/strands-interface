// Externals
import React, { FC, memo, useMemo, useContext, useCallback } from "react";
// Locals
// Contexts
import { ocqmsContext } from "../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../contexts/OneClickContext";
import { BidAskMenuContext } from "../../../contexts/BidAskMenuContext";
// Constants
import {
  ARBITRUM_MAINNET_CHAIN_ID,
  ocStrategyConfigs,
} from "../../../utils/constants";
// Utils
import { bnToNumber, nFormatter, numberWithCommas } from "../../../utils/misc";
// Props
import { OneClickOptionLegsProps } from "../../../utils/props";
// CSS
import {
  pqvStyle,
  bidAskQuickMenuInputStyle,
  definitelyCentered,
} from "../../../theme/componentStyles";
import { fonts } from "../../../theme/styles";
import { useNetwork } from "wagmi";
import { ocType } from "../../../utils/types";

const OneClickOptionLegs: FC<OneClickOptionLegsProps> = ({
  size,
  isBuy,
  isArbi,
  web3User,
  debouncedOnLiqPriceChange,
}) => {
  const { chain } = useNetwork();

  // React contexts
  const {
    collaterals,
    isSimpleView,
    finalPositions,
    setIsSimpleView,
    existingPositions,
  } = useContext(BidAskMenuContext);
  const { ocQuickMenuState } = useContext(ocqmsContext);
  const { arbitrumOC, optimismOC, ocIndex } = useContext(OneClickContext);

  const isOnArbitrum = useMemo((): boolean => {
    return chain?.id === ARBITRUM_MAINNET_CHAIN_ID;
  }, [chain?.id]);

  const oneClick = useMemo((): ocType => {
    return (isArbi as boolean) || isOnArbitrum ? arbitrumOC : optimismOC;
  }, [isOnArbitrum, arbitrumOC, optimismOC]);

  // Regular constants
  const strategyName: string = oneClick.strategyName;

  // Constants using useMemo or useCallback
  const hasInputOutline = useMemo((): string => {
    return "none";
  }, []);
  const finalSize = useCallback(
    (i: number): string => {
      let finalSize = `0`;

      const eP = existingPositions[i];
      const oldSize = eP.amount;
      const oldIsLong = eP.isLong;

      const strategyName = oneClick.strategyName;
      // Flip direction of input long based on whether the direction of the
      // strategy the user has selected `isBuy`
      const isInputLong = isBuy
        ? ocStrategyConfigs[strategyName][i][0]
        : !ocStrategyConfigs[strategyName][i][0];

      const finalPosition_: { size: number; isLong: boolean } = {
        size: 0,
        isLong: true,
      };

      if (oldIsLong === isInputLong) {
        finalPosition_.size = size + oldSize;
        finalPosition_.isLong = isInputLong;
      } else {
        // Selling when old position is a buy
        if (size >= oldSize) {
          finalPosition_.size = size - oldSize;
          finalPosition_.isLong = !oldIsLong;
        } else {
          // Buying when old position is a sell
          finalPosition_.size = oldSize - size;
          finalPosition_.isLong = oldIsLong;
        }
      }

      finalPosition_.isLong
        ? (finalSize = `LONG ${finalPosition_.size.toFixed(2)}`)
        : (finalSize = `SHORT ${finalPosition_.size.toFixed(2)}`);

      return finalSize;
    },
    [size, isBuy, existingPositions, oneClick.strategyName]
  );

  // -------------------------- Regular functions ------------------------------
  function optionLine(isCall: boolean, index: number): string {
    if (
      oneClick.legs[index]?.strikePrice !== undefined &&
      oneClick.legs[index]?.strikePrice !== "----"
    ) {
      if (isSimpleView) {
        const strikePrice = nFormatter(
          bnToNumber(oneClick.legs[index].strikePrice, 2),
          4
        );
        const isCallLiqPrice = `${isCall ? "C" : "P"} Liq. Price`;
        return `${strikePrice} ${isCallLiqPrice}`;
      } else {
        const strikePrice = bnToNumber(oneClick.legs[index].strikePrice, 2);
        const callOrPut = `${isCall ? "C" : "P"}`;

        let expiry = oneClick.legs[index].expiry.toDateString();
        expiry = expiry.slice(0, expiry.indexOf(" ", 8));

        const expiryMonth = expiry
          .slice(expiry.indexOf(" "))
          .slice(0, 4)
          .toUpperCase();
        const expiryDay = expiry.slice(expiry.indexOf(" ", 4));

        return `${expiryMonth} ${expiryDay} ${callOrPut}${strikePrice}`;
      }
    } else {
      return "";
    }
  }

  function handleSeeMoreDetails(e: any): void {
    e.preventDefault();
    setIsSimpleView(!isSimpleView);
  }

  return (
    <>
      {(isNaN(size) || size === 0) &&
      ocQuickMenuState.oneClickIndex === ocIndex ? null : (
        <>
          <div style={{ ...definitelyCentered, marginBottom: "12px" }}>
            <button
              className="one-click-option-leg-view-button"
              onClick={(e: any) => handleSeeMoreDetails(e)}
            >
              {`Click to see ${isSimpleView ? `detailed` : `simple`} view`}
            </button>
          </div>

          {isSimpleView ? (
            <>
              {/* --------------------------- Simple view ------------------------- */}
              {ocStrategyConfigs[oneClick.strategyName].map(
                (leg, i: number) => (
                  <React.Fragment
                    key={`simple-view-${i}-${
                      leg[1] /* isCall */ ?? "undefined"
                    }`}
                  >
                    {finalPositions[i].isLong ? null : (
                      <React.Fragment key={`collateral-${i}`}>
                        <div style={{ marginBottom: "4px" }}>
                          {/* Liq Price */}
                          <div
                            style={{ textAlign: "center" }}
                            className="slider-liq-price"
                          >
                            <p className="option-line-text">
                              {optionLine(leg[1], i)}
                            </p>
                            {/* Value */}
                            <div className="slider-liq-price-value">
                              <input
                                step={0.01}
                                min={"0"}
                                type={"number"}
                                id={`${i}-${strategyName}-${
                                  isBuy ? "ask" : "bid"
                                }-quick-menu-input-${
                                  isArbi ? "arbitrum" : "optimism"
                                }`}
                                style={{
                                  ...bidAskQuickMenuInputStyle,
                                  top: "0px",
                                  outline: hasInputOutline,
                                }}
                                onChange={(e: any) =>
                                  debouncedOnLiqPriceChange(e, i, isBuy, leg[1])
                                }
                              />
                            </div>
                          </div>

                          {(isBuy ? leg[0] : !leg[0]) ? null : (
                            <>
                              {/* Collateral */}
                              <div className="slider-liq-price">
                                <p className="slider-liq-price-text">
                                  {`Collateral`}
                                </p>

                                {/* Values */}
                                <div
                                  style={{
                                    display: "flex",
                                    marginLeft: "24px",
                                  }}
                                >
                                  {/* Existing collateral */}
                                  {existingPositions[i].collateral === 0 ? (
                                    <p>{`$0.00`}</p>
                                  ) : (
                                    <s>
                                      {`$${numberWithCommas(
                                        existingPositions[i].collateral,
                                        2
                                      )}`}
                                    </s>
                                  )}
                                  <div style={{ margin: "0 8px" }}>{`→`}</div>
                                  {/* Final collateral */}
                                  <div style={pqvStyle}>
                                    {`$${numberWithCommas(collaterals[i], 2)}`}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          style={{
                            margin: "8px",
                            borderRadius: "3rem",
                            boxShadow: `0px 0.25px 1.1px black`,
                            borderBottom: `2.5px solid ${fonts.colors.solid.darkPink}`,
                          }}
                        />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )
              )}
            </>
          ) : (
            <>
              <div>
                {/* ------------------------- Detailed view ------------------------- */}
                {ocStrategyConfigs[oneClick.strategyName].map(
                  (leg, i: number) => (
                    <React.Fragment
                      key={`simple-view-${i}-${leg[1] ?? "undefined"}`}
                    >
                      <div style={{ marginBottom: "4px" }}>
                        <div>
                          <p
                            className="option-line-text"
                            style={{ fontSize: "14px" }}
                          >
                            {optionLine(leg[1] as boolean, i)}
                          </p>
                        </div>

                        {/* Position size */}
                        <div
                          style={{ display: "flex" }}
                          className="slider-liq-price"
                        >
                          {/* Label */}
                          <p
                            style={{ width: "30px" }}
                            className="slider-liq-price-text"
                          >
                            {`Position`}
                          </p>

                          {/* Values */}
                          <div
                            style={{
                              display: "flex",
                              marginLeft: "10px",
                              textAlign: "right",
                              position: "relative",
                            }}
                          >
                            {/* Existing position size */}
                            {existingPositions[i].amount === 0 ? (
                              <p>{`0.00`}</p>
                            ) : (
                              <s
                                style={{
                                  color: existingPositions[i].isLong
                                    ? ""
                                    : fonts.colors.solid.red,
                                }}
                              >
                                {`${
                                  existingPositions[i].isLong ? "LONG" : "SHORT"
                                } ${existingPositions[i].amount}`}
                              </s>
                            )}
                            <div style={{ margin: "0 8px" }}>{`→`}</div>
                            {/* Final position size */}
                            <div
                              style={{
                                ...pqvStyle,
                                color:
                                  finalPositions[i].isLong ||
                                  finalPositions[i].size === 0
                                    ? ""
                                    : fonts.colors.solid.red,
                              }}
                            >
                              {finalSize(i)}
                            </div>
                          </div>
                        </div>

                        {finalPositions[i].isLong ||
                        finalPositions[i].size === 0 ? null : (
                          <>
                            {/* Liq Price */}
                            <div className="slider-liq-price">
                              {/* Label */}
                              <p className="slider-liq-price-text">
                                {`Liq. Price`}
                              </p>

                              {/* Value */}
                              <div className="slider-liq-price-value">
                                <input
                                  step={0.01}
                                  min={"0"}
                                  type={"number"}
                                  id={`${i}-${strategyName}-${
                                    isBuy ? "ask" : "bid"
                                  }-quick-menu-input-${
                                    isArbi ? "arbitrum" : "optimism"
                                  }`}
                                  style={{
                                    ...bidAskQuickMenuInputStyle,
                                    top: "0px",
                                    outline: hasInputOutline,
                                  }}
                                  onChange={(e: any) =>
                                    debouncedOnLiqPriceChange(
                                      e,
                                      i,
                                      isBuy,
                                      leg[1]
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {collaterals[i] === 0 &&
                        existingPositions[i].collateral === 0 ? null : (
                          <>
                            {/* Collateral */}
                            <div className="slider-liq-price">
                              <p className="slider-liq-price-text">
                                {`Collateral`}
                              </p>

                              {/* Values */}
                              <div
                                style={{ display: "flex", marginLeft: "24px" }}
                              >
                                {/* Existing collateral */}
                                {existingPositions[i].collateral === 0 ? (
                                  <p>{`$0.00`}</p>
                                ) : (
                                  <s>
                                    {`$${numberWithCommas(
                                      existingPositions[i].collateral,
                                      2
                                    )}`}
                                  </s>
                                )}
                                <div style={{ margin: "0 8px" }}>{`→`}</div>
                                {/* Final collateral */}
                                <div style={pqvStyle}>
                                  {`$${numberWithCommas(collaterals[i], 2)}`}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div
                        style={{
                          margin: "8px",
                          borderRadius: "3rem",
                          boxShadow: `0px 0.25px 1.1px black`,
                          borderBottom: `2.5px solid ${fonts.colors.solid.darkPink}`,
                        }}
                      />
                    </React.Fragment>
                  )
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default memo(OneClickOptionLegs);
