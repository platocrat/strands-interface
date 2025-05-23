// Externals
import styled from "@emotion/styled";
// Locals
import { OuterCard } from "../../../components/ProductInfo";
import UnorderedList from "../../../components/Lists/UnorderedList";
import StrategyTable from "../../../components/Tables/StrategyTable";
// Metadata
import { evmContracts } from "../../../utils/globalMetadata";
// CSS
import { cards } from "../../../theme/styles";
// Types
import { VaultObjectType } from "../../../utils/types";

const isAssets = false;
const vaultCtcs: VaultObjectType[] = Object.values(evmContracts.vaults);

const StrategiesTable = () => {
  const strategyTableTitle = "Strands Volatility Trading Algorithms";

  return (
    <>
      <CardSection>
        <OuterCard>
          <div
            className="section-title"
            style={{ margin: "24px 24px 12px 24px" }}
          >
            {strategyTableTitle}
          </div>
          <UnorderedList isAssets={isAssets} vaultCtcs={vaultCtcs} />
          <TableSection>
            <StrategyTable vaultCtcs={vaultCtcs} />
          </TableSection>
        </OuterCard>
      </CardSection>
    </>
  );
};

export const TableSection = styled.div`
  // This @media rule is required so that we can hide 'AssetsTable'.
  // If this @media rule is moved inside of 'AssetsTable', it does not work.
  @media screen and (max-width: 900px) {
    display: none;
  }
`;

export const CardSection = styled.div`
  border-radius: 28px;

  box-shadow: ${cards.boxShadows.lightShadow};

  backdrop-filter: ${cards.blur};
  position: relative;
  padding-bottom: 5px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  background-color: ${cards.backgroundColor};
`;

export default StrategiesTable;
