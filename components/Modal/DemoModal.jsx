import { useState, useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import cx from "classnames";
import useLockedScroll from "../../hooks/useLockedScroll";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import useReduceMotion from "../../hooks/useReduceMotion";
import Modal from "./Modal";
import styles from "./DemoModal.module.scss";

export default function useDemoModal() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [locked, setLocked] = useLockedScroll(false);

  const setModal = useCallback(
    state => {
      setShowDemoModal(state);
      setLocked(state);
    },
    [setShowDemoModal, setLocked]
  );

  const DemoModalCallback = useCallback(
    ({ title, content, contentComponent }) => {
      return (
        <DemoModal
          title={title}
          content={content}
					contentComponent={contentComponent}
          showDemoModal={showDemoModal}
          setModal={setModal}
        />
      );
    },
    [showDemoModal, setModal]
  );

  return useMemo(
    () => ({
      setModal,
      DemoModal: DemoModalCallback,
    }),
    [setModal, DemoModalCallback]
  );
}

function DemoModal({ content,  contentComponent, showDemoModal, setModal }) {
  const modalRef = useRef();
  const timeline = useRef();
	const reduceMotion = useReduceMotion();

  useIsomorphicLayoutEffect(() => {
    if (!showDemoModal) {
      return;
    }

    const ctx = gsap.context(() => {
      timeline.current = gsap
        .timeline({
          defaults: {
            ease: "power4.out",
          },
        })
        .to(modalRef.current, {
          opacity: 1,
          pointerEvents: "all",
          duration: reduceMotion ? 0 : 0.5,
        })
        .to("[data-modal]", {
          opacity: 1,
          scaleY: 0.01,
          x: 1,
          duration: reduceMotion ? 0 : 0.35,
        })
        .to("[data-modal]", {
          scaleY: 1,
          duration: reduceMotion ? 0 : 0.35,
        })
        .to("[data-modal-content]", {
          opacity: 1,
          duration: reduceMotion ? 0 : 0.35,
        })
        .to("[data-modal-close]", {
          opacity: 1,
          scale: 1,
          duration: reduceMotion ? 0 : 0.2,
        })
        .reverse();
    }, modalRef);

    return () => ctx.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    timeline.current?.reversed(!showDemoModal);
  }, []);
  return (
    <Modal showModal={showDemoModal} setModal={setModal} ref={modalRef}>
      <div
				className={cx(styles.modal, {
					[styles[content?.variant]]: content?.variant,
				})}
				data-modal>
        <button
          className={styles.modal__close}
          onClick={() => setModal(false)}
          data-modal-close
        />

				<div
					className={cx(styles.modal__inner, {
						[styles[`${content?.variant}__inner`]]: content?.variant,
					})}
					data-modal-content
					>
					{contentComponent}
				</div>
      </div>
    </Modal>
  );
}
