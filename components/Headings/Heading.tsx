import cx from "classnames";
import styles from  "./Heading.module.scss";

interface HeadingProps {
  uppercase?: boolean;
  as?: HeadingTag;
  size?: HeadingSizeValue;
  className?: string;
  children?: React.ReactNode;
  center?: boolean;
  animationID?: string;
	color?: string;
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "div";

const HeadingAsElement: HeadingTag[] = ["h1", "h2", "h3", "h4", "h5", "div"];

type HeadingSizeValue = HeadingTag | "hero" | "base";

const HeadingSizeRaw: HeadingTag[] = ["h1", "h2", "h3", "h4", "h5"];
const HeadingSize: HeadingSizeValue[] = [...HeadingSizeRaw, "hero", "base" ];

const Heading: React.FC<HeadingProps> = ({
  uppercase,
  as,
  size,
  className,
  children,
  center,
  animationID,
	color,
	...props
}) => {
	const Tag = as as HeadingTag;
  const classes = cx(styles.heading, {
    [styles[`heading--${size}`]]: size,
    [styles["heading--uppercase"]]: uppercase,
    [styles["heading--center"]]: center,
    [`${className}`]: className,
  });
  return (
    <Tag
			className={classes}
			data-anim={animationID}
			style={color ? { "--heading-color": `var(--color-${color})` } as React.CSSProperties : undefined}
			{...props}
			>
      {children}
    </Tag>
  );
};

Heading.defaultProps = {
  uppercase: true,
  size: "h2",
  as: "h2",
  className: undefined,
  center: false,
  children: undefined,
  animationID: undefined,
};

export default Heading;
export { Heading, HeadingAsElement, HeadingSize };
export type { HeadingProps };
