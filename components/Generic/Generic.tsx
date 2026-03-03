import { Section } from "../Section";
import { renderRichTextContent } from "../../utils/RichText";
import styles from "./Generic.module.scss";

interface GenericProps {
  heading?: any;
  pageName?: string;
  content?: any;
}

const Generic = ({ heading, pageName, content }: GenericProps) => {
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
