// Externals
import { useAccount, useNetwork, useProvider, useSwitchNetwork } from "wagmi";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { Board } from "@lyrafinance/lyra-js";
// Locals
import { CardSection, TableSection } from "../strategies/table";
import UnorderedList from "../../components/Lists/UnorderedList";
import OneClicksTable from "../../components/Tables/OneClicksTable";
// Contexts
import { EVMNetworkToggleContext } from "../../contexts/EVMNetworkToggleContext";
import { UnderlierContext } from "../../contexts/UnderlierContext";
import { LyraOptionDataContext } from "../../contexts/LyraOptionDataContext";
// Requests
import {
  getDefaultOCOs,
  getStrategyBidAsk,
} from "../../utils/requests/one-clicks";
// Utils
import { getMarketAddress } from "../../contract-apis/utils";
// Constants
import {
  initOneClicks,
  initDataIsLoaded,
  ARBITRUM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../utils/constants";
// Types
import { ocType, DataIsLoaded } from "../../utils/types";
import { definitelyCentered } from "../../theme/componentStyles";
import HeaderSection from "../λstrategy/deposit-withdraw/HeaderSection";
import { cl, bnToNumber } from "../../utils/misc";
// Types
import styled from "@emotion/styled";
import Spinner from "../../components/Suspense/Spinner";
import { isApprovedForAllOptionToken } from "../../contract-apis/apis/optionToken";
import { getOptionDetails } from "../../utils/requests/one-clicks/utils";
import { id } from "ethers/lib/utils.js";

const isAssets = false;
const title = "Strands 1Clicks";

const OneClicksSection: FC<any> = ({
  currentAssetPrice,
  handleSocketPlugin,
  allBoards,
  selectedMode,
  setSelectedMode,
}) => {
  // web3 variables
  const account = useAccount();
  const provider = useProvider();
  const { chain } = useNetwork();
  const chainId = chain?.id ?? OPTIMISM_MAINNET_CHAIN_ID;
  const { switchNetwork } = useSwitchNetwork();

  // React contexts
  const { assetSymbol } = useContext(UnderlierContext);

  // booleans
  const [isLeft, setIsLeft] = useState<boolean>(
    chain?.id === ARBITRUM_MAINNET_CHAIN_ID ? false : true
  );
  const [isRight, setIsRight] = useState<boolean>(true);
  // number
  const [isDataLoaded, setIsDataLoaded] =
    useState<DataIsLoaded>(initDataIsLoaded);
  const [optimismOCs, setOptimismOCs] = useState<ocType[]>(initOneClicks);
  const [arbitrumOCs, setArbitrumOCs] = useState<ocType[]>(initOneClicks);
  const [boards, setBoards] = useState<Board[]>([]);
  const [showLoader, setShowLoader] = useState(true);
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false);

  const updateStrategyPrices = useCallback(
    async (chainId) => {
      let _oneClicks;
      if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
        _oneClicks = [...optimismOCs];
      } else if (chainId === ARBITRUM_MAINNET_CHAIN_ID) {
        _oneClicks = [...arbitrumOCs];
      }
      //skipping when oneClicks=initOneClicks
      if (
        !_oneClicks.every(
          (oneClick: ocType): boolean => oneClick.legs.length === 1
        )
      ) {
        const marketAddress = getMarketAddress(chainId, assetSymbol);
        await Promise.all(
          _oneClicks.map(async (oc, i): Promise<void> => {
            const strategyBidAsk = await getStrategyBidAsk(
              chainId,
              marketAddress,
              oc.legs,
              1
            );
            _oneClicks[i].askPrice = strategyBidAsk.ask;
            _oneClicks[i].bidPrice = strategyBidAsk.bid;
          })
        );
        if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
          setOptimismOCs(_oneClicks);
        } else if (chainId === ARBITRUM_MAINNET_CHAIN_ID) {
          setArbitrumOCs(_oneClicks);
        }
      } else {
        cl("empty oneClicks chainId=", chainId);
      }
    },
    [assetSymbol, optimismOCs, arbitrumOCs, chain]
  );

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const _isApproveForAll = await isApprovedForAllOptionToken(
        account.address,
        chainId,
        assetSymbol
      );

      if (typeof _isApproveForAll === "boolean")
        setIsApprovedForAll(_isApproveForAll);
    }, 0);

    return () => clearTimeout(timeout);
  }, [account.address, assetSymbol, chainId]);

  // loading initial data in oneClicks
  useEffect(() => {
    const loadInitialOneClicks = async (chainId) => {
      const marketAddress = getMarketAddress(chainId, assetSymbol);
      let tempSelectedBoards = [];

      if (allBoards?.[chainId]?.[assetSymbol]?.length > 1) {
        if (selectedMode === 2) {
          tempSelectedBoards = allBoards?.[chainId]?.[assetSymbol].filter(
            (item) =>
              allBoards?.[
                Object.keys(allBoards).find((_key) => _key !== chainId) ?? 0
              ]?.[assetSymbol].find(
                (_item) => _item.expiryTimestamp === item.expiryTimestamp
              )
          );
        } else {
          tempSelectedBoards = allBoards[chainId][assetSymbol];
        }
        // console.dir(tempSelectedBoards);
        if (chainId === chain?.id) {
          setBoards(tempSelectedBoards);
        }
      }
      if (tempSelectedBoards.length > 1) {
        const updateDefaultOCOs = async () => {
          let defaultOCOs;
          let secondChainDefaultOCOs;
          if (selectedMode === 2) {
            defaultOCOs = await getDefaultOCOs(
              tempSelectedBoards,
              selectedMode,
              chainId,
              assetSymbol,
              allBoards
            );
            if (defaultOCOs.length > 0) {
              Promise.all(
                defaultOCOs.map(async (oc, i): Promise<void> => {
                  const strategyBidAsk = await getStrategyBidAsk(
                    chainId,
                    marketAddress,
                    oc.legs,
                    1
                  );
                  defaultOCOs[i].askPrice = strategyBidAsk.ask;
                  defaultOCOs[i].bidPrice = strategyBidAsk.bid;
                })
              ).then(async () => {
                const secondChainId = [
                  OPTIMISM_MAINNET_CHAIN_ID,
                  ARBITRUM_MAINNET_CHAIN_ID,
                ].find((item) => item !== chainId);
                if (secondChainId) {
                  secondChainDefaultOCOs =
                    secondChainId === ARBITRUM_MAINNET_CHAIN_ID
                      ? [...arbitrumOCs]
                      : [...optimismOCs];

                  Promise.all(
                    secondChainDefaultOCOs.map(async (item, index) => {
                      const expiryTimestamp = allBoards[chainId ?? 10][
                        assetSymbol
                      ].find(
                        (item: Board) =>
                          item.id === defaultOCOs[index].legs[0].boardId
                      ).expiryTimestamp;

                      const expiryTimestamp2 =
                        allBoards[chainId ?? 10][assetSymbol].find(
                          (item: Board) =>
                            item.id === defaultOCOs[index].legs[2]?.boardId
                        )?.expiryTimestamp ?? 0;

                      const tempBoards = allBoards[secondChainId][assetSymbol];

                      const board = tempBoards.find(
                        (item: Board) =>
                          item.expiryTimestamp === expiryTimestamp
                      );
                      const board2 = tempBoards.find(
                        (item: Board) =>
                          item.expiryTimestamp === expiryTimestamp2
                      );
                      const tempLeg1StrikeId = board
                        .strikes()
                        .find(
                          (item) =>
                            item.strikePrice ===
                            defaultOCOs[index].legs[0].strikePrice
                        )?.id;

                      const tempLeg2StrikeId = (board2 ?? board)
                        .strikes()
                        .find(
                          (item) =>
                            item.strikePrice ===
                            (defaultOCOs[index].legs?.length < 3
                              ? defaultOCOs[index].legs[1]?.strikePrice
                              : defaultOCOs[index].legs[3]?.strikePrice)
                        )?.id;

                      let newLegs: any[] = [];

                      if (tempLeg1StrikeId && tempLeg2StrikeId) {
                        newLegs =
                          defaultOCOs[index].legs.length > 3
                            ? [
                                await getOptionDetails(
                                  board,
                                  tempLeg1StrikeId,
                                  defaultOCOs[index].legs[0].isCall,
                                  defaultOCOs[index].legs[0].isLong
                                ),
                                await getOptionDetails(
                                  board,
                                  tempLeg1StrikeId,
                                  defaultOCOs[index].legs[1].isCall,
                                  defaultOCOs[index].legs[1].isLong
                                ),
                                await getOptionDetails(
                                  board2,
                                  tempLeg2StrikeId,
                                  defaultOCOs[index].legs[2].isCall,
                                  defaultOCOs[index].legs[2].isLong
                                ),
                                await getOptionDetails(
                                  board2,
                                  tempLeg2StrikeId,
                                  defaultOCOs[index].legs[3].isCall,
                                  defaultOCOs[index].legs[3].isLong
                                ),
                              ]
                            : [
                                await getOptionDetails(
                                  board,
                                  tempLeg1StrikeId,
                                  defaultOCOs[index].legs[0].isCall,
                                  defaultOCOs[index].legs[0].isLong
                                ),
                                await getOptionDetails(
                                  board,
                                  tempLeg2StrikeId,
                                  defaultOCOs[index].legs[1].isCall,
                                  defaultOCOs[index].legs[1].isLong
                                ),
                              ];
                        secondChainDefaultOCOs[index].legs = newLegs;
                      }

                      let strategyBidAsk;

                      if (newLegs.length > 0) {
                        const marketAddress = getMarketAddress(
                          secondChainId,
                          assetSymbol
                        );

                        strategyBidAsk = await getStrategyBidAsk(
                          secondChainId,
                          marketAddress,
                          newLegs
                        );
                        secondChainDefaultOCOs[index].askPrice =
                          await strategyBidAsk.ask;
                        secondChainDefaultOCOs[index].bidPrice =
                          await strategyBidAsk.bid;
                        secondChainDefaultOCOs[index].noStrikeFound = false;
                      } else {
                        secondChainDefaultOCOs[index].askPrice = 0;
                        secondChainDefaultOCOs[index].bidPrice = 0;
                        secondChainDefaultOCOs[index].noStrikeFound = true;
                      }
                    })
                  ).then(async () => {
                    if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
                      setIsDataLoaded({
                        dataIsLoaded: true,
                        dataIsLoading: false,
                      });
                      setOptimismOCs(await defaultOCOs);
                      setArbitrumOCs(await secondChainDefaultOCOs);
                      return;
                    }
                    if (chainId === ARBITRUM_MAINNET_CHAIN_ID) {
                      setIsDataLoaded({
                        dataIsLoaded: true,
                        dataIsLoading: false,
                      });
                      setArbitrumOCs(defaultOCOs);
                      setOptimismOCs(secondChainDefaultOCOs);
                      return;
                    }
                  });
                }
              });
            }
          } else {
            defaultOCOs = await getDefaultOCOs(
              tempSelectedBoards,
              selectedMode,
              chainId,
              assetSymbol
            );
            if (defaultOCOs.length > 0) {
              Promise.all(
                defaultOCOs.map(async (oc, i): Promise<void> => {
                  const strategyBidAsk = await getStrategyBidAsk(
                    chainId,
                    marketAddress,
                    oc.legs,
                    1
                  );
                  defaultOCOs[i].askPrice = strategyBidAsk.ask;
                  defaultOCOs[i].bidPrice = strategyBidAsk.bid;
                })
              ).then(() => {
                if (chainId === ARBITRUM_MAINNET_CHAIN_ID) {
                  setArbitrumOCs(defaultOCOs);
                } else if (chainId === OPTIMISM_MAINNET_CHAIN_ID) {
                  setOptimismOCs(defaultOCOs);
                }
                setIsDataLoaded({
                  dataIsLoaded: true,
                  dataIsLoading: false,
                });
              });
            }
          }
        };

        setIsDataLoaded({
          dataIsLoaded: false,
          dataIsLoading: true,
        });

        updateDefaultOCOs();
      }
    };

    let requests;
    if (selectedMode === 1) {
      requests = [loadInitialOneClicks(OPTIMISM_MAINNET_CHAIN_ID)];
    } else if (selectedMode === 2) {
      requests = [loadInitialOneClicks(chain?.id)];
    } else if (selectedMode === 3) {
      requests = [loadInitialOneClicks(ARBITRUM_MAINNET_CHAIN_ID)];
    }

    Promise.all(requests).then((_response: any) => {
      if (showLoader) {
        setShowLoader(!showLoader);
      }
    });
  }, [allBoards, chain, assetSymbol, showLoader, selectedMode]);

  // // Update every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.history.state !== undefined) {
        setIsDataLoaded({
          dataIsLoaded: false,
          dataIsLoading: true,
        });
        // Update on interval
        let requests;
        if (selectedMode === 1) {
          requests = [updateStrategyPrices(OPTIMISM_MAINNET_CHAIN_ID)];
        } else if (selectedMode === 2) {
          requests = [
            updateStrategyPrices(OPTIMISM_MAINNET_CHAIN_ID),
            updateStrategyPrices(ARBITRUM_MAINNET_CHAIN_ID),
          ];
        } else if (selectedMode === 3) {
          requests = [updateStrategyPrices(ARBITRUM_MAINNET_CHAIN_ID)];
        }

        Promise.all(requests).then((_response: any) => {
          setIsDataLoaded({
            dataIsLoaded: true,
            dataIsLoading: false,
          });
        });
      }
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, [selectedMode, updateStrategyPrices]);

  const isOnOptimism = useMemo((): boolean => {
    return chain?.id === OPTIMISM_MAINNET_CHAIN_ID;
  }, [chain?.id]);
  const isOnArbitrum = useMemo((): boolean => {
    return chain?.id === ARBITRUM_MAINNET_CHAIN_ID;
  }, [chain?.id]);

  function handleToggleOptimism(): void {
    if (!isOnOptimism) switchNetwork?.(OPTIMISM_MAINNET_CHAIN_ID);
    setSelectedMode(1);
  }

  function handleToggleBothNetworks(): void {
    setSelectedMode(2);
  }

  function handleToggleArbitrum(): void {
    if (!isOnArbitrum) switchNetwork?.(ARBITRUM_MAINNET_CHAIN_ID);
    setSelectedMode(3);
  }

  useLayoutEffect(() => {
    if (selectedMode === 1 && chain?.id === OPTIMISM_MAINNET_CHAIN_ID) {
      setIsLeft(true);
      setIsRight(false);
    } else if (selectedMode === 2) {
      setIsLeft(true);
      setIsRight(true);
    } else if (selectedMode === 3 && chain?.id === ARBITRUM_MAINNET_CHAIN_ID) {
      setIsLeft(false);
      setIsRight(true);
    }
  }, [chain?.id, selectedMode]);

  return (
    <>
      <CardSection style={{ paddingBottom: "20px" }}>
        <EVMNetworkToggleContext.Provider
          value={{
            isLeft: isLeft,
            isRight: isRight,
            selectedMode: selectedMode,
            handleToggleOptimism: handleToggleOptimism,
            handleToggleArbitrum: handleToggleArbitrum,
            handleToggleBothNetworks: handleToggleBothNetworks,
          }}
        >
          <LyraOptionDataContext.Provider
            value={{
              optimismOCs: optimismOCs,
              arbitrumOCs: arbitrumOCs,
              boards: boards,
              isApprovedForAll: isApprovedForAll,
              allBoards: allBoards,
              selectedMode: selectedMode,
              setOptimismOCs: setOptimismOCs,
              setArbitrumOCs: setArbitrumOCs,
              currentAssetPrice: currentAssetPrice,
            }}
          >
            {/* EVM network toggle buttons */}
            <div
              style={{
                ...definitelyCentered,
                paddingTop: "0px",
              }}
            >
              <HeaderSection
                isOneClicks={true}
                evmNetworkToggle={{
                  selectedMode: selectedMode,
                  handleToggleOptimism: handleToggleOptimism,
                  handleToggleArbitrum: handleToggleArbitrum,
                  handleToggleBothNetworks: handleToggleBothNetworks,
                }}
              />
            </div>

            <div
              className="section-title"
              style={{ margin: "24px 24px 12px 24px" }}
            >
              {title}
            </div>
            <UnorderedList isAssets={isAssets} />
            {!showLoader ? (
              <TableSection>
                <OneClicksTable
                  isDataLoaded={isDataLoaded}
                  handleSocketPlugin={handleSocketPlugin}
                />
              </TableSection>
            ) : (
              <SpinnerDiv>
                <Spinner height="100px" width="100px" />
              </SpinnerDiv>
            )}
          </LyraOptionDataContext.Provider>
        </EVMNetworkToggleContext.Provider>
      </CardSection>
    </>
  );
};

export default OneClicksSection;

const SpinnerDiv = styled.div`
  height: 60vh;
  display: grid;
  place-items: center;
`;
