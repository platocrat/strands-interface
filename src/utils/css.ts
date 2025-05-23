/**
 * @dev Converts a hex-color-code string to an RGBA-color-code string.
 * @notice Used for creating unique transparency in CSS.
 * @param hex A hex string
 * @param opacity A float from 0 - 1 passed as a `number`
 * @returns `rgba` An RBGA-color-code string
 */
function hexToRgbA(hex: string, opacity: number) {
  let c: any,
    rgba = "";

  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");

    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }

    c = "0x" + c.join("");

    rgba =
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      `, ${opacity})`;

    return rgba;
  }

  throw new Error("Bad Hex");
}

/**
 * @dev Converts a hex-color-code string to an HSL-color-code string format.
 * @notice Used for creating unique transparency in CSS.
 * @param H A hex string
 * @param opacity A float from 0 - 1 passed as a `number` or `string` type
 * @returns `hsl` An HSL-color-code string
 */
function hexToHSL(H: string, opacity?: number | string) {
  // Convert hex to RGB first
  let r: any = 0,
    g: any = 0,
    b: any = 0,
    hsl = "";

  if (H.length === 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length === 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  if (opacity) {
    hsl = "hsl(" + h + "," + s + "%," + l + "%," + opacity + ")";
    return hsl;
  } else {
    hsl = "hsl(" + h + "," + s + "%," + l + "%)";
    return hsl;
  }
}

export { hexToHSL, hexToRgbA };
