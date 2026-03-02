import "./Colors.scss";

const primaryColors = ["blue", "grey", "yellow", "light-grey", "lighter-grey"];

interface BoxProps {
  color: string;
}

const Box = ({ color }: BoxProps) => (
	<div className="color__box">
		<div
			className="color__box__sq"
			style={{ "--box-bgr": `var(--color-${color})` } as React.CSSProperties}
		></div>
		<span className="color__box__legend">{color}</span>
	</div>
);

const Colors = () => (
	<div className="color-root">
		<div className="color-row">
			<h2 className="color-row__title">Primary</h2>
			{primaryColors.map(color => (
				<Box color={color} key={color} />
			))}
		</div>
	</div>
);

export default Colors;
export { Colors, primaryColors };
