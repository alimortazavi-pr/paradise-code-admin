import type { AppProps } from "next/app";
import { useEffect } from "react";
import Router from "next/router";

//Next UI
import { NextUIProvider } from "@nextui-org/react";

//Redux
import { Provider } from "react-redux";
import store from "@/store";

//Progress bar
import NProgress from "nprogress";

//Transition
import { AnimatePresence, motion } from "framer-motion";

//Assets
import "@/assets/css/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "plyr-react/plyr.css";

//Components
import GlobalLayout from "@/components/GlobalLayout";

//Tools
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, []);
  return (
    <Provider store={store}>
      <NextUIProvider>
        <GlobalLayout>
          {/* <motion.div
            key={router.route}
            initial="initial"
            animate="animate"
            variants={{
              initial: {
                opacity: 0.5,
              },
              animate: {
                opacity: 1,
              },
            }}
          > */}
          <Component {...pageProps} />
          {/* </motion.div> */}
          <ToastContainer rtl draggablePercent={60} />
        </GlobalLayout>
      </NextUIProvider>
    </Provider>
  );
}

export default MyApp;
