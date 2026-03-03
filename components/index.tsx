import { CollectionConnector } from './Collection/';
import { ContactsConnector } from './Contacts';
import { HeroConnector } from './Hero';
import { ImageContentConnector } from './ImageContent';
import { SectionConnector } from './Section';

// Map components which are dynamically resolved by content type in the CMS
export const componentMap = {
  hero: HeroConnector,
  imageContent: ImageContentConnector,
  contacts: ContactsConnector,
  collection: CollectionConnector,
  section: SectionConnector,
};
