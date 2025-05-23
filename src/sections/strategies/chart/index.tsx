import styled from "@emotion/styled";
// Locals
import TVL from "./TVL";

const Chart = () => {
  return (
    <>
      <ChartSection>
        <TVL />
      </ChartSection>
    </>
  );
};

export const ChartSection = styled.div`
  height: 100%;
  margin-bottom: 24px;
`;

export default Chart;
