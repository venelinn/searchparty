import { Hero } from "./Hero/Hero";
import { ImageContentConnector } from "./ImageContent";
import { Contacts } from "./Contacts";

// Map components which are dynamically resolved by content type in the CMS
export const componentMap = {
	hero: Hero,
	imageContent: ImageContentConnector,
	contacts: Contacts,
};
