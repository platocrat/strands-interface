// Externals
import { BigNumber } from "ethers";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { FC, useState, useLayoutEffect, useEffect } from "react";
// Locals
import PageLock from "../../components/PageLock";
import PendingTxToast from "../../components/Toasts/PendingTxToast";
import SuccessfulTxToast from "../../components/Toasts/SuccessfulTxToast";
// Sections
import Authenticator from "../../sections/gated-entry/authenticator";
import WelcomeMessage from "../../sections/gated-entry/welcome-message";
// APIs
import {
  balanceOf,
  isWhitelisted,
} from "../../contract-apis/apis/strandsFirst100";
// Misc utils
import { web3UserIsUndefined } from "../../utils/misc";
// Constants
import { OPTIMISM_MAINNET_CHAIN_ID } from "../../utils/constants";
// Types
import { Web3UserType } from "../../utils/types";
// CSS
import { slhwl } from "../../theme/componentStyles";
// Images
import StrandsLogoPink from "../../assets/svg/strands-logos/strands-pink-logo.svg";

const GatedEntry: FC = () => {
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
  // boolean
  const [pendingUserAction, setPendingUserAction] = useState<boolean>(false);
  const [pendingTxConfirmation, setPendingTxConfirmation] =
    useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [txConfirmed, setTxConfirmed] = useState<boolean>(false);
  const [isWhitelisted_, setIsWhitelisted] = useState<boolean>(false);
  const [hasFirst100NFT, setHasFirst100NFT] = useState<boolean>(false);
  const [ctcCallReverted, setCtcCallReverted] = useState<boolean>(false);
  const [isNFTBalanceLoaded, setIsNFTBalanceLoaded] = useState<boolean>(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(false);
  const [hasAgreedToMessage, setHasAgreedToMessage] = useState<boolean>(false);
  // Custom
  const [web3User, setWeb3User] = useState<Web3UserType>(web3User_);

  const mobileMediaQuery = window.matchMedia("(max-width: 900px)");
  const desktopMediaQuery = window.matchMedia("(min-width: 1440px)");

  function handleMobile(e: any): void {
    setIsMobile(e.matches ? true : false);
  }

  function handleDesktop(e: any): void {
    setIsDesktop(e.matches ? true : false);
  }

  async function getBalanceOf(): Promise<void> {
    const balanceOf_ = await balanceOf(web3User);
    if (BigNumber.isBigNumber(balanceOf_)) {
      if (balanceOf_.toNumber() > 0) setHasFirst100NFT(true);
    }
  }

  async function getIsWhitelisted() {
    const _isWhitelisted = await isWhitelisted(web3User);
    if (typeof _isWhitelisted === "boolean") setIsWhitelisted(_isWhitelisted);
  }

  useLayoutEffect((): void => {
    handleMobile(mobileMediaQuery); // required to set `isMobile` on initial render
    mobileMediaQuery.addEventListener("change", handleMobile);
  }, [isMobile]);

  useLayoutEffect((): void => {
    handleDesktop(desktopMediaQuery); // required to set `isMobile` on initial render
    desktopMediaQuery.addEventListener("change", handleDesktop);
  }, [isDesktop]);

  useLayoutEffect((): void => {
    setWeb3User(web3User_);
  }, [
    chain?.id,
    account.address,
    account.connector,
    web3User_.chainId,
    provider.network.chainId,
    web3User_.account.address,
    web3User_.account.connector,
    web3User_.provider.network.chainId,
  ]);

  useLayoutEffect(() => {
    setIsNFTBalanceLoaded(false);

    const timeout = 1_000;

    if (!web3UserIsUndefined(web3User_)) {
      Promise.all([getIsWhitelisted(), getBalanceOf()]).then(
        (response: any) => {}
      );
    }

    // Delay the state update of the user's NFT balance to prevent the welcome
    // message from flickering on the display
    const isNFTBalanceLoadedTimeout = setTimeout(() => {
      setIsNFTBalanceLoaded(true);
    }, timeout);

    return () => {
      clearTimeout(isNFTBalanceLoadedTimeout);
    };
  }, [
    txConfirmed,
    web3User.account.address,
    web3User.account.connector,
    web3User.provider.network.chainId,
  ]);

  useEffect(() => {
    // Once balance has loaded...
    if (isNFTBalanceLoaded) {
      // Check that the user has the NFT to override whether to show message
      if (hasFirst100NFT) {
        setShowWelcomeMessage(false);
      } else {
        // If they do not hold the NFT, check that they have agreed to the
        // message
        setShowWelcomeMessage(!hasAgreedToMessage ? true : false);
      }
    }
  }, [hasFirst100NFT, isNFTBalanceLoaded, hasAgreedToMessage]);

  return (
    <>
      <PageLock
        header={null}
        disabled={true}
        mobileNav={null}
        suspense={{
          isDataLoaded: isNFTBalanceLoaded,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "",
              alignItems: isMobile ? "center" : "",
              marginTop: isMobile ? "70px" : "",
              marginBottom: isMobile ? "-70px" : "",
            }}
          >
            <img
              style={{
                display: "flex",
                maxWidth: "270px",
                position: "absolute",
                top: isMobile ? "" : "25px",
                left: isMobile ? "" : "25px",
              }}
              width={isMobile ? "32%" : isDesktop ? "52%" : slhwl}
              height={isMobile ? "32%" : isDesktop ? "52%" : slhwl}
              alt="strands logo pink"
              src={StrandsLogoPink}
            />
          </div>

          <Authenticator
            web3User={web3User}
            conditionals={{
              isWhitelisted: isWhitelisted_,
              hasFirst100NFT: hasFirst100NFT,
              hasAgreedToMessage: hasAgreedToMessage,
            }}
            errors={{
              setRevertMsg: setRevertMsg,
              setCtcCallReverted: setCtcCallReverted,
            }}
            suspense={{
              setTxHash: setTxHash,
              txConfirmed: txConfirmed,
              setTxConfirmed: setTxConfirmed,
              pendingUserAction: pendingUserAction,
              isNFTBalanceLoaded: isNFTBalanceLoaded,
              setPendingUserAction: setPendingUserAction,
              pendingTxConfirmation: pendingTxConfirmation,
              setPendingTxConfirmation: setPendingTxConfirmation,
            }}
          >
            <WelcomeMessage
              sizeControls={{
                isMobile: isMobile,
                isDesktop: isDesktop,
              }}
              hasFirst100NFT={hasFirst100NFT}
              hasAgreedToMessage={hasAgreedToMessage}
              showWelcomeMessage={showWelcomeMessage}
              setHasAgreedToMessage={setHasAgreedToMessage}
            />
          </Authenticator>

          {/* Toasts */}
          <PendingTxToast
            txHash={txHash}
            isCloseable={false}
            pending={pendingTxConfirmation}
          />
          <SuccessfulTxToast pending={txConfirmed} txHash={txHash} />
        </div>
      </PageLock>
    </>
  );
};

export default GatedEntry;
