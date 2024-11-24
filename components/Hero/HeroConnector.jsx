import { Hero } from "./Hero";
import { renderRichTextContent, renderEmbeddedEntryBlock } from "../../utils/RichText";

const HeroConnector = (props) => {
	return (
	<Hero
		id={props?.id}
		images={props?.images}
		locale={props?.locale}
		animationID={props?.animationID}
		content={renderRichTextContent(props?.content)}
		height={props?.height}
		imageAlignment={props?.imageAlignment}
	/>
)}

export default HeroConnector;
export { HeroConnector };
