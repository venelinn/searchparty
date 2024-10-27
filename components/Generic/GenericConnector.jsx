import PropTypes from "prop-types";
import { Generic } from "@/components/Generic";

const GenericConnector = (props) => {
	return <Generic heading={props?.heading} pageName={props?.pageName} content={props?.content} />;
};

// TODO: props

export default GenericConnector;
export { GenericConnector };
