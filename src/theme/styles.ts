/**
 * @dev Font styles
 */
export const fonts = {
  weights: {
    light: "400",
    medium: "600",
    bold: "700",
    extraBold: "800",
  },
  sizes: {
    puny: "11px",
    tiny: "12px",
    small: "13px",
    biggieSmalls: "14px",
    normal: "15px",
    md: "18px",
    mdLg: "20px",
    large: "23px",
    xl: "35px",
  },
  colors: {
    solid: {
      red: "rgba(262, 87, 159, 1)",
      green: "rgba(99, 225, 214, 1)",
      white: "#FFF2FB",
      black: "rgb(17, 20, 22)",
      pink: "rgba(253, 172, 205, 1)",
      magenta: "rgba(247, 49, 137, 1)",
      lightPink: "rgba(253, 208, 220, 1)",
      mdPink: "rgba(223, 142, 175, 1)",
      blue: "rgba(99, 182, 245, 1)",
      lightBlue: "rgba(130, 195, 245, 1)",
      darkPink: "rgba(72, 48, 62, 1)",
      brightOrange: "rgba(253, 208, 20, 1)",
      optimismRed: "#EF6B63",
      arbitrumBlue: "rgb(61, 169, 241, 1)",
    },
    transparent: {
      green: "rgba(99, 225, 214, 0.7)",
      red: "rgba(262, 87, 159, 0.7)",
      mdPink: "rgba(223, 142, 175, 0.5)",
      faintMdPink: "rgba(203, 122, 155, 0.35)",
      blue: "rgba(99, 182, 245, 0.5)",
      fainterBlue: "rgba(99, 182, 245, 0.35)",
      darkerPink: "rgba(50, 39, 45, 0.39)",
      white: "rgb(255, 242, 251, 0.7)",
    },
  },
  filters: {
    "drop-shadow": {
      transparent: {
        softDarkPink: "drop-shadow(0rem 0rem 3px rgba(72, 48, 62, 0.7))",
        hardDarkPink: "drop-shadow(0px 0px 3px rgba(72, 48, 62, 0.7))",
        pink: "drop-shadow(0px 0px 3px rgba(253, 172, 205, 0.6)",
        black: "drop-shadow(0px 1px 2px rgba(0, 0, 0 , 0.5))",
      },
      solid: {
        softDarkPink: "drop-shadow(0rem 0rem 1rem rgba(72, 48, 62, 1))",
        hardDarkPink: "drop-shadow(0px 0px 3px rgba(72, 48, 62, 1))",
        pink: "drop-shadow(0px 0px 3px rgba(253, 172, 205, 1)",
        black: "drop-shadow(0px 0.75px 1.5px rgba(0, 0, 0 , 1))",
      },
    },
  },
};

/**
 * @dev Container styles
 */
export const containers = {
  borders: {
    mdPink: "1px solid rgba(253, 172, 205, 0.5)",
  },
  boxShadows: {
    softPink: "0px 0px 10px rgba(253, 172, 205, 0.3)",
    pink: "0px 0px 10px rgba(253, 172, 205, 0.7)",
  },
};

export const buttons = {
  boxShadows: {
    smPink: "0px 0px 10px rgba(253, 172, 205, 0.3)",
    mdPink: "0px 0px 10px rgba(253, 172, 205, 0.5)",
    lgPink: "0px 0px 10px rgba(253, 172, 205, 0.7)",
  },
};

export const cards = {
  blur: "blur(40px)",
  backgroundColor: "rgba(50, 39, 45, 0.39)",
  boxShadows: {
    lightShadow: "0px 5px 7px 0.5px rgba(0, 0, 0, 0.2)",
    midPink: "0px 5px 7px 0.5px rgba(203, 122, 155, 0.75)",
  },
};
