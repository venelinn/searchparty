import Instagram from "../Icons/Instagram";
import Facebook from "../Icons/Facebook";
import styles from "./Social.module.scss";
import YouTube from "../Icons/YouTube";

const iconComponents = {
  Instagram,
  YouTube,
	Facebook
};

const Social = ({ items }) => {
	return (
		<div className={styles.social}>
			{items.map(item => {
				const Icon = iconComponents[item.iconName];
				return (
					<a
						href={item.url}
						key={item.id}
						target={item.external ? "_blank" : undefined}
						rel={item.external ? "noopener noreferrer" : undefined}
						title={item.name}
					>
						<Icon />
					</a>
				)
			})}
		</div>
	);
}

export default Social;
export { Social };
