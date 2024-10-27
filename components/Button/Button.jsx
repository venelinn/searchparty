import Link from "next/link";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Button.module.scss";

const Button = ({
	id,
  label,
  href,
  isExternal,
  anchor,
  type,
  onClick,
  disabled,
  className,
  wrapperClassName,
	variant,
	size,
	full,
	animationID,
}) => {
  const classes = cx(styles.btn, {
    [styles["is-disabled"]]: disabled,
    [styles["btn--full"]]: full,
    [styles[`btn--${variant}`]]: variant,
    [styles[`btn--${size}`]]: size,
    [className]: className,
  });

  const commonProps = {
    className: classes,
    onClick: onClick,
    disabled: disabled,
    "data-sb-object-id": id,
  };
	const isExternalLink = isExternal || (href && href.startsWith("http"));

	if (label && href) {
    return (
      <div className={wrapperClassName} data-anim={animationID} data-sb-object-id={id}>
        {isExternalLink ? (
          <a {...commonProps} href={href} target="_blank" rel="noopener noreferrer">
            <span data-sb-field-path="label">{label}</span>
          </a>
        ) : (
          <Link {...commonProps} href={href}>
            <span data-sb-field-path="label">{label}</span>
          </Link>
        )}
      </div>
    );
  }

  if (label && anchor) {
    return (
      <div className={wrapperClassName} data-anim={animationID} data-sb-object-id={id}>
        <a {...commonProps} href={`#${anchor}`}>
          <span data-sb-field-path="label">{label}</span>
        </a>
      </div>
    );
  }

  if (label) {
    return (
      <div className={wrapperClassName} data-anim={animationID}>
        <button {...commonProps} type={type}>
          <span data-sb-field-path="label">{label}</span>
        </button>
      </div>
    );
  }

  return null;
};

Button.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  isExternal: PropTypes.bool,
  anchor: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "noStyle"]),
  size: PropTypes.oneOf(["lg"]),
  full: PropTypes.bool,
  animationID: PropTypes.string,
};

Button.defaultProps = {
  className: "",
  type: "button",
	variant: "primary",
	size: "lg",
	full: false,
};

export default Button;
export { Button };