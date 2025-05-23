// Externals
import styled from "@emotion/styled";
// Locals
import { cards, fonts } from "../../../theme/styles";
// Images
import { ReactComponent as PinkExternalLinkIcon } from "../../../assets/svg/pink-external-link-icon.svg";
import { ReactComponent as CloseIcon } from "../../../assets/svg/x-icon-pink.svg";

const CloseableSection = () => {
  return (
    <CloseIconWrapper
      style={{
        padding: "8px",
        position: "relative",
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

const PendingTxToast = ({ pending, isCloseable, txHash }) => {
  return (
    <>
      <div
        className={pending ? "toast-in" : "toast-out"}
        style={{
          position: "absolute",
          top: "2%",
          zIndex: "2",
          backdropFilter: cards.blur,
          borderRightWidth: "10px",
          borderRadius: "2rem 0rem 0rem 2rem",
          backgroundColor: "rgba(70, 59, 65, 0.39)",
          borderRightColor: fonts.colors.solid.pink,
        }}
      >
        <div style={{ display: "flex" }}>
          {isCloseable && <CloseableSection />}
          <div
            style={{
              padding: `16px 30px 16px ${isCloseable ? "20px" : "30px"}`,
              color: fonts.colors.solid.pink,
            }}
          >
            <p
              style={{
                marginBottom: "5px",
                fontWeight: fonts.weights.medium,
                fontSize: fonts.sizes.md,
              }}
            >
              {`Transaction submitted.`}
            </p>
            <div
              style={{
                fontSize: fonts.sizes.normal,
              }}
            >
              {`Pending confirmation on Optimism...`}
              <a
                className="view-transaction"
                style={{ marginTop: "18px" }}
                href={txHash}
                target={"_blank"}
                rel={"noreferrer"}
              >
                {`View transaction`}
                <div style={{ position: "relative", top: "5px", left: "5px" }}>
                  <PinkExternalLinkIcon />
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

export default PendingTxToast;
