import { Events } from "./Events";

const EventsConnector = (props) => {
	return (
	<Events
		id={props?.id}
		heading={props?.heading}
		events={props?.events}
		columns={props?.columns}
		layout={props?.layout}
		locale={props?.locale}
	/>
)}

export default EventsConnector;
export { EventsConnector };
