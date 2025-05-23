import { CSSProperties } from "react";
import { buttons, cards, containers, fonts } from "./styles";

/**
 * @dev `B`utton `S`tyle `B`efore `C`onnection
 * @notice Component style
 */
export const bsbc = {
  display: "flex",
  cursor: "pointer",
  padding: "8px 18px",
  borderRadius: "2rem",
  color: fonts.colors.solid.pink,
  backdropFilter: "blur(18px)",
  fontSize: fonts.sizes.normal,
  border: containers.borders.mdPink,
  boxShadow: "0px 0px 10px rgba(253, 172, 205, 0.7)",
};

/**
 * @dev `B`utton `s`tyle `A`fter `C`onnection
 * @notice Component style
 */
export const bsac = {
  gap: "18px",
  display: "flex",
  cursor: "pointer",
  marginRight: "15px",
  borderRadius: "2rem",
  color: fonts.colors.solid.pink,
  backdropFilter: "blur(18px)",
  fontSize: fonts.sizes.normal,
  gridTemplateColumns: "1fr 1fr",
  fontWeight: fonts.weights.bold,
  border: containers.borders.mdPink,
  boxShadow: containers.boxShadows.softPink,
  filter: fonts.filters["drop-shadow"].solid.softDarkPink,
};

/**
 * @dev `C`oming `S`oon `T`able `B`utton
 * @notice Component style
 */
export const cstb = {
  color: bsbc.color,
  border: bsbc.border,
  display: bsbc.display,
  cursor: "not-allowed",
  padding: `6px 18px`,
  fontSize: bsbc.fontSize,
  boxShadow: buttons.boxShadows.smPink,
  borderRadius: bsbc.borderRadius,
  backdropFilter: bsbc.backdropFilter,
};

/**
 * @dev `E`xtra `B`utton `S`tyle `F`or `B`uttons
 * @notice Component style
 */
export const ebsfb = {
  color: bsbc.color,
  border: bsbc.border,
  cursor: bsbc.cursor,
  padding: bsbc.padding,
  fontSize: bsbc.fontSize,
  boxShadow: bsbc.boxShadow,
  borderRadius: bsbc.borderRadius,
  backdropFilter: bsbc.backdropFilter,
};

/**
 * @dev General centering
 */
export const definitelyCentered = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const bidAskQuickMenuTitleStyle: CSSProperties = {
  textAlign: "center",
  margin: "0px 0px 10px 0px",
  color: fonts.colors.solid.brightOrange,
};

export const bidAskQuickMenuInputStyle: CSSProperties = {
  top: "5.5px",
  height: "21px",
  fontSize: "11.75px",
  border: bsbc.border,
  position: "relative",
  width: "90px",
  padding: bsbc.padding,
  backgroundColor: "transparent",
  borderRadius: bsbc.borderRadius,
};

/**
 * @dev `P`rices and `Q`uotes `T`ext `S`tyle
 */
export const pqtStyle: CSSProperties = {
  textAlign: "left",
};

/**
 * @dev `P`rices and `Q`uotes `V`alue `S`tyle
 */
export const pqvStyle: CSSProperties = {
  textAlign: "right",
};

/**
 * @dev `S`trands `L`ogo `H`eight `W`idth landing
 */
export const slhwl = "225px";

/**
 * @dev `S`trands `L`ogo `H`eight `W`idth app
 */
export const slhwa = "175px";

export const callDeltaCellStyle: CSSProperties = {
  width: "96px",
  display: "flex",
  minWidth: "0px",
  fontSize: "14px",
  flex: "96 0 auto",
  alignItems: "center",
  WebkitBoxAlign: "center",
  padding: "16px 12px 16px 24px",
  color: fonts.colors.solid.white,
};

export const deltaValueStyle: CSSProperties = {
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "21px",
  letterSpacing: "0px",
  color: fonts.colors.solid.white,
  fontFamily: `"Inter var", sans-serif`,
};

export const customInputBoxStyle: CSSProperties = {
  ...definitelyCentered,
  bottom: "8px",
  display: "flex",
  maxWidth: "150px",
  maxHeight: "28px",
  border: bsbc.border,
  position: "relative",
  borderRadius: bsbc.borderRadius,
  backgroundColor: cards.backgroundColor,
};

// CSS Properties
export const customizeOptionStyle: CSSProperties = {
  display: "flex",
  marginTop: "8px",
};

export const selectorStyle = (oneClick: any): CSSProperties => {
  const cssProperties_: CSSProperties = {
    top: "8px",
    display: "flex",
    marginBottom: "4px",
    flexDirection: "row",
    position: "relative",
  };

  return cssProperties_;
};

export const labelStyle: CSSProperties = {
  width: "55px",
  display: "flex",
  position: "relative",
  fontSize: fonts.sizes.tiny,
  fontWeight: fonts.weights.light,
  color: fonts.colors.solid.brightOrange,
  filter: fonts.filters["drop-shadow"].transparent.hardDarkPink,
};

export const customizeSpreadBidAskButtonStyle: CSSProperties = {
  width: "58px",
  height: "30px",
};
