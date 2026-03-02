import React from "react";
import * as Icons from "lucide-react";
import cx from "clsx";
import styles from "./Icons.module.scss";

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: string;
  className?: string;
  title?: string;
  hidden?: boolean;
  strokeWidth?: number;
  size?: string | number;
  color?: string;
}

const Icon = ({
  name,
  className,
  title,
  hidden,
  strokeWidth = 0.75,
  size = "1em",
  color = "currentColor",
  ...props
}: IconProps) => {
  // Dynamically pick the icon from lucide-react
  const LucideIcon = Icons[name];

  // If the icon doesn't exist in lucide-react, render nothing
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIcon
      className={cx(styles.icon, className)}
      aria-label={title || name}
      aria-hidden={hidden || undefined}
      size={size} // Set the size of the icon
      color={color} // Set the color of the icon
			strokeWidth={strokeWidth}
      {...props} // Pass any additional props
    />
  );
};

export default Icon;
export { Icon };