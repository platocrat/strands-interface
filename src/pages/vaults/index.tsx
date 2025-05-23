// Externals
import styled from "@emotion/styled";
// Locals
import Nav from "../../components/Nav";
import Header from "../../components/Header";
import PageLock from "../../components/PageLock";
import ProductInfo from "../../components/ProductInfo";
import AssetSelector from "../../components/Selectors/AssetSelector";
// Sections
import StrategiesTVLSumChart from "../../sections/strategies/chart";
import StrategiesTable from "../../sections/strategies/table";
// CSS
import { definitelyCentered } from "../../theme/componentStyles";

const isOneClicks = false;

const Vaults = () => {
  return (
    <>
      <PageLock mobileNav={ <Nav /> } header={ <Header /> }>
        <div style={ { ...definitelyCentered } }>
          <MainPageSection>
            <AssetSelector isOneClicks={ isOneClicks } />

            <PageContentOuterSectionWrapper>
              <PageContentOuterSection>
                <PageContentInnerSection>
                  <StrategiesTVLSumChart />

                  <StrategiesTable />
                </PageContentInnerSection>
              </PageContentOuterSection>
            </PageContentOuterSectionWrapper>

            {/* Product info cards */ }
            <ProductInfo />
          </MainPageSection>
        </div>
      </PageLock>
    </>
  );
};

export const PageContentInnerSection = styled.div`
  display: flex;

  flex-grow: 1;
  flex-direction: column;
  -webkit-box-flex: 1;
`;

export const PageContentOuterSection = styled.div`
  display: flex;
  flex-direction: column;

  flex-grow: 1;
  -webkit-box-flex: 1;
`;

export const PageContentOuterSectionWrapper = styled.div`
  flex-grow: 1;
  -webkit-box-flex: 1;
`;

export const PageTitle = styled.div`
  font-family: Sohne, sans-serif;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
`;

export const PageTitleSection = styled.div`
  display: flex;
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 16px;
`;

export const MainPageSection = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  width: 100%;
  max-width: 1420px;
  -webkit-box-flex: 1;
  flex-grow: 1;

  padding-top: 12px;
  padding-left: 24px;
  padding-right: 24px;
`;

export default Vaults;
