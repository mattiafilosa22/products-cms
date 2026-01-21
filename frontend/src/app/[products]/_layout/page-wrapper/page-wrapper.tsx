"use client";

import style from "./page-wrapper.module.scss";
interface ContainerProps {
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
  actionButtons?: React.ReactNode[];
  isProfileHeader?: boolean;
}

const PageWrapper: React.FC<ContainerProps> = ({
  children,
  title,
  actionButton,
  actionButtons,
  isProfileHeader = false,
}) => {
  if (isProfileHeader) {
    return <div>{children}</div>;
  }

  return (
    <>
      <div className={`${style.pageHeader}`}>
        {title && <h1 className={style.title}>{title}</h1>}

        <div className={style.actionButtons}>
          {actionButton}
          {actionButtons}
        </div>
      </div>

      {children}
    </>
  );
};
export default PageWrapper;
