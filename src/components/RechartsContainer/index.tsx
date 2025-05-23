// Externals
import { FC, useLayoutEffect, useState } from "react";
import {
  Area,
  YAxis,
  XAxis,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
// Locals
import CustomTooltip from "./CustomTooltip";
// Props
import { RechartsContainerProps } from "../../utils/props";
// CSS
import { fonts } from "../../theme/styles";
import { placeholderData } from "../../utils/constants";

const RechartsContainer: FC<RechartsContainerProps> = ({
  data,
  yPos,
  height,
  chartHeight,
  chartTopMargin,
  mobileChartHeight,
}) => {
  // General useStates
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // For `isMobile`
  const mediaQuery = window.matchMedia("(max-width: 900px)");

  function handleMobile(e: any) {
    setIsMobile(e.matches ? true : false);
  }

  useLayoutEffect(() => {
    handleMobile(mediaQuery); // required to set `isMobile` on initial render
    mediaQuery.addEventListener("change", handleMobile);
  }, [isMobile]);

  // Ternaries
  const areaChartTopMargin = isMobile
    ? mobileChartHeight ?? 185
    : chartHeight ?? 40;
  const tooltipYPosition = isMobile
    ? (yPos ?? 200) * 0.8
    : yPos ?? chartHeight ?? 10 * 1.15;

  return (
    <>
      <ResponsiveContainer
        id="resp-container"
        width={"100%"}
        height={height ?? 315}
      >
        <AreaChart
          className={chartHeight ? "tvl-chart" : ""}
          data={data ?? placeholderData}
          margin={{
            top: areaChartTopMargin,
            right: 0,
            bottom: isMobile ? 20 : 0,
            left: -59,
          }}
        >
          <XAxis dataKey="dates" tickLine={false} axisLine={false} />
          <YAxis dataKey="tvl" tick={false} axisLine={false} tickLine={false} />
          <Tooltip
            separator=""
            offset={-35}
            position={{ y: tooltipYPosition }}
            isAnimationActive={false}
            cursor={{ stroke: fonts.colors.solid.pink }}
            allowEscapeViewBox={{ y: true, x: true }}
            wrapperStyle={{ background: "transparent", outline: "none" }}
            labelStyle={{ background: "transparent" }}
            content={<CustomTooltip />}
          />
          <Area
            dataKey="tvl"
            stroke={fonts.colors.solid.pink}
            fill={fonts.colors.transparent.mdPink}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default RechartsContainer;
