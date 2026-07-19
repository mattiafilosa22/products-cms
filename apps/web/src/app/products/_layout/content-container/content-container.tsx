"use client";

import style from "./content-container.module.scss";

interface ContentContainerProps {
  children: React.ReactNode;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  return <div className={style.content}>{children}</div>;
};
export default ContentContainer;
