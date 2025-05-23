// Externals
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { Bridge } from "@socket.tech/plugin";
import { FC, useEffect, useRef } from "react";
// Locals
// Props
import { SocketBridgeProps } from "../../utils/props";
// Constants
import { OPTIMISM_MAINNET_CHAIN_ID } from "../../utils/constants";
// CSS
import { fonts } from "../../theme/styles";

const customizeCSS = {
  width: 360,
  responsiveWidth: false,
  borderRadius: 1,
  secondary: "rgb(68,69,79)",
  primary: "rgb(31,34,44)",
  accent: "rgb(131,249,151)",
  onAccent: "rgb(0,0,0)",
  interactive: "rgb(0,0,0)",
  onInteractive: "rgb(240,240,240)",
  text: "rgb(255,255,255)",
  secondaryText: "rgb(200,200,200)",
};

const SocketBridge: FC<SocketBridgeProps> = ({
  provider,
  isOneClicks,
  setOpenSocketPlugin,
}) => {
  // ref
  const clickOutsideRef = useRef(null);

  const { data: signer } = useSigner();

  useClickOutside(clickOutsideRef);

  let socketApiKey: string = "";

  if (process.env.REACT_APP_SOCKET_API_KEY !== undefined) {
    socketApiKey = process.env.REACT_APP_SOCKET_API_KEY;
  }

  const enableSameChainSwaps = true;
  const swapTokenText = isOneClicks ? "ETH for sUSD" : "ETH for sETH";
  const tradeOrDepositText = isOneClicks ? "trade" : "deposit";
  const helperText = `Swap ${swapTokenText} to to make your first ${tradeOrDepositText}.`;

  // Pre-selecting default source chain as Ethereum and destination chain as Optimism
  const defaultSourceNetwork = OPTIMISM_MAINNET_CHAIN_ID;
  const defaultDestNetwork = OPTIMISM_MAINNET_CHAIN_ID;

  // Pre-selecting default sending token as USDC on Ethereum and destination token as sUSD on Optimism
  const defaultSourceToken = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000";
  const defaultDestToken = "0xE405de8F52ba7559f9df3C368500B6E6ae6Cee49";

  const web3Provider =
    !!signer &&
    new ethers.providers.Web3Provider((signer?.provider as any).provider);

  function useClickOutside(ref: any) {
    useEffect(() => {
      function handleClickOutside(e: any) {
        if (ref.current && !ref.current.contains(e.target))
          setOpenSocketPlugin(false);
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div className="modal-section">
      <div className="modal-wrapper">
        <div className="modal-plugin">
          <div ref={clickOutsideRef} className="modal-inner-section">
            {/* Title section */}
            <div style={{ marginLeft: "-5px" }}>
              <div>
                <p
                  style={{
                    marginBottom: "10px",
                    marginTop: "-5px",
                    fontSize: fonts.sizes.large,
                  }}
                >
                  {`Swap to Stables`}
                </p>
              </div>
              <div>
                <div style={{ marginBottom: "20px" }}>
                  {`You need stables to trade on Lyra.`}
                  <br />
                  {helperText}
                </div>
              </div>
            </div>

            <Bridge
              enableRefuel={true}
              API_KEY={socketApiKey}
              provider={web3Provider}
              customize={customizeCSS}
              defaultDestToken={defaultDestToken}
              defaultDestNetwork={defaultDestNetwork}
              defaultSourceToken={defaultSourceToken}
              enableSameChainSwaps={enableSameChainSwaps}
              defaultSourceNetwork={defaultSourceNetwork}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocketBridge;
