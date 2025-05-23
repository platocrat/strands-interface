import {
  FC,
  useRef,
  Dispatch,
  useEffect,
  ReactNode,
  SetStateAction,
} from "react";

export type ModalProps = {
  children?: ReactNode;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const Modal: FC<ModalProps> = ({ children, setOpenModal }) => {
  const clickOutsideRef = useRef(null);

  useClickOutside(clickOutsideRef);

  function useClickOutside(ref: any) {
    useEffect(() => {
      function handleClickOutside(e: any) {
        if (ref.current && !ref.current.contains(e.target)) setOpenModal(false);
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <>
      {/**
       * @todo 1. Refactor `className`s so that this component can be
       *          generalized.
       *       2. Refactor how the modal is opened and closed so that we can
       *          animate the modal's CSS.
       */}
      <div style={{ zIndex: "1000" }} className="modal-section">
        <div className="modal-wrapper">
          <div className="modal">
            <div ref={clickOutsideRef} className="modal-inner-section">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
