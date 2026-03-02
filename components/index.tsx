import { HeroConnector } from "./Hero";
import { ImageContentConnector } from "./ImageContent";
import { Contacts } from "./Contacts";
import { EventsConnector } from "./Events";
import { BandConnector } from "./Band";

// Map components which are dynamically resolved by content type in the CMS
export const componentMap = {
	hero: HeroConnector,
	imageContent: ImageContentConnector,
	contacts: Contacts,
	events: EventsConnector,
	band: BandConnector
};
