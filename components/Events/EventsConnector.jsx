import { Events } from "./Events";

const EventsConnector = (props) => {
	return (
	<Events
		id={props?.id}
		title={props?.pageName}
		events={props?.events}
		locale={props?.locale}
	/>
)}

export default EventsConnector;
export { EventsConnector };
