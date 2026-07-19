"use client";

import style from "./page-wrapper.module.scss";
interface ContainerProps {
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
  actionButtons?: React.ReactNode[];
  isProfileHeader?: boolean;
  backUrl?: string;
}

import { useRouter } from "next/navigation";
import { AppButton } from "mama";
import IconArrowLeft from "@/assets/icons/caret-left.svg";

const PageWrapper: React.FC<ContainerProps> = ({
  children,
  title,
  actionButton,
  actionButtons,
  isProfileHeader = false,
  backUrl,
}) => {
  const router = useRouter();

  if (isProfileHeader) {
    return <div>{children}</div>;
  }

  return (
    <>
      <div className={`${style.pageHeader}`}>
        <div className="d-flex align-items-center gap-3">
          {backUrl && (
            <AppButton
              variant="custom"
              className={style.backButton}
              onClick={() => router.push(backUrl)}
              icon={IconArrowLeft}
              size="icon"
            />
          )}
          {title && <h1 className={style.title}>{title}</h1>}
        </div>

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
