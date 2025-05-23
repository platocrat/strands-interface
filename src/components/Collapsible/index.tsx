import { FC, ReactNode } from "react";

export type CustomizePanelProps = {
  index: number;
  children: ReactNode;
  _useCollapse: (index: number) => boolean;
};

const Collapsible: FC<CustomizePanelProps> = ({
  index,
  children,
  _useCollapse,
}) => {
  return (
    <>
      <div
        className={
          _useCollapse(index) ? "panel-collapse" : "panel-collapse panel-close"
        }
      >
        {children}
      </div>
    </>
  );
};

export default Collapsible;
