import { Events } from "./Events";

const EventsConnector = (props) => {
	return (
	<Events
		id={props?.id}
		heading={props?.heading}
		events={props?.events}
		locale={props?.locale}
	/>
)}

export default EventsConnector;
export { EventsConnector };
