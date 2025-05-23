// Externals
import React, {
  FC,
  memo,
  useMemo,
  useState,
  useContext,
  CSSProperties,
  useLayoutEffect,
} from "react";
import { useNetwork } from "wagmi";
import { BigNumber } from "@ethersproject/bignumber";
// Locals
import Spinner from "../../../Suspense/Spinner";
import AssetImgTernary from "../../../AssetImgTernary";
// Contexts
import { OneClickContext } from "../../../../contexts/OneClickContext";
import { LyraOptionDataContext } from "../../../../contexts/LyraOptionDataContext";
// Utils
import {
  ifpespe,
  areStrikesEqual,
  areExpiriesEqual,
} from "../../../../utils/one-clicks";
import { bnToNumber, numberWithCommas } from "../../../../utils/misc";
// Constants
import { ARBITRUM_MAINNET_CHAIN_ID, initOC } from "../../../../utils/constants";
// Types
import { ocLegType, ocType } from "../../../../utils/types";
// Props
import { StrategyCellProps } from "../../../../utils/props";
// CSS
import { fonts } from "../../../../theme/styles";

const strikePriceMargin = (strategyName: string) => {
  const cssProperties: CSSProperties = {
    marginLeft: strategyName === "Roll" ? "2.5px" : "2.5px",
  };

  return cssProperties;
};

const StrategyCell: FC<StrategyCellProps> = ({ isDataLoaded }) => {
  const { chain } = useNetwork();
  const { ocIndex } = useContext(OneClickContext);
  const { arbitrumOCs, optimismOCs } = useContext(LyraOptionDataContext);

  const isOnArbitrum = useMemo((): boolean => {
    return chain?.id === ARBITRUM_MAINNET_CHAIN_ID;
  }, [chain?.id]);

  const oneClick = useMemo((): ocType => {
    let oneClick = initOC;

    isOnArbitrum
      ? (oneClick = arbitrumOCs[ocIndex] as ocType)
      : (oneClick = optimismOCs[ocIndex] as ocType);

    return oneClick;
  }, [chain?.id, arbitrumOCs, optimismOCs]);

  const strategyName = useMemo((): string => {
    return oneClick.strategyName;
  }, [oneClick]);

  // string or numbers
  const [expiries, setExpiries] = useState<string[]>([]);
  const [strikePrices, setStrikePrices] = useState<(string | number)[]>([]);

  let expiries_: string[] = [],
    strikePrices_: (string | number)[] = [];

  useLayoutEffect(() => {
    oneClick.legs.forEach((leg: ocLegType, i: number) => {
      if (
        leg.expiry.getFullYear() === new Date().getFullYear() &&
        leg.expiry.getMonth() === new Date().getMonth() &&
        leg.expiry.getDate() === new Date().getDate()
      ) {
        let strikePrice: string | BigNumber | number = leg.strikePrice;

        expiries_[i] = "----";
        if (strikePrice !== "----") {
          strikePrices_[i] = numberWithCommas(
            bnToNumber(strikePrice.toString(), 2),
            0
          );
        }

        setExpiries(expiries_);
        setStrikePrices(strikePrices_);
      } else {
        let expiry = leg.expiry.toDateString();

        const spaceIndex0 = expiry.indexOf(" ");
        const spaceIndex1 = expiry.indexOf(" ", 8);

        expiry = expiry.slice(spaceIndex0, spaceIndex1);

        let strikePrice: string | BigNumber | number = leg.strikePrice;

        if (strikePrice !== "----") {
          strikePrice = numberWithCommas(bnToNumber(strikePrice, 2), 0);
        }

        expiries_[i] = expiry;
        strikePrices_[i] = strikePrice;

        setExpiries(expiries_);
        setStrikePrices(strikePrices_);
      }
    });
  }, [oneClick.bidPrice]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          WebkitBoxAlign: "center",
          marginTop:
            oneClick.strategyName === "Synthetic" ||
            oneClick.strategyName === "Roll"
              ? "-7px"
              : "-4px",
        }}
      >
        <AssetImgTernary />
        <div style={{ margin: "0px 0px 0px 8px" }}>
          <div className="table-cell-value">
            {strategyName === "Synthetic" ? (
              <>
                <div style={{ marginTop: "4px" }}>{"Combo"}</div>
                <div style={{ fontSize: fonts.sizes.tiny }}>
                  {"(Synthetic underlying)"}
                </div>
              </>
            ) : strategyName === "Roll" ? (
              <div style={{ marginTop: "4px" }}>{strategyName}</div>
            ) : (
              strategyName
            )}
          </div>
          {oneClick.noStrikeFound && isDataLoaded.dataIsLoading ? (
            <>
              <Spinner style={{ marginTop: "5px" }} height="15" width="15" />
            </>
          ) : (
            <>
              <div className="row-title-details" style={{ display: "flex" }}>
                <>
                  {areExpiriesEqual(expiries) ? (
                    <>
                      <div style={{ marginRight: "2.5px" }}>
                        {`${!oneClick.noStrikeFound ? expiries[0] : "----"},`}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        {ifpespe(expiries) ? (
                          <>
                            {[expiries[0], expiries[2]].map(
                              (expiry: string, i: number) => (
                                <div
                                  key={`${i}-strategyCell-${expiry}`}
                                  style={{
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {!oneClick.noStrikeFound ? (
                                    i === 0 ? (
                                      <div
                                        key={`${i}-${expiry}`}
                                        style={{ marginRight: "2.5px" }}
                                      >
                                        {`${expiry}`}
                                      </div>
                                    ) : (
                                      <div
                                        key={`${i}-${expiry}`}
                                        style={{
                                          marginRight:
                                            strategyName === "Roll"
                                              ? "0.0px"
                                              : "2.5px",
                                        }}
                                      >
                                        {`-${expiry},`}
                                      </div>
                                    )
                                  ) : (
                                    i === 0 && (
                                      <div key={`${i}-${expiry}`}>----,</div>
                                    )
                                  )}
                                </div>
                              )
                            )}
                          </>
                        ) : (
                          <>
                            {expiries.map((expiry: string, i: number) => (
                              <React.Fragment
                                key={`${i}-strategyCell-${expiry}`}
                              >
                                {!oneClick.noStrikeFound ? (
                                  i === 0 ? (
                                    <div key={`${i}-${expiry}`}>
                                      {`${expiry}`}
                                    </div>
                                  ) : (
                                    <div key={`${i}-${expiry}`}>
                                      {`-${expiry}, `}
                                    </div>
                                  )
                                ) : (
                                  i === 0 && (
                                    <div key={`${i}-${expiry}`}>----</div>
                                  )
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {areStrikesEqual(strikePrices) ? (
                    <>
                      <div style={strikePriceMargin(strategyName)}>
                        {`${
                          !oneClick.noStrikeFound ? strikePrices[0] : "----"
                        }`}
                      </div>
                    </>
                  ) : (
                    <>
                      {ifpespe(strikePrices) ? (
                        <>
                          <div style={{ display: "flex" }}>
                            {[strikePrices[0], strikePrices[2]].map(
                              (
                                strikePrice: string | number,
                                i: number,
                                arr: (string | number)[]
                              ) => (
                                <React.Fragment
                                  key={`${i}-strategyCell-${strikePrice}`}
                                >
                                  {!oneClick.noStrikeFound ? (
                                    i === 0 ? (
                                      <div key={`${i}-${strikePrice}`}>
                                        {`${strikePrice}`}
                                      </div>
                                    ) : (
                                      <div key={`${i}-${strikePrice}`}>
                                        {`-${strikePrice}`}
                                      </div>
                                    )
                                  ) : (
                                    i === 0 && (
                                      <div key={`${i}-${strikePrice}`}>
                                        ----
                                      </div>
                                    )
                                  )}
                                </React.Fragment>
                              )
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {strikePrices.map(
                            (
                              strikePrice: string | number,
                              i: number,
                              arr: (string | number)[]
                            ) => (
                              <React.Fragment
                                key={`${i}-strategyCell-${strikePrice}`}
                              >
                                {!oneClick.noStrikeFound ? (
                                  i === 0 ? (
                                    <div
                                      key={`${i}-${strikePrice}`}
                                      style={{ marginLeft: "2.5px" }}
                                    >
                                      {`${strikePrice}`}
                                    </div>
                                  ) : (
                                    <div key={`${i}-${strikePrice}`}>
                                      {`-${strikePrice}`}
                                    </div>
                                  )
                                ) : (
                                  i === 0 && (
                                    <div key={`${i}-${strikePrice}`}>----</div>
                                  )
                                )}
                              </React.Fragment>
                            )
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(StrategyCell);
