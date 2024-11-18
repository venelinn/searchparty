import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./Grid.module.scss";

const Row = ({ className, customCols, cols, gap, children, ...props }) => (
	<div
		data-cols={cols || customCols}
		style={{ "--_grid-cols": cols }}
		className={cx(styles.grid, className, {
			[styles.gridNoGap]: !gap,
			[styles[customCols]]: customCols,
		})}
		{...props}
		>
		{children}
	</div>
);

Row.displayName = "Row";

const Cell = ({ className, children, cellNormal }) => (
	<div className={cx(styles.gridItem, className, cellNormal ? styles.gridItemNormal : undefined)}>
		{children}
	</div>
);

Cell.displayName = "Cell";

Row.propTypes = {
	className: PropTypes.string,
	cols: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
	children: PropTypes.node.isRequired,
	gap: PropTypes.bool,
};

Row.defaultProps = {
	className: undefined,
	cols: undefined,
	gap: true,
};

Cell.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	cellNormal: PropTypes.bool,
};

Cell.defaultProps = {
	className: undefined,
	cellNormal: false,
};

export { Row, Cell };
