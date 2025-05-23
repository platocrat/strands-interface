import { fonts } from "../../theme/styles";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <p
        style={{
          border: "none",
          outline: "none",
          color: fonts.colors.solid.lightPink,
          background: "transparent",
          fontSize: fonts.sizes.small,
        }}
      >
        {`${payload[0].payload.date}`}
      </p>
    );
  }

  return null;
};

export default CustomTooltip;
