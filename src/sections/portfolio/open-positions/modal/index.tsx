// Externals
import { Dispatch, FC, SetStateAction } from "react";
// Locals
import Modal from "../../../../components/Modal";
import TxTernaries from "../../../../components/TxTernaries";
// CSS
import { fonts } from "../../../../theme/styles";
// Images
import { ReactComponent as InfoIconSVG } from "../../../../assets/svg/info-icon-bright-orange.svg";

export type OpenPositionsCloseAllModalProps = {
  suspense: {
    pendingUserAction: boolean;
    pendingTxConfirmation: boolean;
  };
  handleSetApprovalForAll: (e: any) => void;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const OpenPositionsCloseAllModal: FC<OpenPositionsCloseAllModalProps> = ({
  suspense,
  setOpenModal,
  handleSetApprovalForAll,
}) => {
  const modalExplanation =
    "You need to allow the 1Clicks contract to adjust your option positions.";

  return (
    <>
      <Modal setOpenModal={setOpenModal}>
        <InfoIconSVG style={{ height: "18px", width: "18px" }} />
        <p
          style={{
            padding: "20px",
            marginTop: "-10px",
            textAlign: "center",
            marginBottom: "25px",
            fontSize: fonts.sizes.md,
            borderBottom: `1px solid ${fonts.colors.transparent.mdPink}`,
            color: fonts.colors.solid.brightOrange,
            filter: fonts.filters["drop-shadow"].solid.softDarkPink,
          }}
        >
          {modalExplanation}
        </p>
        <div>
          <button
            disabled={
              suspense.pendingUserAction || suspense.pendingTxConfirmation
                ? true
                : false
            }
            style={{
              marginRight: "14px",
              boxShadow:
                suspense.pendingUserAction || suspense.pendingTxConfirmation
                  ? "none"
                  : "",
              borderColor:
                suspense.pendingUserAction || suspense.pendingTxConfirmation
                  ? fonts.colors.solid.darkPink
                  : "",
              cursor:
                suspense.pendingUserAction || suspense.pendingTxConfirmation
                  ? "not-allowed"
                  : "",
            }}
            className="position-history-button"
            onClick={(e: any) => handleSetApprovalForAll(e)}
          >
            <TxTernaries
              style={{ margin: "0px 31.46px", padding: "8px" }}
              conditional1={suspense.pendingUserAction}
              conditional2={suspense.pendingTxConfirmation}
            >
              {`Allow Strands to adjust your positions`}
            </TxTernaries>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default OpenPositionsCloseAllModal;
