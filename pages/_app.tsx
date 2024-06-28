import LayoutMain from "@/src/components/layout/layout";
import "./global.css";

import { AppProps } from "next/app";
import LayoutLogin from "@/src/components/layout/layout-login/layout-login";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router.pathname;

  // Conditionally render different layouts based on path
  const getLayout = () => {
    if (path === "/login") {
      return (
        <LayoutLogin>
          <Component {...pageProps} />
        </LayoutLogin>
      );
    } else {
      return (
        <LayoutMain>
          <Component {...pageProps} />
        </LayoutMain>
      );
    }
  };

  return <>{getLayout()}</>;
  return (
    <LayoutMain>
      <Component {...pageProps} />
    </LayoutMain>
  );
}

export default MyApp;
