// Externlas
import { CSSProperties, FC } from "react";
// Locals
import AssetImgTernary from "../../../../components/AssetImgTernary";
// Misc utils
import {
  nFormatter,
  bnToNumber,
  formatPrice,
  numberWithCommas,
} from "../../../../utils/misc";
// Props
import { PortfolioHistoryTableRowProps } from "../../../../utils/props";
// CSS
import { fonts } from "../../../../theme/styles";
import {
  cellTextStyle,
  headerTextStyle,
} from "../../open-positions/table/body";

const smallCellStyle: CSSProperties = {
  width: "150px",
  display: "flex",
  flex: "150 0 auto",
  padding: "16px 12px",
  alignItems: "center",
  MozBoxAlign: "center",
};

const PortfolioHistoryTableRow: FC<PortfolioHistoryTableRowProps> = ({
  isVault,
  position,
}) => {
  const positionCell = `${position.marketName} $${bnToNumber(
    position.strikePrice,
    0
  )} ${position.isCall ? "Call" : "Put"}`;

  /**
   * @todo Add infinite scroll
   */
  return (
    <>
      <tr
        className={"portfolio-history-row"}
        style={{
          display: "flex",
          cursor: "pointer",
          backgroundColor: "transparent",
        }}
      >
        <td
          style={{ width: isVault ? "160px" : "" }}
          className="portfolio-history-table-data-cell"
        >
          <p className="portfolio-history-table-time-text ">
            {isVault ? (
              position.timeNumber
            ) : (
              <>
                {(position.timeNumber as number) < 1
                  ? `${((position.timeNumber as number) * 24).toFixed(0)}h`
                  : `${(position.timeNumber as number).toFixed(0)}d`}
              </>
            )}
          </p>
        </td>
        <td className="portfolio-history-table-position-cell">
          <div className="portfolio-table-table-position-section">
            <AssetImgTernary _assetSymbol={position.assetSymbol} />
            <div style={{ marginLeft: "8px" }}>
              <p style={{ ...cellTextStyle }}>{positionCell}</p>
              <p
                style={{
                  ...headerTextStyle,
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                <span
                  style={{
                    fontWeight: "500",
                    color:
                      fonts.colors.solid[position.isLong ? "green" : "red"],
                  }}
                >
                  {`${position.isLong ? "LONG" : "SHORT"} ${nFormatter(
                    position.size.eq(0) ? 0 : bnToNumber(position.size),
                    2
                  )}`}
                </span>
                {` · ${position.lastUpdatedDate}`}
              </p>
            </div>
          </div>
        </td>

        {isVault ? null : (
          <>
            <td style={{ ...smallCellStyle }}>
              <p className="portfolio-history-table-status-cell-text">
                {position.status}
              </p>
            </td>
          </>
        )}

        <td style={{ ...smallCellStyle }}>
          <div>
            <p style={{ ...cellTextStyle }}>
              {`$${(parseFloat(position.openPrice.toString()) / 1e18).toFixed(
                2
              )}`}
            </p>
            <p
              style={{
                ...headerTextStyle,
                fontSize: "12px",
                lineHeight: "20px",
              }}
            >
              {`$${numberWithCommas(bnToNumber(position.openSpotPrice, 2))} / ${
                position.marketName
              }`}
            </p>
          </div>
        </td>

        {isVault ? null : (
          <>
            <td style={{ ...smallCellStyle }}>
              <div>
                <p style={{ ...cellTextStyle }}>
                  {`$${(
                    parseFloat(position.closePrice.toString()) / 1e18
                  ).toFixed(2)}`}
                </p>
                <p
                  style={{
                    ...headerTextStyle,
                    fontSize: "12px",
                    lineHeight: "20px",
                  }}
                >
                  {`$${numberWithCommas(
                    bnToNumber(position.closeSpotPrice, 2)
                  )} / ${position.marketName}`}
                </p>
              </div>
            </td>
            <td
              style={{
                ...smallCellStyle,
                padding: "16px 24px 16px 12px",
              }}
            >
              <div>
                <p
                  style={{
                    ...cellTextStyle,
                    color:
                      fonts.colors.solid[
                        position.pnl.gt(0)
                          ? "green"
                          : position.pnl.lt(0)
                          ? "red"
                          : "white"
                      ],
                  }}
                >
                  {`${
                    position.pnl.eq(0) ? 0 : formatPrice(position.pnl, true, 2)
                  }`}
                </p>
                <p
                  style={{
                    ...cellTextStyle,
                    fontSize: "12px",
                    lineHeight: "20px",
                    color: fonts.colors.solid.brightOrange,
                  }}
                >
                  {`${
                    position.pnlPercentage.eq(0)
                      ? 0
                      : (
                          bnToNumber(position.pnlPercentage, 4, true) * 100
                        ).toFixed(2)
                  } %`}
                </p>
              </div>
            </td>
          </>
        )}
      </tr>
    </>
  );
};

export default PortfolioHistoryTableRow;
