// External
import { FC } from "react";
import styled from "@emotion/styled";
// Locals
import { ReactComponent as CellTooltipSVG } from "../../../../assets/svg/cell-tooltip.svg";

type PerformanceCellProps = {
  stratPerformance?: string;
};

const PerformanceCell: FC<PerformanceCellProps> = ({ stratPerformance }) => {
  return (
    <StyledAPYCellSection>
      <div className="table-cell-value" style={{ color: "#05c99b" }}>
        {stratPerformance ?? `+31.67%`}
      </div>
      <CellTooltip>
        <CellTooltipSVG />
      </CellTooltip>
    </StyledAPYCellSection>
  );
};

export const CellTooltip = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;

  margin: 0px 0px 0px 4px;
  padding-bottom: 1px;

  width: 14px;
  height: 14px;

  color: #6b7d94;

  -webkit-box-align: center;
  align-items: center;
`;

export const StyledAPYCell = styled.div`
  display: flex;
  align-items: center;
  -webkit-box-align: center;
`;

export const StyledAPYCellSection = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;

  cursor: pointer;

  opacity: 1;

  :hover {
    opacity: 0.8;
    transform: scaleX(0.99) scaleY(0.99);
  }

  :active {
    opacity: 0.95;
    transform: scaleX(0.975) scaleY(0.975);
  }
`;

export default PerformanceCell;
