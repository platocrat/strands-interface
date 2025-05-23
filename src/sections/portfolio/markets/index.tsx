// Externals
import React, { FC } from "react";
// Locals
import MarketsTable from "./table";
import { CardSection } from "../../strategies/table";
import Spinner from "../../../components/Suspense/Spinner";
import { OuterCard } from "../../../components/ProductInfo";
// Props and Types
import { MarketsProps } from "../../../utils/props";
// CSS
import { definitelyCentered } from "../../../theme/componentStyles";

const marketsSectionTitle = `Markets`;

const Markets: FC<MarketsProps> = ({ markets, marketsDataLoaded }) => {
  return (
    <>
      <CardSection
        style={{
          /**
           * @todo Define `isMobile` and `isDesktop` state variables in `App.tsx`
           * so that you can use them for any child component, like for the
           * amount of bottom margin to use here
           */
          margin: "24px 0px 72px 0px",
        }}
      >
        <OuterCard>
          <div
            className="section-title"
            style={{ margin: "24px 24px 12px 24px" }}
          >
            {marketsSectionTitle}
          </div>

          {marketsDataLoaded ? (
            <MarketsTable markets={markets} />
          ) : (
            <>
              <div style={{ ...definitelyCentered, marginBottom: "45px" }}>
                <Spinner height={"60px"} width={"auto"} />
              </div>
            </>
          )}
        </OuterCard>
      </CardSection>
    </>
  );
};

export default Markets;
