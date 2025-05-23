// Externals
import { useAccount, useProvider, useNetwork } from "wagmi";
import { FC, useEffect, useLayoutEffect, useState } from "react";
// Locals
import Nav from "../../components/Nav";
import Header from "../../components/Header";
import PageLock from "../../components/PageLock";
import PendingTxToast from "../../components/Toasts/PendingTxToast";
import SuccessfulTxToast from "../../components/Toasts/SuccessfulTxToast";
// Sections
import Markets from "../../sections/portfolio/markets";
import PortfolioChart from "../../sections/portfolio/chart";
import OpenPositions from "../../sections/portfolio/open-positions";
import OpenPositionsCloseAllModal from "../../sections/portfolio/open-positions/modal";
// APIs
import { sendTx } from "../../contract-apis/utils";
import { isApprovedForAllOptionToken } from "../../contract-apis/apis/optionToken";
// Requests
import { getLiveLyraMarkets } from "../../utils/requests/portfolio";
// Styled components
import { MainPageSection } from "../vaults";
// Props
import { PortfolioProps } from "../../utils/props";
// Types
import {
  Web3UserType,
  MethodInfoType,
  PortfolioMarketType,
  TxSuspenseStateVarsType,
} from "../../utils/types";
// Constants
import { cl, web3UserIsUndefined } from "../../utils/misc";
import {
  MS_IN_SECS,
  SECS_IN_MIN,
  initPortfolioMarket,
  OPTIMISM_MAINNET_CHAIN_ID,
  ARBITRUM_MAINNET_CHAIN_ID,
} from "../../utils/constants";
// CSS
import { definitelyCentered } from "../../theme/componentStyles";

const Portfolio: FC<PortfolioProps> = ({ assetName, assetSymbol }) => {
  // Web3 user hooks
  const account = useAccount();
  const provider = useProvider();
  const { chain } = useNetwork();

  let web3User_: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  // string
  const [txHash, setTxHash] = useState<string>("");
  const [revertMsg, setRevertMsg] = useState<string>("");
  // booleans
  const [pendingTxConfirmation, setPendingTxConfirmation] =
    useState<boolean>(false);
  const [txConfirmed, setTxConfirmed] = useState<boolean>(false);
  const [ctcCallReverted, setCtcCallReverted] = useState<boolean>(false);
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false);
  const [openCloseAllModal, setOpenCloseAllModal] = useState<boolean>(false);
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false);
  const [marketsDataLoaded, setMarketsDataLoaded] = useState<boolean>(false);
  // Custom
  const [web3User, setWeb3User] = useState<Web3UserType>(web3User_);
  const [liveMarkets, setLiveMarkets] = useState<PortfolioMarketType[]>([
    initPortfolioMarket,
    initPortfolioMarket,
    initPortfolioMarket,
  ]);

  async function getLiveMarkets(isArbi: boolean): Promise<void> {
    /**
     * @todo Figure out why `liveMarkets_` is still equal to default state
     */
    const liveMarkets_ = await getLiveLyraMarkets(isArbi);
    setLiveMarkets(liveMarkets_);
    setMarketsDataLoaded(true);
  }

  async function getIsApprovedForAll(): Promise<void> {
    const _isApproveForAll = await isApprovedForAllOptionToken(
      account.address,
      web3User.chainId,
      assetSymbol
    );
    if (typeof _isApproveForAll === "boolean")
      setIsApprovedForAll(_isApproveForAll);
  }

  async function handleSetApprovalForAll(
    e: any,
    methodName = "setApprovalForAll"
  ): Promise<void> {
    e.preventDefault();

    const methodInfo: MethodInfoType = {
      ctcName: "OptionToken",
      methodName: methodName,
      isApproval: true,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: setTxHash,
      setRevertMsg: setRevertMsg,
      setTxConfirmed: setTxConfirmed,
      setCtcCallReverted: setCtcCallReverted,
      setPendingUserAction: setPendingUserAction,
      setPendingTxConfirmation: setPendingTxConfirmation,
    };
    const limiters = [
      chain?.id === OPTIMISM_MAINNET_CHAIN_ID ||
        chain?.id === ARBITRUM_MAINNET_CHAIN_ID,
      true,
    ];
    cl("Porfolio handleSetApprovalForAll assetSymbol=%s", assetSymbol);
    const txArguments: any = {
      web3User: web3User,
      assetSymbol: assetSymbol,
    };

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
  }

  /**
   * @dev Updates only when `web3User_.account.connector` changes
   */
  useLayoutEffect((): void => {
    setWeb3User(web3User_);
  }, [account.connector]);

  useEffect((): void => {
    if (openCloseAllModal) setOpenCloseAllModal(false);
  }, [isApprovedForAll]);

  /**
   * @dev Updates only when `web3User` changes
   */
  useLayoutEffect((): void => {
    if (!web3UserIsUndefined(web3User)) {
      setMarketsDataLoaded(false);
      Promise.all([
        getLiveMarkets(
          web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? true : false
        ),
        getIsApprovedForAll(),
      ]).then((): void => {});
    }
  }, [
    txConfirmed,
    web3User.account.address,
    web3User.account.connector,
    web3User.provider.network.chainId,
  ]);

  /**
   * @dev Updates only on initial page load
   */
  useLayoutEffect(() => {
    setMarketsDataLoaded(false);

    Promise.all([
      getLiveMarkets(
        web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? true : false
      ),
      !web3UserIsUndefined(web3User) ? getIsApprovedForAll() : "",
    ]).then((): void => {});
  }, [account.address, account.connector, provider.network.chainId]);

  /**
   * @dev Updates only every 30 seconds
   */
  useLayoutEffect(() => {
    const interval = (MS_IN_SECS * SECS_IN_MIN) / 2;

    let liveMarketsInterval = setInterval(() => {
      setMarketsDataLoaded(false);
      Promise.all([
        getLiveMarkets(
          web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? true : false
        ),
      ]).then((): void => {});
    }, interval);

    return () => {
      clearInterval(liveMarketsInterval);
    };
  }, [
    web3User.account.address,
    web3User.account.connector,
    web3User.provider.network.chainId,
  ]);

  return (
    <>
      <PageLock mobileNav={<Nav />} header={<Header />}>
        <div style={{ ...definitelyCentered }}>
          <MainPageSection>
            <PortfolioChart marketsDataLoaded={marketsDataLoaded} />
            <OpenPositions
              web3User={web3User}
              assetName={assetName}
              assetSymbol={assetSymbol}
              modal={{
                isApprovedForAll: isApprovedForAll,
                openCloseAllModal: openCloseAllModal,
                getIsApprovedForAll: getIsApprovedForAll,
                setOpenCloseAllModal: setOpenCloseAllModal,
              }}
              suspense={{
                setTxHash: setTxHash,
                txConfirmed: txConfirmed,
                setRevertMsg: setRevertMsg,
                setTxConfirmed: setTxConfirmed,
                pendingUserAction: pendingUserAction,
                setCtcCallReverted: setCtcCallReverted,
                setPendingUserAction: setPendingUserAction,
                pendingTxConfirmation: pendingTxConfirmation,
                setPendingTxConfirmation: setPendingTxConfirmation,
              }}
            />
            {/* <Markets
              markets={liveMarkets}
              marketsDataLoaded={marketsDataLoaded}
            /> */}

            {openCloseAllModal ? (
              <>
                <OpenPositionsCloseAllModal
                  suspense={{
                    pendingUserAction: pendingUserAction,
                    pendingTxConfirmation: pendingTxConfirmation,
                  }}
                  setOpenModal={setOpenCloseAllModal}
                  handleSetApprovalForAll={handleSetApprovalForAll}
                />
              </>
            ) : null}

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

export default Portfolio;
