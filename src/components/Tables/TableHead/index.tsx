import { FC, memo } from "react";
import styled from "@emotion/styled";
// Locals
import StrandsTooltip from "../../Tooltip";
// Props
import { TableHeadProps } from "../../../utils/props";

const TableHead: FC<TableHeadProps> = ({
  isHome,
  assetSymbol,
  isOneClicks,
  firstHeaderName,
}) => {
  return (
    <>
      <SThead>
        <Str role="row">
          <Sth role="columnheader" style={{ maxWidth: "234px" }}>
            <div className="table-column-header">{`${firstHeaderName}`}</div>
          </Sth>

          {isOneClicks ? (
            <>
              <Sth
                role="columnheader"
                style={{
                  maxWidth: "300px",
                  justifyContent: "center",
                }}
              >
                <div className="table-column-header">
                  <div>
                    <p>{"Prices (Bid @ Ask)"}</p>
                  </div>
                </div>
              </Sth>
              <Sth role="columnheader" style={{ justifyContent: "center" }}>
                <div
                  style={{ marginLeft: "50px" }}
                  className="table-column-header"
                >
                  {"Customization"}
                </div>
              </Sth>
            </>
          ) : (
            <>
              <Sth role="columnheader">
                <div className="table-column-header">{"TVL"}</div>
                <StrandsTooltip
                  direction={"top"}
                  content={`Total Value Locked.`}
                />
              </Sth>
              <Sth role="columnheader">
                <div className="table-column-header">{"CUB"}</div>
                <StrandsTooltip
                  direction={"top"}
                  content={`Cumulative User Base.`}
                />
              </Sth>
              <Sth role="columnheader">
                <div className="table-column-header">{"Reward APY"}</div>
                <StrandsTooltip direction={"top"} content={`TBA.`} />
              </Sth>
            </>
          )}

          <Sth
            role="columnheader"
            style={{ maxWidth: isOneClicks ? "234px" : "" }}
          >
            <div className="table-column-header" />
          </Sth>
        </Str>
      </SThead>
    </>
  );
};

export const Sth = styled.th`
  display: flex;
  width: 100%;

  padding-left: 24px;
  padding-right: 24px;
  -webkit-box-align: center;
  align-items: center;
`;

const Str = styled.tr`
  display: flex;
  width: 100%;
`;

const SThead = styled.thead`
  display: table-header-group;

  @media screen and (max-width: 901px) {
    display: none;
  }
`;

export default memo(TableHead);
