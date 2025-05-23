// Externals
import { useNetwork } from "wagmi";
import React, { FC, useContext, useMemo, useState } from "react";
// Locals
import TableHead from "../TableHead";
import OneClickSection from "../../../sections/one-clicks/one-click";
import { STable, Stbody } from "../StrategyTable";
// Contexts
import { ocqmsContext } from "../../../contexts/ocqmsContext";
import { OneClickContext } from "../../../contexts/OneClickContext";
import { LyraOptionDataContext } from "../../../contexts/LyraOptionDataContext";
// Types, props, and utils
import { OneClicksTableProps } from "../../../utils/props";
import { OCQuickMenuState, ocType } from "../../../utils/types";
// Constants
import {
  ARBITRUM_MAINNET_CHAIN_ID,
  initOCQuickMenuState,
  initOneClicks,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// CSS
import { cards, fonts } from "../../../theme/styles";
import { definitelyCentered } from "../../../theme/componentStyles";
// Images
import { ReactComponent as InfoIconSVG } from "../../../assets/svg/info-icon-bright-orange.svg";

const firstHeaderName = "Strategy";
const isOneClicks = true;

const OneClicksTable: FC<OneClicksTableProps> = ({
  isDataLoaded,
  handleSocketPlugin,
}) => {
  const { chain } = useNetwork();
  const { arbitrumOCs, optimismOCs, boards, selectedMode } = useContext(
    LyraOptionDataContext
  );

  const isOnOptimism = useMemo((): boolean => {
    return chain?.id === OPTIMISM_MAINNET_CHAIN_ID;
  }, [chain?.id]);
  const isOnArbitrum = useMemo((): boolean => {
    return chain?.id === ARBITRUM_MAINNET_CHAIN_ID;
  }, [chain?.id]);

  const oneClicks = useMemo((): ocType[] => {
    let oneClicks = initOneClicks;

    isOnArbitrum
      ? (oneClicks = arbitrumOCs as ocType[])
      : (oneClicks = optimismOCs as ocType[]);

    return oneClicks;
  }, [arbitrumOCs, optimismOCs, isOnArbitrum]);

  // custom
  const [ocQuickMenuState, setOCQuickMenuState] =
    useState<OCQuickMenuState>(initOCQuickMenuState);

  const ocqmsContext_ = useMemo(
    () => ({
      ocQuickMenuState,
      setOCQuickMenuState,
    }),
    [ocQuickMenuState, setOCQuickMenuState]
  );

  const noBoardFound =
    !isDataLoaded.dataIsLoading &&
    oneClicks
      .map((oc: ocType) => oc.noStrikeFound)
      .every((noStrikeFound) => noStrikeFound === true) &&
    selectedMode !== 2;

  return (
    <>
      {noBoardFound ? (
        <>
          <div style={{ ...definitelyCentered, display: "flex" }}>
            <div
              style={{
                width: "450px",
                display: "flex",
                padding: "24px",
                textAlign: "center",
                flexDirection: "column",
                borderRadius: "20px",
                backgroundColor: cards.backgroundColor,
                margin: "150px 150px 185px 150px",
              }}
            >
              <InfoIconSVG
                style={{
                  width: "18px",
                  height: "18px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  position: "relative",
                  marginBottom: "8px",
                }}
              />
              <p
                style={{
                  marginBottom: "8px",
                  fontSize: fonts.sizes.md,
                  color: fonts.colors.solid.brightOrange,
                }}
              >
                {"No tradeable markets are available at this time."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <STable role="table">
            <TableHead
              isOneClicks={isOneClicks}
              firstHeaderName={firstHeaderName}
            />
            <Stbody>
              <ocqmsContext.Provider value={ocqmsContext_}>
                {oneClicks.map((oneClick: ocType, oneClickIndex: number) => (
                  <React.Fragment
                    key={`${oneClickIndex}-${oneClick.strategyName}`}
                  >
                    <OneClickContext.Provider
                      value={{
                        ocIndex: oneClickIndex,
                        optimismOC: optimismOCs[oneClickIndex],
                        arbitrumOC: arbitrumOCs[oneClickIndex],
                        optimismOCs: optimismOCs,
                        arbitrumOCs: arbitrumOCs,
                        oneClickIndex,
                        boards,
                      }}
                    >
                      <OneClickSection
                        handleSocketPlugin={handleSocketPlugin}
                        suspense={{ isDataLoaded: isDataLoaded }}
                      />
                    </OneClickContext.Provider>
                  </React.Fragment>
                ))}
              </ocqmsContext.Provider>
            </Stbody>
          </STable>
        </>
      )}
    </>
  );
};

export default OneClicksTable;
