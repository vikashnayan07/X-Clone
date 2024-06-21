import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="584104132587-lbh4orhf1sq1h5mgup569q73jg5iroi3.apps.googleusercontent.com">
          <Component {...pageProps} />
          <Toaster position="bottom-center" reverseOrder={false} />
          <ReactQueryDevtools />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </div>
  );
}
