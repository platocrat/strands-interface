// Externals
import { FC, useMemo } from "react";
import { BigNumber } from "ethers";
// Locals
import AssetImgTernary from "../../../../components/AssetImgTernary";
// Misc utils
import {
  toBN,
  bnToNumber,
  nFormatter,
  formatPrice,
  numberWithCommas,
} from "../../../../utils/misc";
// CSS
import { fonts } from "../../../../theme/styles";
import { cellTextStyle, headerTextStyle, cellStyle } from "./body";
// Props
import { OpenPositionsTableRowProps } from "../../../../utils/props";
import { ARBITRUM_MAINNET_CHAIN_ID } from "../../../../utils/constants";

const OpenPositionsTableRow: FC<OpenPositionsTableRowProps> = ({
  isVault,
  position,
  web3User,
  positionIds,
  vaultName,
  setPositionIds,
  isCloseSelectedOn,
}) => {
  const positionCell = `${position.marketName} $${bnToNumber(
    position.strikePrice,
    0
  )} ${position.isCall ? "Call" : "Put"}`;

  const ETH =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + "ETH";

  const BTC =
    (web3User.chainId === ARBITRUM_MAINNET_CHAIN_ID ? "w" : "s") + "BTC";

  function rowGlow() {
    if (isCloseSelectedOn && positionIds) {
      const positionIds_ = positionIds.map(
        (pId: { id: BigNumber; underlier: string }): number => {
          return pId.id.toNumber();
        }
      );

      if (positionIds_.includes(position.positionId)) {
        return "open-positions-row-close-selected-is-selected";
      } else {
        return "open-positions-row-close-selected";
      }
    } else {
      return "open-positions-row";
    }
  }

  async function handleRowOnClick() {
    if (isCloseSelectedOn && positionIds && setPositionIds) {
      let newPositionIds,
        positionIds_ = positionIds.map(
          (pId: { id: BigNumber; underlier: string }) => pId.id.toNumber()
        );

      positionIds_.includes(position.positionId)
        ? (newPositionIds = positionIds.filter(
          (pId: { id: BigNumber; underlier: string }): boolean => {
            return pId.id.toNumber() !== position.positionId;
          }
        ))
        : (newPositionIds = [
          ...positionIds,
          {
            id: toBN(position.positionId),
            underlier: position.assetSymbol === "ETH" ? ETH : BTC,
          },
        ]);

      setPositionIds(
        positionIds[0].id.eq(toBN("0")) && positionIds[0].underlier === ""
          ? [
            {
              id: toBN(position.positionId),
              underlier: position.assetSymbol === "ETH" ? ETH : BTC,
            },
          ]
          : newPositionIds
      );
    }
  }

  return (
    <>
      <tr className={ rowGlow() } onClick={ () => handleRowOnClick() }>
        <td
          style={ {
            width: "220px",
            display: "flex",
            flex: "220 0 auto",
            alignItems: "center",
            padding: "16px 12px",
            MozBoxAlign: "center",
          } }
        >
          <div
            style={ {
              display: "flex",
              alignItems: "center",
              MozBoxAlign: "center",
            } }
          >
            <AssetImgTernary _assetSymbol={ position.assetSymbol } />
            <div style={ { marginLeft: "8px" } }>
              <p style={ { ...cellTextStyle } }>{ positionCell }</p>
              <p
                style={ {
                  ...headerTextStyle,
                  fontSize: "12px",
                  lineHeight: "20px",
                } }
              >
                <span
                  style={ {
                    fontWeight: "500",
                    color:
                      fonts.colors.solid[position.isLong ? "green" : "red"],
                  } }
                >
                  { `${position.isLong ? "LONG" : "SHORT"} ${nFormatter(
                    position.size.eq(0) ? 0 : bnToNumber(position.size),
                    2
                  )}` }
                </span>
                { ` · ${position.expiryDate}` }
              </p>
            </div>
          </div>
        </td>
        <td style={ { ...cellStyle, padding: "" } }>
          <div>
            <p style={ { ...cellTextStyle } }>
              { `$${numberWithCommas(
                Number(
                  position.equity.eq(0)
                    ? 0
                    : position.isLong
                      ? (bnToNumber(position.equity) / 1e18).toFixed(2)
                      : bnToNumber(position.equity, 2)
                )
              )}` }
            </p>
          </div>
        </td>
        <td style={ { ...cellStyle } }>
          <p style={ { ...cellTextStyle } }>
            { `${position.averageCost.eq(0) ? 0 : formatPrice(position.averageCost)
              }` }
          </p>
        </td>
        <td style={ { ...cellStyle } }>
          <p style={ { ...cellTextStyle } }>
            { `${position.averageCost.eq(0)
              ? 0
              : formatPrice(position.currentPrice)
              }` }
          </p>
        </td>
        <td
          style={ {
            ...cellStyle,
            padding: "16px 24px 16px 12px",
          } }
        >
          <div>
            <p
              style={ {
                ...cellTextStyle,
                color:
                  fonts.colors.solid[
                  position.unrealizedPnl.gt(0)
                    ? "green"
                    : position.unrealizedPnl.lt(0)
                      ? "red"
                      : "white"
                  ],
              } }
            >
              { vaultName === "coveredCall" || !isVault
                ? `${position.unrealizedPnl.eq(0)
                  ? 0
                  : formatPrice(position.unrealizedPnl, true, 2)
                }`
                : "-" }
            </p>
            <p
              style={ {
                ...cellTextStyle,
                fontSize: "12px",
                lineHeight: "20px",
                color: fonts.colors.solid.brightOrange,
              } }
            >
              { vaultName === "coveredCall" || !isVault
                ? `${position.unrealizedPnlPercentage.eq(0)
                  ? 0
                  : (
                    bnToNumber(
                      position.unrealizedPnlPercentage,
                      5,
                      true
                    ) * 100
                  ).toFixed(2)
                } %`
                : "-" }
            </p>
          </div>
        </td>
      </tr>
    </>
  );
};

export default OpenPositionsTableRow;
