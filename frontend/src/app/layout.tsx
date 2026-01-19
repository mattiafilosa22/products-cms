import { ToastContainer } from "react-toastify";
import "@/styles/main.scss";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="it">
      <body suppressHydrationWarning={true}>
          <ToastContainer
            position="top-center"
            theme="colored"
            autoClose={6000}
          />
          {children}
      </body>
    </html>
  );
}
