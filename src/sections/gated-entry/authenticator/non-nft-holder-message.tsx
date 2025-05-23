import { fonts, containers, cards } from "../../../theme/styles";
import { definitelyCentered, bsbc } from "../../../theme/componentStyles";

const NonNftHolderMessage = () => {
  return (
    <>
      <div
        style={{
          ...definitelyCentered,
          top: "42%",
          marginRight: "-14px",
          position: "relative",
        }}
      >
        <p
          style={{
            color: fonts.colors.solid.white,
            boxShadow: containers.boxShadows.softPink,
            border: containers.borders.mdPink,
            padding: "10px 20px",
            fontSize: fonts.sizes.normal,
            filter: fonts.filters["drop-shadow"].transparent.hardDarkPink,
            borderRadius: bsbc.borderRadius,
            backgroundColor: cards.backgroundColor,
            backdropFilter: "blur(5.6px)",
          }}
        >
          {"You are not on the whitelist!"}
        </p>
      </div>
    </>
  );
};

export default NonNftHolderMessage;
