import { forwardRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Grid.module.scss";

const Row = forwardRef(
  (
    {
      className = undefined,
      customCols,
      cols = undefined,
      gap = true,
      children,
      ...props
    },
    ref
  ) => (
    <div
      data-cols={cols || customCols}
      style={{ "--_grid-cols": cols }}
      className={cx(styles.grid, className, {
        [styles.gridNoGap]: !gap,
        [styles[customCols]]: customCols,
      })}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);

Row.displayName = "Row";

const Cell = ({
  className = undefined,
  children,
  cellNormal = false,
  ...props
}) => (
  <div
    className={cx(
      styles.gridItem,
      className,
      cellNormal ? styles.gridItemNormal : undefined
    )}
    {...props}
  >
    {children}
  </div>
);

Row.propTypes = {
  className: PropTypes.string,
  cols: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  children: PropTypes.node.isRequired,
  gap: PropTypes.bool,
};

Cell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  cellNormal: PropTypes.bool,
};

export { Row, Cell };
