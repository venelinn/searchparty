import { Icon } from "../Icons/Icons";
import styles from "./Social.module.scss";


const Social = ({ items }) => {
	return (
		<div className={styles.social}>
			{items.map(item => {
				return (
					<a
						href={item.url}
						key={item.id}
						target={item.external ? "_blank" : undefined}
						rel={item.external ? "noopener noreferrer" : undefined}
						title={item.name}
					>
						<Icon size="1.5em" name={item.iconName} />
					</a>
				)
			})}
		</div>
	);
}

export default Social;
export { Social };
