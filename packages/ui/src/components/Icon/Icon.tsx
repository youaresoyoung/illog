import Icons from "../../assets/svg";
import { getKeyFromPath } from "../../utils/util";
import { IconName } from "./types";
import { tokens } from "@illog/themes";

type IconProps = {
  name: IconName;
  size?: keyof typeof tokens.size.icon;
  color?: string;
};

export const Icon = ({ name, size = "medium", color }: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      width={tokens.size.icon[size]}
      height={tokens.size.icon[size]}
      style={{
        color: color
          ? getKeyFromPath(color, tokens.colors.light.icon)
          : tokens.colors.light.icon.default.default,
      }}
    />
  );
};
