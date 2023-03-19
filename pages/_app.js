import QueryWrapper from "@/components/QueryWrapper";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <QueryWrapper>
        <Toaster />
        <Component {...pageProps} />
      </QueryWrapper>
    </SessionProvider>
  );
}
