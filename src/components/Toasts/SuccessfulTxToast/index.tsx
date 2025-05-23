// Externals
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
// Locals
import { cards, fonts } from "../../../theme/styles";
// Images
import { ReactComponent as GreenExternalLinkIcon } from "../../../assets/svg/green-external-link-icon.svg";
import { ReactComponent as CloseIcon } from "../../../assets/svg/x-icon-pink.svg";

const CloseableSection = ({ onClick }) => {
  return (
    <CloseIconWrapper
      onClick={onClick}
      style={{
        position: "relative",
        padding: "8px",
        borderRadius: "2rem 0rem 0rem 2rem",
      }}
    >
      <CloseIcon
        style={{
          height: "55px",
          width: "auto",
          padding: "15px 5px",
          marginTop: "10px",
        }}
      />
    </CloseIconWrapper>
  );
};

const SuccessfulTxToast = ({ pending, txHash }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [manualClose, setManualClose] = useState<boolean>(false);
  const closeToast = () => setTimeout(() => setOpen(false), 10000);

  function handleManualClose() {
    setManualClose(true);
  }

  useEffect(() => {
    if (pending) closeToast();
  }, []);

  return (
    <>
      <div
        id={"successful-toast-id"}
        className={
          pending && !manualClose
            ? open
              ? "toast-in"
              : "toast-out"
            : "toast-out"
        }
        style={{
          position: "absolute",
          top: "2%",
          zIndex: "10",
          backdropFilter: cards.blur,
          borderRightWidth: "10px",
          borderRadius: "2rem 0rem 0rem 2rem",
          backgroundColor: "rgba(70, 59, 65, 0.39)",
          borderRightColor: fonts.colors.solid.green,
        }}
      >
        <div style={{ display: "flex" }}>
          <CloseableSection onClick={() => handleManualClose()} />
          <div
            style={{
              padding: `16px 30px 16px 20px`,
              color: fonts.colors.solid.green,
            }}
          >
            <p
              style={{
                marginBottom: "8px",
                fontWeight: fonts.weights.medium,
                fontSize: fonts.sizes.md,
              }}
            >
              {`Transaction confirmed!`}
            </p>
            <div
              style={{
                fontSize: fonts.sizes.normal,
              }}
            >
              <a
                className="view-transaction"
                href={txHash}
                target={"_blank"}
                rel={"noreferrer"}
              >
                {`View transaction`}
                <div style={{ position: "relative", top: "5px", left: "5px" }}>
                  <GreenExternalLinkIcon />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CloseIconWrapper = styled.div`
  :hover {
    cursor: pointer;
    background-color: rgba(253, 172, 205, 0.1);
  }

  :active {
    background - color: rgba(253, 172, 205, 0.39);
  }
`;

export default SuccessfulTxToast;
