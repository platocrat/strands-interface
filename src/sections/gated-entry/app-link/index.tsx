// Externals
import { FC } from "react";
import { NavLink } from "react-router-dom";
// Locals
import { fonts } from "../../../theme/styles";
import { AppLinkProps } from "../../../utils/props";
import { definitelyCentered } from "../../../theme/componentStyles";

const AppLink: FC<AppLinkProps> = ({}) => {
  return (
    <>
      <NavLink to="/home" style={{ ...definitelyCentered }}>
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "18%",
            zIndex: "0",
            borderRadius: "99999px",
            opacity: "0.7",
            filter: `drop-shadow(0px 1px 60.5px ${fonts.colors.solid.darkPink})`,
            height: "20px",
            padding: "5px 18px 8px 18px",
            width: "60px",
            marginLeft: "30px",
          }}
        />
        <div className="home-page-button-wrapper">{`enter`}</div>
      </NavLink>
    </>
  );
};

export default AppLink;
