import QueryWrapper from "@/components/QueryWrapper";
import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <QueryWrapper>
        <Component {...pageProps} />
      </QueryWrapper>
    </SessionProvider>
  );
}
