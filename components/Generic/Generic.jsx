import Section from "../Section";
import { renderRichTextContent } from "../../utils/RichText"; // Import the renderRichTextContent function
import styles from "./Generic.module.scss";

const Generic = ({ heading, pageName, content }) => {
	const pageHeading = heading || {
		heading: pageName,
		as: "h1",
		size: "h1",
	};
	return (
		<Section
			heading={pageHeading}
			classNames={{
				main: styles.main,
			}}
		>
			{content && (
				<div className={styles.generic}>
					<div className={styles.generic__body}>{renderRichTextContent(content)}</div>
				</div>
			)}
		</Section>
	);
};

export default Generic;
export { Generic };
