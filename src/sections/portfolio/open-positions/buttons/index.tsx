// Externals
import { FC, useMemo } from "react";
// Locals
import CloseAllButton from "./close-all";
import CloseSelectedButton from "./close-selected";
import CancelCloseSelectedButton from "./cancel-close-selected";
// Misc utils
import { toBN, web3UserIsUndefined } from "../../../../utils/misc";
// Constants
import {
  ARBITRUM_MAINNET_CHAIN_ID,
  initLyraOpenPosition,
} from "../../../../utils/constants";
// Props
import { OpenPositionsButtonsProps } from "../../../../utils/props";
// CSS
import { fonts, cards } from "../../../../theme/styles";
// Images
import { ReactComponent as RightArrowSVG } from "../../../../assets/svg/right-arrow-short.svg";
import { StyledLink } from "../../../strategies/strategy";

const OpenPositionsButtons: FC<OpenPositionsButtonsProps> = ({
  web3User,
  suspense,
  positions,
}) => {
  const ETH =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + "ETH";

  return (
    <>
      {web3UserIsUndefined(web3User) ||
      positions.openPositions.length === 0 ||
      positions.openPositions[0] === initLyraOpenPosition ? (
        <>
          <div
            style={{
              display: "flex",
              margin: "0px 0px 0px auto",
            }}
          >
            <StyledLink
              style={{
                width: "auto",
                display: "flex",
                maxWidth: "139px",
              }}
              to={"/portfolio/history"}
            >
              <button className="position-history-button">
                {`History`}
                <RightArrowSVG style={{ marginLeft: "3px" }} />
              </button>
            </StyledLink>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              margin: "0px 0px 0px auto",
            }}
          >
            {positions.isCloseSelectedOn ? (
              <>
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    top: "1px",
                    right: "18px",
                  }}
                >
                  <div
                    style={{
                      letterSpacing: "2px",
                      fontSize: "21px",
                      color: fonts.colors.solid.white,
                    }}
                  >
                    {`${
                      positions.positionIds[0].id === toBN("0") &&
                      positions.positionIds[0].underlier === ETH
                        ? 0
                        : positions.positionIds.length - 1
                    }/${positions.openPositions.length}`}
                  </div>
                </div>
              </>
            ) : null}

            {positions.isCloseSelectedOn ? (
              <>
                <CancelCloseSelectedButton
                  web3User={web3User}
                  suspense={suspense}
                  setPositionIds={positions.setPositionIds}
                  setIsCloseSelectedOn={positions.setIsCloseSelectedOn}
                />
              </>
            ) : null}

            <CloseSelectedButton
              web3User={web3User}
              suspense={suspense}
              positionIds={positions.positionIds}
              isCloseSelectedOn={positions.isCloseSelectedOn}
              handleCloseSelectedPositions={
                positions.handleCloseSelectedPositions
              }
            />
            <CloseAllButton
              suspense={suspense}
              isCloseSelectedOn={positions.isCloseSelectedOn}
              handleCloseAllPositions={positions.handleCloseAllPositions}
            />

            <div
              style={{
                width: "1.1px",
                height: "45px",
                marginLeft: "4px",
                marginRight: "18px",
                marginTop: "-3.5px",
                borderRadius: "3rem",
                border: `0.5px outset ${fonts.colors.transparent.mdPink}`,
                boxShadow: cards.boxShadows.lightShadow,
                backgroundColor: fonts.colors.transparent.mdPink,
                filter: fonts.filters["drop-shadow"].solid.hardDarkPink,
              }}
            />
          </div>

          <StyledLink
            style={{
              width: "auto",
              display: "flex",
              maxWidth: "139px",
            }}
            to={"/portfolio/history"}
          >
            <button className="position-history-button">
              {`History`}
              <RightArrowSVG style={{ marginLeft: "3px" }} />
            </button>
          </StyledLink>
        </>
      )}
    </>
  );
};

export default OpenPositionsButtons;
