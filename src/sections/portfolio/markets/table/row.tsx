// Externals
import React, { FC } from "react";
// Locals
import { tableHeaderCSS } from "./index";
import { StyledLink } from "../../../strategies/strategy";
import AssetImgTernary from "../../../../components/AssetImgTernary";
// CSS
import { fonts } from "../../../../theme/styles";
// Constants
import { PORTFOLIO_QUOTE_ASSET } from "../../../../utils/constants";
// Misc utils
import { numberWithCommas, nFormatter } from "../../../../utils/misc";
// Props
import { MarketsTableRowProps } from "../../../../utils/props";

export const marketTitleCell: any = {
  width: "150px",
  flex: "150 0 auto",
  alignItems: "center",
  WebkitBoxAlign: "center",
};

const MarketsTableRow: FC<MarketsTableRowProps> = ({ market }) => {
  return (
    <>
      <tr className="portfolio-markets-list-row">
        <StyledLink
          style={{
            display: "flex",
            flex: "1 0 auto",
            alignItems: " center",
            WebkitBoxPack: "start",
            WebkitBoxAlign: "center",
            justifyContent: "flex-start",
          }}
          to={`/one-clicks/${market.asset.assetName}-${market.asset.assetSymbol}`}
        >
          <td
            style={{
              ...marketTitleCell,
              position: "relative",
              top: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                WebkitBoxAlign: "center",
                marginLeft: "24px",
                marginBottom: "24px",
              }}
            >
              <AssetImgTernary _assetSymbol={market.asset.assetSymbol} />
              <div style={{ margin: "0px 0px 0px 8px" }}>
                <p
                  style={{
                    ...tableHeaderCSS,
                    fontSize: "14px",
                    color: fonts.colors.solid.white,
                  }}
                >
                  {`${market.asset.assetName}`}
                </p>
                <p
                  style={{
                    ...tableHeaderCSS,
                    fontSize: "12px",
                    fontWeight: "400",
                    color: fonts.colors.solid.brightOrange,
                  }}
                >
                  {`${market.asset.assetSymbol}-${PORTFOLIO_QUOTE_ASSET}`}
                </p>
              </div>
            </div>
          </td>
          <div style={{ ...marketTitleCell }}>
            <div
              style={{
                display: "flex",
                marginLeft: "-7px",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  ...tableHeaderCSS,
                  color: fonts.colors.solid.white,
                }}
              >
                {`$${numberWithCommas(market.dailyPrice.price) ?? "1,358.39"}`}
              </p>
              <p
                style={{
                  ...tableHeaderCSS,
                  color:
                    market.dailyPrice.percentChange > 0
                      ? fonts.colors.solid.green
                      : fonts.colors.solid.red,
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                {`${market.dailyPrice.percentChange > 0 ? "+" : ""}${
                  nFormatter(market.dailyPrice.percentChange, 2) ?? "-0.45"
                } %`}
              </p>
            </div>
          </div>
          <div style={{ ...marketTitleCell }}>
            <p
              style={{
                ...tableHeaderCSS,
                marginLeft: "7px",
                color: fonts.colors.solid.white,
              }}
            >
              {`$${nFormatter(market.volume, 2) ?? "57.4m"}`}
            </p>
          </div>
          <div style={{ ...marketTitleCell }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  ...tableHeaderCSS,
                  color: fonts.colors.solid.white,
                }}
              >
                {`$${nFormatter(market.openInterest.inUsd, 2) ?? "13.68m"}`}
              </p>
              <p
                style={{
                  ...tableHeaderCSS,
                  fontSize: "12px",
                  fontWeight: "400",
                  color: fonts.colors.solid.brightOrange,
                }}
              >
                {`${
                  nFormatter(market.openInterest.inBaseAsset, 2) ?? "10.07k"
                } ${market.asset.assetSymbol}`}
              </p>
            </div>
          </div>
        </StyledLink>
      </tr>
    </>
  );
};

export default MarketsTableRow;
