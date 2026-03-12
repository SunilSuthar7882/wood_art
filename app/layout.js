
import { Montserrat } from "next/font/google";
import ClientLayout from "./ClientLayout";
import ReactQueryProvider from "./ReactQueryProvider";
import "./global.css";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import Loading from "./loading";
import { Suspense } from "react";
import CustomCursor from "@/component/CustomComponents/CustomCursor";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Macros and meals",
  description: "Macros and meals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body suppressHydrationWarning={true}>
        {/* <CustomCursor/> */}
        <ReactQueryProvider>
          <SnackbarProvider>
            <Suspense fallback={<Loading />}>
              <ClientLayout>{children}</ClientLayout>
            </Suspense>
          </SnackbarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
