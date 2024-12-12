import { Hero } from "./Hero";
import { renderRichTextContent } from "../../utils/RichText";

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
		anchorToNext={props?.anchorToNext}
	/>
)}

export default HeroConnector;
export { HeroConnector };
