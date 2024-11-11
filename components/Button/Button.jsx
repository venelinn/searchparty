import Link from "next/link";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Button.module.scss";

const Button = ({
  label,
  href,
  isExternal,
  externalHref,
  type,
  onClick,
  disabled,
  className,
  wrapperClassName,
	variant,
	size,
	animationID,
}) => {
	const classes = cx(styles.btn, {
		[styles["is-disabled"]]: disabled,
		[styles["is-external"]]: isExternal,
		[styles[`btn--${variant}`]]: variant,
		[styles[`btn--${size}`]]: size,
    [className]: className,
  });
  if (label && href) {
    return (
      <div className={wrapperClassName} data-anim={animationID}>
        <Link className={classes} href={href} onClick={onClick}>
					{label}
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
          {label}
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
        >{label}
        </button>
      </div>
    );
  }
}

Button.propTypes = {
  className: PropTypes.string,
	type: PropTypes.string,
	variant: PropTypes.oneOf(["primary", "secondary",]),
	size: PropTypes.oneOf(["lg", "md"]),
};

Button.defaultProps = {
  className: "",
  type: "button",
	variant: "secondary",
	size: "lg",
};


export default Button;
export { Button };