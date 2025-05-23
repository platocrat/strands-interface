// Externals
import { useNetwork } from "wagmi";
import styled from "@emotion/styled";
import React, { FC, useContext } from "react";
// Locals
import ListItem from "../ListItem";
// Contexts
import { UnderlierContext } from "../../../contexts/UnderlierContext";
// Utils
import { getCA, strategyVaultReactKey } from "../../../utils/misc";
// Constants
import { assetObjs } from "../../../utils/constants";
// Props
import { UnorderedListProps } from "../../../utils/props";
// Types
import { AssetType, VaultObjectType } from "../../../utils/types";

const UnorderedList: FC<UnorderedListProps> = ({
  isAssets,
  vaultCtcs,
  oneClicks,
}) => {
  const { chain } = useNetwork();
  const { assetName, assetSymbol } = useContext(UnderlierContext);

  return (
    <>
      <UnorderedListSection>
        <>
          {/** @dev For `assetObjs` */}
          {isAssets && !vaultCtcs && assetObjs && (
            <>
              {assetObjs.map((assetObj: AssetType, index: number) => (
                <React.Fragment
                  key={`${index}-${assetObj.address}-${assetObj.assetName}`}
                >
                  <ListItem isAssets={isAssets} />
                </React.Fragment>
              ))}
            </>
          )}
          {/** @dev For `vaultCtcs` */}
          {!isAssets && vaultCtcs && assetName && assetSymbol && (
            <>
              {vaultCtcs.map((sObj: VaultObjectType, sObjIndex: number) => (
                <React.Fragment
                  key={strategyVaultReactKey(sObjIndex, chain, sObj)}
                >
                  <ListItem
                    isAssets={isAssets}
                    isActive={sObj.isActive}
                    vaultAddress={getCA(chain, sObj)}
                    vaultNameKey={sObj.vaultName.key}
                    vaultNameTitle={sObj.vaultName.title}
                  />
                </React.Fragment>
              ))}
            </>
          )}
        </>
      </UnorderedListSection>
    </>
  );
};

const UnorderedListSection = styled.ul`
  background-color: transparent;
  overflow: hidden;
  list-style-type: none;

  margin-bottom: 24px;

  @media screen and (min-width: 901px) {
    display: none;
  }
`;

export default UnorderedList;

// ---------- Append the code below to the bottom of the component above -------
//   <>
// {/** @todo For `oneClicks` */ }
// {
//   !isAssets && oneClicks && !vaultCtcs && !assetObjs && (
//     <>
//       { oneClicks.map((oneClick: ocType) => (
//         <>
//         </>
//       )) }
//     </>
//   )
// }
//           </>
