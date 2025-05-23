// Externals
import { Menu, Button, MenuList, MenuButton, MenuItem } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { FC, Fragment, useContext, useLayoutEffect } from "react";
// Locals
import AssetImgTernary from "../../AssetImgTernary";
import { StyledLink } from "../../../sections/strategies/strategy";
// Contexts
import { UnderlierContext } from "../../../contexts/UnderlierContext";
// Misc utils
import { updateRoute } from "../../../utils/misc";
// Constants
import { assetObjs } from "../../../utils/constants";
// CSS
import { fonts, cards } from "../../../theme/styles";
import { bsbc } from "../../../theme/componentStyles";
// Types
import { AssetType } from "../../../utils/types";
// Images
import { ReactComponent as DropdownSVG } from "../../../assets/svg/dropdown.svg";

const AssetSelector: FC<any> = ({ isOneClicks }) => {
  const { assetName, assetSymbol, setAssetName, setAssetSymbol } =
    useContext(UnderlierContext);

  function handleSelectAsset(_assetName: string, _assetSymbol: string) {
    setAssetName(_assetName);
    setAssetSymbol(_assetSymbol);
    if (isOneClicks) {
      window.history.pushState(
        {
          page: "one-clicks",
          assetName: _assetName,
          assetSymbol: _assetSymbol,
        },
        `pushState /one-clicks/path`,
        `/one-clicks/${_assetName}-${_assetSymbol}`
      );
    } else {
      window.history.pushState(
        {
          page: "vaults",
          assetName: _assetName,
          assetSymbol: _assetSymbol,
        },
        `pushState /vaults/path`,
        `/vaults/${_assetName}-${_assetSymbol}`
      );
    }
  }

  useLayoutEffect(() => {
    if (isOneClicks) {
      window.history.pushState(
        {
          page: "one-clicks",
          assetName: assetName,
          assetSymbol: assetSymbol,
        },
        `pushState /one-clicks/path`,
        `/one-clicks/${assetName}-${assetSymbol}`
      );
    } else {
      window.history.pushState(
        {
          page: "vaults",
          assetName: assetName,
          assetSymbol: assetSymbol,
        },
        `pushState /vaults/path`,
        `/vaults/${assetName}-${assetSymbol}`
      );
    }
  }, []);

  return (
    <>
      <div
        style={{
          color: fonts.colors.solid.white,
          fontSize: fonts.sizes.md,
          marginBottom: "10px",
          zIndex: "2",
        }}
      >
        <Menu>
          {({ isOpen }) => (
            <Fragment key={`asset-selector-menu-isOpen-${isOpen}`}>
              <SMenuButton
                style={{
                  padding: "8px 18px",
                  borderRadius: bsbc.borderRadius,
                  backdropFilter: "blur(2.5px)",
                }}
                isActive={isOpen}
                as={Button}
                rightIcon={
                  isOpen ? (
                    <DropdownSVG style={{ transform: "rotate(180deg)" }} />
                  ) : (
                    <DropdownSVG />
                  )
                }
              >
                <div style={{ display: "flex" }}>
                  <div style={{ position: "relative", top: "2px" }}>
                    <AssetImgTernary />
                  </div>
                  <p style={{ padding: "4px 5px", marginLeft: "5px" }}>
                    {`${assetName}`}
                  </p>
                </div>
              </SMenuButton>
              <MenuList
                style={{
                  boxShadow: "0px 0px 10px rgba(253, 172, 205, 0.4)",
                  backdropFilter: cards.blur,
                  color: fonts.colors.solid.white,
                  borderRadius: bsbc.borderRadius,
                  fontSize: fonts.sizes.biggieSmalls,
                  backgroundColor: fonts.colors.transparent.darkerPink,
                }}
              >
                {assetObjs.map((assetObj: AssetType, index: number) => (
                  <Fragment
                    key={`menu-list-item-all-${index}-${assetObj.address}-${assetObj.assetName}`}
                  >
                    {assetObj.assetName === "Chainlink" ? null : (
                      <Fragment
                        key={`menu-list-item-visible-${index}-${assetObj.address}-${assetObj.assetName}`}
                      >
                        <StyledLink
                          to={updateRoute(
                            assetObj.assetName,
                            assetObj.assetSymbol,
                            isOneClicks
                          )}
                          onClick={() =>
                            handleSelectAsset(
                              assetObj.assetName,
                              assetObj.assetSymbol
                            )
                          }
                        >
                          <MenuItem
                            className="chakra-menu-item"
                            style={{
                              borderRadius:
                                index === 0
                                  ? "2rem 2rem 0rem 0rem"
                                  : index === assetObjs.length - 1
                                  ? "0rem 0rem 2rem 2rem"
                                  : "",
                            }}
                          >
                            <AssetImgTernary
                              _assetSymbol={assetObj.assetSymbol}
                            />
                            <p style={{ marginLeft: "10px" }}>
                              {`${assetObj.assetName}`}
                            </p>
                          </MenuItem>
                        </StyledLink>
                      </Fragment>
                    )}
                  </Fragment>
                ))}
              </MenuList>
            </Fragment>
          )}
        </Menu>
      </div>
    </>
  );
};

const SMenuButton = styled(MenuButton)`
  box-shadow: 0px 0px 10px rgba(253, 172, 205, 0.3);

  :hover {
    opacity: 0.8;
    background-color: rgba(50, 39, 45, 0.29);
    box-shadow: 0px 0px 10px rgba(253, 172, 205, 0.35);
  }

  :active {
    opacity: 1;
    background-color: rgba(60, 49, 55, 0.79);
  }
`;

export default AssetSelector;
