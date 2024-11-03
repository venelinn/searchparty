import React from "react";
import { Row, Cell } from ".";
import * as styles from "./Grid.stories.module.scss";

export default {
	title: "Components/Grid",
	component: Row,
	subcomponents: { Cell },
};

const controls = {
	children: {
		control: {
			type: null,
		},
	},
	customCols: {
		control: {
			type: null,
		},
	},
	cols: {
		options: [1, 2, 3, 4, 5, 6],

		control: {
			type: "select",
		},
	},
};

export const Example = {
	render: args => <Row {...args} />,
	args: {
		className: styles.demoGrid,
		cols: 3,
		children: [...Array(5).keys()].map(index => (
			<Cell key={index}>
				<span>Cell {index + 1}</span>
			</Cell>
		)),
	},
	argTypes: controls,
};

export const Playground = {
	render: ({ numberOfTestEntries, ...args }) => (
		<Row {...args}>
			{[...Array(numberOfTestEntries).keys()].map(index => (
				<Cell key={index}>
					<span>Cell {index + 1}</span>
				</Cell>
			))}
		</Row>
	),
	args: {
		className: styles.demoGrid,
		cols: 3,
		numberOfTestEntries: 10,
	},
	argTypes: {
		...controls,
		numberOfTestEntries: {
			name: "# of test entries",
			table: {
				category: "Development",
			},
		},
	},
	parameters: {
		docs: {
			source: {
				code: "disabled",
			},
		},
	},
};
