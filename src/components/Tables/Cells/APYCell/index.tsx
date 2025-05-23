// Externals
import { FC } from "react";
// Locals
import {
  CellTooltip,
  StyledAPYCell,
  StyledAPYCellSection,
} from "../PerformanceCell";
// Images
import { ReactComponent as CellTooltipSVG } from "../../../../assets/svg/cell-tooltip.svg";
// CSS
import { fonts } from "../../../../theme/styles";
// import StakedLyraToken from '../../../../assets/png/token-logos/staked-lyra-token.png'
// import StrandsRewardsToken from '../../../../assets/png/token-logos/strands-rewards-token.png'

type APYCellProps = {
  stratAPY?: string;
};

const APYCell: FC<APYCellProps> = ({ stratAPY }) => {
  return (
    <>
      <StyledAPYCellSection>
        <StyledAPYCell>
          <div
            style={{
              width: "38.4px",
              height: "auto",
              display: "flex",
            }}
          >
            {/* <img
            style={ {
              objectFit: 'contain',
              width: '24px',
              height: '24px',
              minWidth: '24px',
              minHeight: '24px',
              maxWidth: '100%',
            } }
            alt='staked lyra token'
            src={ StakedLyraToken }
          /> */}
            {/* <img
              style={ {
                width: '24px',
                height: '24px',
                minWidth: '24px',
                minHeight: '24px',
                maxWidth: '100%',
              } }
              alt='Optimism Token Logo'
              src='https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.svg'
            />
            <img
              style={ {
                width: '24px',
                height: '24px',
                minWidth: '24px',
                minHeight: '24px',
                maxWidth: '100%',
                margin: '0px 0px 0px -9.6px',
              } }
              alt='strands rewards token'
              src={ StrandsRewardsToken }
            /> */}
          </div>
          <div
            className="table-cell-value"
            style={{ color: fonts.colors.solid.white, marginLeft: "-38px" }}
          >
            {stratAPY ?? `TBA`}
          </div>
        </StyledAPYCell>
        <CellTooltip>
          <CellTooltipSVG />
        </CellTooltip>
      </StyledAPYCellSection>
    </>
  );
};

export default APYCell;
