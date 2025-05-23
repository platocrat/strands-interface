// Locals
import React, { FC } from "react";
import { phthType } from "../../../../utils/types";

export type PortfolioHistoryTableHeaderProps = {
  isVault?: boolean;
};

const PortfolioHistoryTableHeader: FC<PortfolioHistoryTableHeaderProps> = ({
  isVault,
}) => {
  const tableHeaders: phthType[] = isVault
    ? [
        { title: "Date/Time", css: "phhc-1" },
        { title: "Trade", css: "phhc-2" },
        { title: "Open Price", css: "phhc-4" },
      ]
    : [
        { title: "Time", css: "phhc-1" },
        { title: "Position", css: "phhc-2" },
        { title: "Status", css: "phhc-3" },
        { title: "Open Price", css: "phhc-4" },
        { title: "Close Price", css: "phhc-4" },
        { title: "Profit / Loss", css: "phhc-4" },
      ];

  return (
    <>
      <thead
        style={{
          display: "flex",
          paddingTop: "16px",
          paddingBottom: "8px",
        }}
      >
        <tr style={{ display: "flex", flex: "1 0 auto" }}>
          {tableHeaders.map((th: phthType, i: number) => (
            <React.Fragment key={`portfolio-history-header-${th.title}-${i}`}>
              <th
                style={{ width: i === 0 && isVault ? "177px" : "" }}
                className={`portfolio-history-header-cell ${th.css}`}
              >
                <p className="portfolio-history-header-cell-text">{th.title}</p>
              </th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
    </>
  );
};

export default PortfolioHistoryTableHeader;
