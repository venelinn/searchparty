import { Band } from "./Band";

const BandConnector = (props: any) => {
	return (
		<Band
			heading={props?.heading}
			items={props?.members}
		/>
	);
};

export default BandConnector;
export { BandConnector };
