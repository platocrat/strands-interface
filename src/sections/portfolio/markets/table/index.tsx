// Externals
import React, { FC } from "react";
// Locals
import MarketsTableBody from "./body";
// Types
import { MarketsTableProps } from "../../../../utils/props";

export const tableHeaderCSS = {
  width: "150px",
  display: "flex",
  fontSize: "14px",
  flex: "150 0 auto",
  padding: "0px 24px",
  alignItems: "center",
};

const marketsHeaders = [`Market`, `24H Price`, `30D Volume`, `Open Interest`];

const MarketsTable: FC<MarketsTableProps> = ({ markets }) => {
  const fragmentKey = (i: number, marketHeader: string): string => {
    return `${i}-${"portfolioHeader"}-${marketHeader}`;
  };

  return (
    <>
      <div className="portfolio-markets-table-section">
        <div className="table-scrollbar" style={{ overflow: "auto hidden" }}>
          <table className="portfolio-markets-table">
            {/* Table header */}
            <thead style={{ display: "flex", padding: "16px 0px" }}>
              <div style={{ display: "flex", flex: "1 0 auto" }}>
                {marketsHeaders.map((marketHeader: string, i: number) => (
                  <React.Fragment key={fragmentKey(i, marketHeader)}>
                    <div style={{ ...tableHeaderCSS }}>
                      <p className="table-column-header">{`${marketHeader}`}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </thead>

            <MarketsTableBody markets={markets} />
          </table>
        </div>
      </div>
    </>
  );
};

export default MarketsTable;
