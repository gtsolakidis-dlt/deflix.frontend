// ModalListener.tsx
import { AnimatePresence } from "framer-motion";
import { useModalData } from "../contexts/ModalContext";
import useMediaQuery from "../hooks/useMediaQuery";
import { movieGenreList } from "../lib/constants";
import ListModal from "./ListModal";
import DesktopInfoModal from "./DesktopInfoModal";
import MobileInfoModal from "./MobileInfoModal";

const ModalListener = () => {
  const modalData = useModalData();
  const tabletUp = useMediaQuery("tablet-up");
  let outlet: JSX.Element | null = null;

  if (modalData.visible) {
    switch (modalData.category) {
      case "list":
        outlet = <ListModal entries={[movieGenreList]} />;
        break;
      case "movie": {
        console.log(modalData.id);
        if (tabletUp) {
          outlet = (
            <DesktopInfoModal
              id={modalData.id}
              x={modalData.x!}
              y={modalData.y!}
              expanded={modalData.expanded}
            />
          );
        } else {
          outlet = <MobileInfoModal id={modalData.id} />;
        }
        break;
      }
      default:
        console.error(`Unknown modal type:`, modalData);
    }
  }

  return <AnimatePresence>{outlet}</AnimatePresence>;
};

export default ModalListener;
