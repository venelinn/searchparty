import Link from "next/link";
import PropTypes from "prop-types";
import cx from "classnames";
import { Icon } from "../Icons/Icons";
import styles from "./Button.module.scss";

const Button = ({
	label,
  href,
  isExternal,
  externalHref,
  type = "button",
  onClick,
  disabled,
  className = "",
  wrapperClassName,
  variant = "secondary",
  size = "lg",
  animationID,
  icon,
}) => {
	const classes = cx(styles.btn, {
		[styles["is-disabled"]]: disabled,
		[styles["is-external"]]: isExternal,
		[styles[`btn--${variant}`]]: variant,
		[styles[`btn--${size}`]]: size,
    [className]: className,
  });


  const renderContent = () => (
    <>
      {icon && <Icon name={icon} size="1.2em" className={styles.icon} />} {/* Render the icon */}
      {label}
    </>
  );

  if (label && href) {
    return (
      <div className={wrapperClassName} data-anim={animationID}>
        <Link className={classes} href={href} onClick={onClick}>
					{renderContent()}
        </Link>
      </div>
    );
  }

  if (label && (isExternal && externalHref)) {
    return (
      <div className={wrapperClassName} data-anim={animationID}>
        <a
          className={classes}
          target={isExternal ? "_blank" :  undefined}
          rel={isExternal ? "noopener noreferrer" :  undefined}
          href={externalHref}
        >
          {renderContent()}
        </a>
      </div>
    );
  }

  if (label) {
    return (
      <div className={wrapperClassName} data-anim={animationID}>
        <button
          type={type}
          className={classes}
          onClick={onClick}
          disabled={disabled}
        >
					{renderContent()}
        </button>
      </div>
    );
  }
	return null; // Ensure the component always returns something
}

Button.propTypes = {
  className: PropTypes.string,
	type: PropTypes.string,
	variant: PropTypes.oneOf(["primary", "secondary",]),
	size: PropTypes.oneOf(["lg", "md"]),
	icon: PropTypes.string,
};

export default Button;
export { Button };