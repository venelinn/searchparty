import { useState } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
	TwitterShareButton,
  TwitterIcon,
	PinterestShareButton,
  PinterestIcon,
} from "next-share"
import ShareIcon from "../Icons/Share";
import styles from "./Share.module.scss";

const Share = ({url, title, facebook, twitter, pinterest}) => {
	const [shareVisible, setShareVisible] = useState(false);
	const toggleShare = () => {
    setShareVisible(!shareVisible);
  };
	return (
		<div className={styles.share}>
		<button onClick={toggleShare}><ShareIcon /></button>
		<div className={`${shareVisible ? "flex" : "hidden"} ${styles.share__list}`}>
			{facebook && (
				<FacebookShareButton
					url={url}
					quote={title}
				>
					<FacebookIcon size={30} round />
				</FacebookShareButton>
			)}
			{twitter && (
			<TwitterShareButton
				url={url}
				title={title}
			>
				<TwitterIcon size={30} round />
			</TwitterShareButton>
			)}
			{pinterest && (
				<PinterestShareButton
					url={url}
					media={title}
				>
					<PinterestIcon size={30} round />
				</PinterestShareButton>
				)}
		</div>
	</div>
	);
};

// TODO: props

export default Share;
export { Share };
