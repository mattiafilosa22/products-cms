import { ToastContainer } from "react-toastify";
import "@/styles/main.scss";
import styles from "./layout.module.scss";
import ContentContainer from "./products/_layout/content-container/content-container";
import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body
        suppressHydrationWarning={true}
        className={`${styles.body} ${GeistSans.className} ${GeistMono.className}`}
      >
        <Providers>
          <ToastContainer
            position="top-center"
            theme="colored"
            autoClose={6000}
          />
          <ContentContainer>{children}</ContentContainer>
        </Providers>
      </body>
    </html>
  );
}
