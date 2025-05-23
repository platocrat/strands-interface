// Externals
import { FC, useRef, useEffect } from "react";
import { useDisconnect } from "wagmi";
// Locals
import { fonts } from "../../../theme/styles";
import { WelcomeMessageProps } from "../../../utils/props";

const WelcomeMessage: FC<WelcomeMessageProps> = ({
  sizeControls,
  hasFirst100NFT,
  hasAgreedToMessage,
  showWelcomeMessage,
  setHasAgreedToMessage,
}) => {
  const clickOutsideRef = useRef(null);
  const { disconnect } = useDisconnect();

  useClickOutside(clickOutsideRef);

  function getWidth(): "380px" | "506px" {
    switch (sizeControls.isMobile) {
      case true:
        return "380px";

      case false:
        switch (sizeControls.isDesktop) {
          case true:
            return "506px";

          case false:
            return "506px";
        }
    }
  }

  function handleCloseMessage() {
    setHasAgreedToMessage(true);
  }

  function useClickOutside(ref: any) {
    useEffect(() => {
      function handleClickOutside(e: any) {
        if (ref.current && !ref.current.contains(e.target)) disconnect();
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <>
      {showWelcomeMessage ? (
        <>
          <div>
            <div className="modal-section">
              <div
                className="modal-wrapper"
                style={{ position: "relative", top: "15%" }}
              >
                <div className="modal-plugin">
                  <div
                    className="modal-inner-section"
                    ref={clickOutsideRef}
                    style={{
                      width: getWidth(),
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ marginBottom: "24px" }}>
                      <h1 style={{ fontSize: fonts.sizes.normal }}>
                        {`Welcome to Strands`}
                      </h1>
                    </div>

                    <div style={{ padding: "12px", marginBottom: "24px" }}>
                      <p style={{ fontSize: fonts.sizes.small }}>
                        {`As an early alpha release, Strands' smart contracts are unaudited. Interacting with Strands at this stage of development is extremely risky.`}
                      </p>
                      <br />
                      <p style={{ fontSize: fonts.sizes.small }}>
                        {`By interacting with Strands, you personally assume all risks and relinquish any right to any type of compensation for any reason possible in all space and time. `}
                      </p>
                      <br />
                      <p style={{ fontSize: fonts.sizes.small }}>
                        {`“while every one shall sit in safety under his own vine and fig tree and there shall be none to make him afraid.”`}
                      </p>
                      <br />
                      <p style={{ fontSize: fonts.sizes.small }}>
                        {`- George Washington, Lin-Manuel Miranda`}
                      </p>
                      <br />
                      <p style={{ fontSize: fonts.sizes.small }}>{`Enjoy!`}</p>
                    </div>

                    <div>
                      <button
                        className="anchor-button"
                        onClick={(e: any) => handleCloseMessage()}
                        style={{
                          width: "130px",
                          maxWidth: "162px",
                          fontSize: fonts.sizes.small,
                        }}
                      >
                        <p>{`I accept`}</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default WelcomeMessage;
