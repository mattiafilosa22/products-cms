import { ToastContainer } from "react-toastify";
import "@/styles/main.scss";
import styles from "./layout.module.scss";
import ContentContainer from "./[products]/_layout/content-container/content-container";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="it">
      <body suppressHydrationWarning={true} className={styles.body}>
        <>
          <ToastContainer
            position="top-center"
            theme="colored"
            autoClose={6000}
          />
          <ContentContainer>{children}</ContentContainer>
        </>
      </body>
    </html>
  );
}
