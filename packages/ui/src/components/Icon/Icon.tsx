import Icons from "../../assets/svg";
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
      fill={color}
    />
  );
};
