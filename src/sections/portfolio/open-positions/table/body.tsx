// Externals
import React, { CSSProperties, FC } from "react";
// Locals
import OpenPositionsTableRow from "./row";
// CSS
import { fonts } from "../../../../theme/styles";
// Props
import { OpenPositionTableProps } from "../../../../utils/props";
// Types
import { LyraOpenPosition } from "../../../../utils/types";

export const headerTextStyle: CSSProperties = {
  fontFamily: `Inter var", sans-serif`,
  fontWeight: "400",
  lineHeight: "21px",
  fontSize: "14px",
  letterSpacing: "0px",
  textAlign: "left",
  color: fonts.colors.solid.brightOrange,
};

export const cellTextStyle: CSSProperties = {
  ...headerTextStyle,
  color: fonts.colors.solid.white,
};

export const cellStyle: CSSProperties = {
  width: "150px",
  display: "flex",
  flex: "150 0 auto",
  alignItems: "center",
  MozBoxAlign: "center",
};

const OpenPositionsTableBody: FC<OpenPositionTableProps> = ({
  isVault,
  positionIds,
  vaultName,
  openPositions,
  setPositionIds,
  isCloseSelectedOn,
  web3User,
}) => {
  return (
    <>
      <tbody>
        {openPositions.map((position: LyraOpenPosition, i: number) => (
          <React.Fragment key={`${i}-${position.assetSymbol}`}>
            <OpenPositionsTableRow
              web3User={web3User}
              isVault={isVault}
              position={position}
              positionIds={positionIds}
              vaultName={vaultName}
              setPositionIds={setPositionIds}
              isCloseSelectedOn={isCloseSelectedOn}
            />
          </React.Fragment>
        ))}
      </tbody>
    </>
  );
};

export default OpenPositionsTableBody;
