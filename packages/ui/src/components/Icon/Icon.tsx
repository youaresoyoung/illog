import Icons from "../../assets/svg";
import { IconName } from "./types";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export const Icon = ({ name, size, color }: IconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent width={size} height={size} fill={color} />;
};
