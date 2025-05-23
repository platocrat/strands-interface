// Externals
import {
  FC,
  Dispatch,
  useState,
  ReactNode,
  SetStateAction,
  useLayoutEffect,
} from "react";
// Locals
import AppLink from "../app-link";
import NftMintButton from "./nft-mint-button";
import NonNftHolderMessage from "./non-nft-holder-message";
import Spinner from "../../../components/Suspense/Spinner";
import CustomConnectButton from "../../../components/Connect/CustomConnectButton";
// APIs
import { sendTx } from "../../../contract-apis/utils";
// Misc utils
import { web3UserIsUndefined } from "../../../utils/misc";
// Constants
import {
  OPTIMISM_GOERLI_CHAIN_ID,
  OPTIMISM_MAINNET_CHAIN_ID,
} from "../../../utils/constants";
// Types
import {
  Web3UserType,
  MethodInfoType,
  TxSuspenseStateVarsType,
} from "../../../utils/types";
// CSS
import { fonts } from "../../../theme/styles";
import { definitelyCentered } from "../../../theme/componentStyles";

const noMarginRight = true;

export type AuthenticatorProps = {
  children?: ReactNode;
  web3User: Web3UserType;
  conditionals: {
    isWhitelisted: boolean;
    hasFirst100NFT: boolean;
    hasAgreedToMessage: boolean;
  };
  errors: {
    setRevertMsg: Dispatch<SetStateAction<string>>;
    setCtcCallReverted: Dispatch<SetStateAction<boolean>>;
  };
  suspense: {
    txConfirmed: boolean;
    pendingUserAction: boolean;
    isNFTBalanceLoaded: boolean;
    pendingTxConfirmation: boolean;
    setTxHash: Dispatch<SetStateAction<string>>;
    setTxConfirmed: Dispatch<SetStateAction<boolean>>;
    setPendingUserAction: Dispatch<SetStateAction<boolean>>;
    setPendingTxConfirmation: Dispatch<SetStateAction<boolean>>;
  };
};

const Authenticator: FC<AuthenticatorProps> = ({
  errors,
  web3User,
  children,
  suspense,
  conditionals,
}) => {
  // const [isSafari, setIsSafari] = useState<boolean>(false)

  async function handleMint(e: any, methodName = "mint") {
    e.preventDefault();

    const methodInfo: MethodInfoType = {
      ctcName: "StrandsFirst100",
      methodName: methodName,
      isApproval: false,
    };
    const txSSVs: TxSuspenseStateVarsType = {
      setTxHash: suspense.setTxHash,
      setRevertMsg: errors.setRevertMsg,
      setTxConfirmed: suspense.setTxConfirmed,
      setCtcCallReverted: errors.setCtcCallReverted,
      setPendingUserAction: suspense.setPendingUserAction,
      setPendingTxConfirmation: suspense.setPendingTxConfirmation,
    };
    const limiters = [
      web3User.chainId === OPTIMISM_GOERLI_CHAIN_ID ||
        web3User.chainId === OPTIMISM_MAINNET_CHAIN_ID,
      true,
    ];
    const txArguments: any = {};

    await sendTx(methodInfo, web3User, txSSVs, limiters, txArguments);
  }

  // useLayoutEffect(() => {
  //   const isSafari_ = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  //   setIsSafari(isSafari_)
  // }, [])

  return (
    <>
      <div className="login-page-section">
        <div className="login-page-center-section">
          {/* { isSafari ? null : (
            <>
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  zIndex: "0",
                  borderRadius: "99999px",
                  opacity: "0.8",
                  filter: `drop-shadow(0px 1px 60.5px ${fonts.colors.solid.darkPink})`,
                  background: "black",
                  height: "15px",
                  padding: "5px 18px 8px 18px",
                  width:
                    web3User.chainId === OPTIMISM_MAINNET_CHAIN_ID
                      ? "230px"
                      : "135px",
                  marginLeft: "5px",
                }}
              />
            </>
          ) } */}
          <CustomConnectButton
            // isSafari={ isSafari }
            noMarginRight={noMarginRight}
          />
        </div>

        {web3UserIsUndefined(web3User) ? null : (
          <>
            {suspense.isNFTBalanceLoaded ? (
              <>
                {conditionals.hasFirst100NFT ? (
                  <div className="login-page-center-section">
                    <AppLink />
                  </div>
                ) : (
                  <>{children}</>
                )}
              </>
            ) : (
              <>
                <div
                  style={{
                    ...definitelyCentered,
                    top: "42%",
                    marginRight: "-14px",
                    position: "relative",
                    borderRadius: "99999px",
                  }}
                >
                  <Spinner
                    style={{
                      borderRadius: "99999px",
                      filter: `drop-shadow(0px 1px 3.5px ${fonts.colors.solid.darkPink})`,
                    }}
                    height="35"
                    width="35"
                  />
                </div>
              </>
            )}

            {suspense.isNFTBalanceLoaded && (
              <>
                {conditionals.isWhitelisted === true ? (
                  <NftMintButton
                    suspense={suspense}
                    handleMint={handleMint}
                    conditionals={conditionals}
                  />
                ) : (
                  <NonNftHolderMessage />
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Authenticator;
