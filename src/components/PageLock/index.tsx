// Externals
import { FC, useMemo } from "react";
import { BigNumber } from "ethers";
import { useState, useLayoutEffect } from "react";
import { useAccount, useProvider, useNetwork } from "wagmi";
// Locals
import PageLockMessage from "./message";
import Spinner from "../Suspense/Spinner";
import PageLockBackgroundOverlay from "./background-overlay";
// APIs
import { balanceOf } from "../../contract-apis/apis/strandsFirst100";
// Utils
import { cl, web3UserIsUndefined } from "../../utils/misc";
// Constants
import { OPTIMISM_MAINNET_CHAIN_ID } from "../../utils/constants";
// Types
import { Web3UserType } from "../../utils/types";
// Props
import { PageLockProps } from "../../utils/props";
// CSS
import { fonts } from "../../theme/styles";
import { definitelyCentered, slhwl } from "../../theme/componentStyles";
// Images
import StrandsLogoWhite from "../.././assets/svg/strands-logos/strands-white-logo.svg";

export const PageSuspense = ({
  isMobile,
  isDesktop,
  isConnectedToOptimism,
}) => {
  return (
    <>
      <>
        <div
          style={ {
            ...definitelyCentered,
            top: "250px",
            padding: isConnectedToOptimism ? "24px" : "20px 24px 48px 24px",
            position: "relative",
            flexDirection: "column",
            backdropFilter: "blur(3.5px)",
            backgroundColor: "rgba(95, 60, 80, 0.15)",
          } }
        >
          <img
            className="loading-animated-logo"
            width={ isMobile ? "32%" : isDesktop ? "22%" : slhwl }
            height={ isMobile ? "32%" : isDesktop ? "22%" : slhwl }
            alt="strands logo pink"
            src={ StrandsLogoWhite }
            style={ {
              display: "flex",
              flexDirection: "row",
            } }
          />

          { isConnectedToOptimism ? (
            <>
              <Spinner
                strokeWidth="2"
                height={ "9%" }
                width={ "9%" }
                stroke={ fonts.colors.solid.white }
                style={ {
                  position: "relative",
                  marginTop: "36px",
                  marginLeft: "24px",
                  display: "flex",
                  flexDirection: "row",
                } }
              />
            </>
          ) : (
            <>
              <PageLockMessage
                isMobile={ isMobile }
                isDesktop={ isDesktop }
                isConnectedToOptimism={ isConnectedToOptimism }
              />
            </>
          ) }
        </div>
      </>
    </>
  );
};

const PageLock: FC<PageLockProps> = ({
  header,
  disabled,
  children,
  suspense,
  mobileNav,
}) => {
  // Web3 user hooks
  const account = useAccount();
  const provider = useProvider();
  const { chain } = useNetwork();

  let web3User_: Web3UserType = {
    account: account,
    chainId: chain ? chain.id : OPTIMISM_MAINNET_CHAIN_ID,
    provider: provider,
  };

  const [loading, setLoading] = useState<boolean>(false);
  // For PageLock
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // For PageLock
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  // For PageLock
  const [hasFirst100NFT, setHasFirst100NFT] = useState<boolean>(false);

  // For PageLock
  const mobileMediaQuery = window.matchMedia("(max-width: 900px)");
  // For PageLock
  const desktopMediaQuery = window.matchMedia("(min-width: 1440px)");
  // For PageLock
  const suspenseControls = suspense
    ? loading || !suspense?.isDataLoaded
    : loading;

  const isConnectedToOptimism = useMemo((): boolean => {
    return web3User_.chainId === OPTIMISM_MAINNET_CHAIN_ID;
  }, [web3User_.chainId]);

  // For PageLock
  function handleMobile(e: any): void {
    setIsMobile(e.matches ? true : false);
  }

  // For PageLock
  function handleDesktop(e: any): void {
    setIsDesktop(e.matches ? true : false);
  }

  // For PageLock
  async function getBalanceOf() {
    const balanceOf_ = await balanceOf(web3User_);
    if (BigNumber.isBigNumber(balanceOf_)) {
      setHasFirst100NFT(balanceOf_.toNumber() > 0 ? true : false);
    }
  }

  // For PageLock
  useLayoutEffect((): void => {
    handleMobile(mobileMediaQuery); // required to set `isMobile` on initial render
    mobileMediaQuery.addEventListener("change", handleMobile);
  }, [isMobile]);

  // For PageLock
  useLayoutEffect((): void => {
    handleDesktop(desktopMediaQuery); // required to set `isMobile` on initial render
    desktopMediaQuery.addEventListener("change", handleDesktop);
  }, [isDesktop]);

  // For PageLock
  useLayoutEffect(() => {
    if (!web3UserIsUndefined(web3User_)) {
      setLoading(true);

      Promise.all([getBalanceOf()]).then((response: any) => {
        setLoading(false);
      });
    }
  }, [account.address, account.connector, provider.network.chainId]);

  return (
    <>
      { disabled ? (
        <>
          { header }
          { mobileNav }
          { children }
        </>
      ) : (
        <>
          { suspenseControls ? (
            <PageSuspense
              isMobile={ isMobile }
              isDesktop={ isDesktop }
              isConnectedToOptimism={ isConnectedToOptimism }
            />
          ) : (
            <>
              <PageLockBackgroundOverlay hasFirst100NFT={ hasFirst100NFT } />

              { header }
              { mobileNav }

              { hasFirst100NFT ? (
                <>{ children }</>
              ) : (
                <>
                  <PageLockMessage isMobile={ isMobile } isDesktop={ isDesktop } />
                </>
              ) }
            </>
          ) }
        </>
      ) }
    </>
  );
};

export default PageLock;
