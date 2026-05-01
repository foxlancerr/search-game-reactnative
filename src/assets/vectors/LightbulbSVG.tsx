import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export function LightbulbSVG({
  size = 36,
  color = "#fbbf24",
  glowing = false,
}: {
  size?: number;
  color?: string;
  glowing?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      {glowing && (
        <Circle cx="18" cy="16" r="14" fill={color} opacity={0.15} />
      )}
      <Path
        d="M18 4a10 10 0 0 0-5 18.7V26h10v-3.3A10 10 0 0 0 18 4z"
        fill={color}
        opacity={0.9}
      />
      <Rect x="14" y="26" width="8" height="2.5" rx="1.25" fill={color} opacity={0.7} />
      <Rect x="15" y="29" width="6" height="2" rx="1" fill={color} opacity={0.5} />
      <Path
        d="M15 14l2 2 4-4"
        stroke="#ffffff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
