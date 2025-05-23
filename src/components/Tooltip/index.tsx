// Externals
import React, { FC, ReactNode, useState } from "react";
// Locals
import { CellTooltip } from "../Tables/Cells/PerformanceCell";
// Images
import { ReactComponent as CellTooltipSVG } from "../../assets/svg/cell-tooltip.svg";

export type StrandsTooltipProps = {
  delay?: number;
  direction: string;
  children?: ReactNode;
  content: string | ReactNode;
};

const StrandsTooltip: FC<StrandsTooltipProps> = ({
  delay,
  content,
  children,
  direction,
}) => {
  let timeout;

  const [active, setActive] = useState(false);

  const showTip = (): void => {
    timeout = setTimeout((): void => {
      setActive(true);
    }, delay || 100);
  };

  const hideTip = (): void => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {!children && (
        <CellTooltip>
          <CellTooltipSVG />
        </CellTooltip>
      )}
      {active && (
        <div className={`tooltip-tip ${direction || "top"}`}>{content}</div>
      )}
    </div>
  );
};

export default StrandsTooltip;
