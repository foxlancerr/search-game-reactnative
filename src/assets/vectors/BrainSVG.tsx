import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export function BrainSVG({
  size = 48,
  color = "#6366f1",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="22" fill={color + "22"} />
      <Path
        d="M18 16c-2.2 0-4 1.8-4 4 0 1.1.4 2.1 1.1 2.8C13.8 23.5 13 24.7 13 26c0 2.2 1.8 4 4 4h14c2.2 0 4-1.8 4-4 0-1.3-.8-2.5-1.9-3.2.7-.7 1.1-1.7 1.1-2.8 0-2.2-1.8-4-4-4-1 0-1.9.4-2.6 1C27.1 16.4 25.6 16 24 16s-3.1.4-4.4 1C19.9 16.4 19 16 18 16z"
        fill={color}
        opacity={0.9}
      />
      <Path
        d="M24 17v14M20 19v10M28 19v10"
        stroke="#ffffff"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.5}
      />
    </Svg>
  );
}
