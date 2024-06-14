import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Inter } from "next/font/google";
import  { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <GoogleOAuthProvider clientId="584104132587-lbh4orhf1sq1h5mgup569q73jg5iroi3.apps.googleusercontent.com">
      <Component {...pageProps} />
      <Toaster/>
      </GoogleOAuthProvider>
    </div>
  );
}
