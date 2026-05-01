import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export function TrophySVG({
  size = 36,
  color = "#fbbf24",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path
        d="M18 24c-5 0-9-4-9-9V6h18v9c0 5-4 9-9 9z"
        fill={color}
        opacity={0.9}
      />
      <Path
        d="M9 9H5a3 3 0 0 0 3 3M27 9h4a3 3 0 0 1-3 3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Rect x="13" y="24" width="10" height="3" rx="1.5" fill={color} opacity={0.7} />
      <Rect x="10" y="27" width="16" height="3" rx="1.5" fill={color} />
    </Svg>
  );
}
