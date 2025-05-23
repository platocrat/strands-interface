// Externals
import { SetStateAction, FC, Dispatch } from "react";
// Locals
import TxTernaries from "../../../components/TxTernaries";
// CSS
import { fonts } from "../../../theme/styles";
import { definitelyCentered, bsbc } from "../../../theme/componentStyles";

export type NftMintButtonProps = {
  handleMint: (e: any, methodName?: string) => Promise<void>;
  conditionals: {
    isWhitelisted: boolean;
    hasFirst100NFT: boolean;
    hasAgreedToMessage: boolean;
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

const NftMintButton: FC<NftMintButtonProps> = ({
  suspense,
  handleMint,
  conditionals,
}) => {
  return (
    <>
      {!conditionals.hasFirst100NFT && (
        <>
          <div
            style={{
              top: "42%",
              position: "relative",
              ...definitelyCentered,
            }}
          >
            <TxTernaries
              style={{
                ...bsbc,
                width: "90px",
                padding: "8px",
                height: "40.5px",
                marginRight: "-11px",
                cursor:
                  suspense.pendingTxConfirmation || suspense.pendingUserAction
                    ? "not-allowed"
                    : "",
                backgroundColor: fonts.colors.transparent.darkerPink,
              }}
              conditional1={suspense.pendingUserAction}
              conditional2={suspense.pendingTxConfirmation}
            >
              <button
                className="home-page-button-wrapper"
                onClick={(e: any) => handleMint(e)}
                disabled={
                  suspense.pendingTxConfirmation || suspense.pendingUserAction
                }
              >
                {`mint`}
              </button>
            </TxTernaries>
          </div>
        </>
      )}
    </>
  );
};

export default NftMintButton;
