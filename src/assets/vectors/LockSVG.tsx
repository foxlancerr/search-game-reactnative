import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export function LockSVG({
  size = 24,
  color = "#64748b",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="10" rx="3" fill={color} opacity={0.8} />
      <Path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M12 15v2"
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />
    </Svg>
  );
}
