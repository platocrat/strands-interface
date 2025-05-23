// Externals
import { FC } from "react";
// Locals
import { marketTitleCell } from "../row";
// Styled components
import {
  RightArrowSVGWrapper,
  RightArrowSVGContent,
} from "../../../../one-clicks/one-click";
import { StyledLink } from "../../../../strategies/strategy";
// CSS
import { tableHeaderCSS } from "..";
import { fonts } from "../../../../../theme/styles";
// Images
import { ReactComponent as RightArrowSVG } from "../../../../../assets/svg/right-arrow-short.svg";

const StrandsCategoriesTableRow = ({ market }) => {
  return (
    <>
      <tr>
        <td
          style={{
            ...marketTitleCell,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                ...tableHeaderCSS,
                width: "200px",
                height: "48px",
                color: fonts.colors.solid.white,
              }}
            >
              {market.name}
            </p>
          </div>
        </td>
        <td
          style={{
            ...marketTitleCell,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <StyledLink
              style={{
                width: "auto",
                display: "flex",
                maxWidth: "139px",
              }}
              to={"/one-clicks/Ethereum-sETH"}
            >
              <button
                className="anchor-button"
                style={{
                  width: "auto",
                  maxWidth: "139px",
                }}
              >
                {market.isActive ? (
                  <>
                    {` Go `}
                    <RightArrowSVGWrapper>
                      <RightArrowSVGContent>
                        <RightArrowSVG />
                      </RightArrowSVGContent>
                    </RightArrowSVGWrapper>
                  </>
                ) : (
                  <>{`Coming Soon`}</>
                )}
              </button>
            </StyledLink>
          </div>
        </td>
      </tr>
    </>
  );
};

export default StrandsCategoriesTableRow;
