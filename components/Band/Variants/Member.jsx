import Image from "next/image";
import { getOptimizedImage } from "../../../utils/common";
import { useState } from "react";
import { renderRichTextContent } from "../../../utils/RichText";
import { Modal } from "../../Modal/Modal";
import { Heading } from "../../Headings";
import styles from "./Member.module.scss";

const Member = ({data, tabIndex, labels}) => {
	const { image, heading, content, role, active } = data;
	const [modalStates, setModalStates] = useState(false);
	const { url, width, height } = getOptimizedImage(image[0], 800, 100);

	const handleOpenModal = () => {
    setModalStates(true);
  };

  const handleCloseModal = () => {
    setModalStates(false);
  };

	return (
		<>
			<div
				className={styles.member}
				tabIndex={tabIndex + 1}
				 >
				<figure className={styles.member__figure}>
					<Image
						src={url}
						alt={image[0].alt}
						width={width}
						height={height}
						className={styles.member__image}
					/>
					<figcaption>
						<div className={styles.member__content}>
							<Heading
								size={heading.size}
								as={heading.as}
								className={styles.member__name}
								uppercase={false}
								>
								{heading.heading}
							</Heading>
							<span>{role}</span>
						</div>
					</figcaption>
				</figure>
				<a
					onClick={() => handleOpenModal(true)}
					className={styles.member__button}
				><span className="sr-only">{labels?.learnMore}</span></a>
			</div>
			<Modal isOpen={modalStates} onClose={() => handleCloseModal()}>
				<div className={styles.mleader}>
					<Image
						src={url}
						alt={image[0].alt}
						width={width}
						height={height}
						className={styles.member__image}
					/>
					<div>
						<Heading
							size="h1"
							as="div"
							className={styles.mleader__name}
						>
							{heading.heading}
						</Heading>
						<div className={styles.mleader__text}>
							{content && renderRichTextContent(content)}
						</div>
					</div>
				</div>
			</Modal>
		</>
  );
};

export default Member;
export { Member }
