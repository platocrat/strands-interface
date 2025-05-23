// Externals
import { useNetwork, useProvider } from "wagmi";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
// Locals
import Nav from "../../components/Nav";
import Header from "../../components/Header";
import PageLock from "../../components/PageLock";
import ProductInfo from "../../components/ProductInfo";
import SocketBridge from "../../components/SocketBridge";
import PendingTxToast from "../../components/Toasts/PendingTxToast";
import AssetSelector from "../../components/Selectors/AssetSelector";
import SuccessfulTxToast from "../../components/Toasts/SuccessfulTxToast";
// Sections
import {
  MainPageSection,
  PageContentOuterSection,
  PageContentInnerSection,
  PageContentOuterSectionWrapper,
} from "../vaults";
import OneClicksSection from "../../sections/one-clicks";
import AssetPrice from "../../sections/one-clicks/asset-price";
// Contexts
import { UnderlierContext } from "../../contexts/UnderlierContext";
import { EVMTxSuspenseContext } from "../../contexts/EVMTxSuspense";
// Requests
import { getAndSetAssetPrice } from "../../utils/requests";
import {
  assetObjs,
  ARBITRUM_MAINNET_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
  MS_IN_SECS,
  SECS_IN_MIN,
} from "../../utils/constants";
// CSS
import { definitelyCentered } from "../../theme/componentStyles";
import { getAllBoardsFor } from "../../utils/requests/one-clicks/customize";
import { getMarketAddress } from "../../contract-apis/utils";

const isOneClicks = true;
const isSocketPluginOneClicks = true;

const OneClicksPage = ({ selectedMode, setSelectedMode }) => {
  const provider = useProvider();
  const { chain } = useNetwork();

  const { assetName, assetSymbol } = useContext(UnderlierContext);

  // Boolean
  const [pendingTxConfirmation, setPendingTxConfirmation] =
    useState<boolean>(false);
  const [txConfirmed, setTxConfirmed] = useState<boolean>(false);
  const [openSocketPlugin, setOpenSocketPlugin] = useState<boolean>(false);
  const [assetPriceIsLoading, setAssetPriceIsLoading] =
    useState<boolean>(false);
  // String
  const [txHash, setTxHash] = useState<string>("");
  // number
  const [currentAssetPrice, setCurrentAssetPrice] = useState<number>(0);
  const [lastAssetPrice, setLastAssetPrice] = useState<number>(0);

  const [allBoards, setAllBoards] = useState({});

  function handleSocketPlugin(e: any) {
    e.preventDefault();
    setOpenSocketPlugin(true);
  }

  useEffect(() => {
    const _getLiveBoards = async (chainId) => {
      const getBoardsForChainId = async (chainId) => {
        let temp = {};
        const boards = await getAllBoardsFor(chainId);
        assetObjs.forEach(async (item) => {
          let marketAddress = getMarketAddress(chainId, item.assetSymbol);
          temp[item.assetSymbol] = await boards.filter(
            (item) =>
              item.market().toLowerCase() === marketAddress.toLowerCase()
          );
        });
        return temp;
      };

      Promise.all(
        chainId.map((chain) => {
          return getBoardsForChainId(chain);
        })
      ).then((result) => {
        const temp = {};
        chainId.forEach((_chainId, index) => {
          temp[_chainId] = result[index];
        });
        setAllBoards((prevState) => ({ ...prevState, ...temp }));
      });
    };

    if (
      (Math.abs(currentAssetPrice - lastAssetPrice) * 100) / lastAssetPrice >
      2
    ) {
      console.log("getLiveBoads after spot change >2%", {
        currentAssetPrice,
        lastAssetPrice,
      });
      _getLiveBoards([OPTIMISM_MAINNET_CHAIN_ID, ARBITRUM_MAINNET_CHAIN_ID]);
      setLastAssetPrice(currentAssetPrice);
    } else {
      if (
        !(OPTIMISM_MAINNET_CHAIN_ID in allBoards) &&
        !(ARBITRUM_MAINNET_CHAIN_ID in allBoards)
      ) {
        _getLiveBoards([OPTIMISM_MAINNET_CHAIN_ID, ARBITRUM_MAINNET_CHAIN_ID]);
      } else {
        if (!(OPTIMISM_MAINNET_CHAIN_ID in allBoards)) {
          _getLiveBoards([OPTIMISM_MAINNET_CHAIN_ID]);
        } else {
          _getLiveBoards([ARBITRUM_MAINNET_CHAIN_ID]);
        }
      }
    }
  }, [chain?.id, currentAssetPrice]);

  // ----------------------------- useLayoutEffects ----------------------------
  useLayoutEffect(() => {
    const minutes = 1 / 6;
    const interval = minutes * SECS_IN_MIN * MS_IN_SECS;

    setAssetPriceIsLoading(true);

    const assetPrice = (setCurrentAssetPrice) => {
      Promise.all([
        getAndSetAssetPrice(
          provider.network.chainId,
          (assetName as string).toLowerCase(),
          setCurrentAssetPrice
        ),
      ]).then((response: any) => {
        setAssetPriceIsLoading(false);
      });
    };

    assetPrice(setCurrentAssetPrice);
    assetPrice(setLastAssetPrice);

    // Update on interval
    let updateOptionPriceInterval = setInterval(() => {
      if (
        window.history.state === undefined ||
        window.history.state.assetName === assetName
      ) {
        assetPrice(setCurrentAssetPrice);
      }
    }, interval);

    return () => {
      clearInterval(updateOptionPriceInterval);
    };
  }, [assetName, assetSymbol]);

  return (
    <>
      <PageLock mobileNav={<Nav />} header={<Header />}>
        <div style={{ ...definitelyCentered }}>
          <MainPageSection>
            {openSocketPlugin ? (
              <>
                <SocketBridge
                  provider={provider}
                  isOneClicks={isSocketPluginOneClicks}
                  setOpenSocketPlugin={setOpenSocketPlugin}
                />
              </>
            ) : null}

            {/* Top row */}
            <div style={{ display: "flex" }}>
              <AssetSelector isOneClicks={isOneClicks} />

              <AssetPrice
                currentAssetPrice={currentAssetPrice}
                assetPriceIsLoading={assetPriceIsLoading}
              />
            </div>
            <PageContentOuterSectionWrapper>
              <PageContentOuterSection>
                <PageContentInnerSection>
                  <EVMTxSuspenseContext.Provider
                    value={{
                      setTxHash: setTxHash,
                      txConfirmed: txConfirmed,
                      setTxConfirmed: setTxConfirmed,
                      pendingTxConfirmation: pendingTxConfirmation,
                      setPendingTxConfirmation: setPendingTxConfirmation,
                    }}
                  >
                    <OneClicksSection
                      allBoards={allBoards}
                      setAllBoards={setAllBoards}
                      currentAssetPrice={currentAssetPrice}
                      handleSocketPlugin={handleSocketPlugin}
                      selectedMode={selectedMode}
                      setSelectedMode={setSelectedMode}
                    />
                  </EVMTxSuspenseContext.Provider>
                </PageContentInnerSection>
              </PageContentOuterSection>
            </PageContentOuterSectionWrapper>

            {/* Product info cards */}
            <ProductInfo isOneClicks={isOneClicks} />

            {/* Toasts */}
            <PendingTxToast
              txHash={txHash}
              isCloseable={false}
              pending={pendingTxConfirmation}
            />
            <SuccessfulTxToast pending={txConfirmed} txHash={txHash} />
          </MainPageSection>
        </div>
      </PageLock>
    </>
  );
};

export default OneClicksPage;
