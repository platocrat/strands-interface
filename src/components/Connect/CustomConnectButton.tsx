// Externals
import { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// Locals
import { cards, fonts } from "../../theme/styles";
import { bsac, bsbc } from "../../theme/componentStyles";

type CustomConnectButtonProps = {
  isApp?: boolean;
  className?: string;
  isSafari?: boolean;
  noMarginRight?: boolean;
};

const CustomConnectButton: FC<CustomConnectButtonProps> = ({
  isApp,
  isSafari,
  className,
  noMarginRight,
}) => {
  const CONNECT_TEXT = isApp ? "Connect" : "Connect to Strands";

  return (
    <>
      <ConnectButton.Custom>
        {({
          chain,
          account,
          openChainModal,
          openConnectModal,
          openAccountModal,
          mounted,
        }) => {
          return (
            <div
              className={className}
              {...(!mounted && {
                "aria-hidden": true,
                style: {
                  opacity: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!mounted || !account || !chain) {
                  return (
                    <button
                      type="button"
                      className="custom-connect-button"
                      // disabled={ true }
                      onClick={openConnectModal}
                      style={{
                        ...bsbc,
                        textAlign: "center",
                        width: isApp ? "" : "248.138px",
                        color: fonts.colors.solid.white,
                        marginRight: noMarginRight ? "" : "14px",
                        backgroundColor: isSafari ? cards.backgroundColor : "",
                      }}
                    >
                      {CONNECT_TEXT}
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      type="button"
                      style={{
                        ...bsbc,
                        color: fonts.colors.solid.white,
                        marginRight: noMarginRight ? "" : "14px",
                        backgroundColor: isSafari ? cards.backgroundColor : "",
                      }}
                      onClick={openChainModal}
                    >
                      {`Wrong network`}
                    </button>
                  );
                }

                return (
                  <div
                    style={{
                      ...bsac,
                      marginRight: noMarginRight ? "-15px" : bsac.marginRight,
                    }}
                  >
                    <button
                      type="button"
                      className="custom-connect-button"
                      // disabled={ true }
                      onClick={openChainModal}
                      style={{
                        outline: "none",
                        display: "flex",
                        width: "149.433px",
                        alignItems: "center",
                        padding: "8px 18px 8px 18px",
                        borderRadius: "999px 0px 0px 999px",
                        backgroundColor: isSafari ? cards.backgroundColor : "",
                      }}
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            marginTop: 2,
                            marginRight: 8,
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              src={chain.iconUrl}
                              alt={chain.name ?? "Chain icon"}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name === `Optimism Goerli`
                        ? "Testnet"
                        : chain.name}
                    </button>
                    <button
                      type="button"
                      // disabled={ true }
                      className="custom-connect-button"
                      onClick={openAccountModal}
                      style={{
                        width: "130.433px",
                        marginLeft: "-18px",
                        padding: "8px 18px 8px 18px",
                        borderRadius: "0px 999px 999px 0px",
                        backgroundColor: "rgba(253, 172, 205, 0.05)",
                        boxShadow: `-1px 0px 1px -0.5px ${fonts.colors.solid.pink}`,
                      }}
                    >
                      {account.displayName}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
};

export default CustomConnectButton;
