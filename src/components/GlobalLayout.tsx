import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  didTryAutoLoginSelector,
  isAuthSelector,
} from "@/store/auth/selectors";
import { autoLogin } from "@/store/auth/actions";

//Tools
import Cookies from "js-cookie";
import { motion } from "framer-motion";

//Components
import TheAside from "@/components/layouts/TheAside";
import NavBar from "@/components/layouts/NavBar";

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //Redux
  const dispatch = useAppDispatch();
  const didTryAutoLogin = useAppSelector(didTryAutoLoginSelector);
  const isAuth = useAppSelector(isAuthSelector);

  //Next
  const router = useRouter();

  //States
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  //Effect
  useEffect(() => {
    if (!didTryAutoLogin) {
      try {
        dispatch(autoLogin());
      } catch (err: any) {
        router.push("/auth");
        console.log(err);
      }
    } else if (didTryAutoLogin && !isAuth) {
      router.push("/auth");
    }
  }, [dispatch, didTryAutoLogin]);

  return (
    <div>
      <Head>
        <title>ادمین | پارادایس کد</title>
      </Head>
      {!router.pathname.includes("/auth") ? (
        <div>
          <NavBar isAsideOpen={isAsideOpen} setIsAsideOpen={setIsAsideOpen} />
          <TheAside isAsideOpen={isAsideOpen} setIsAsideOpen={setIsAsideOpen} />
        </div>
      ) : null}
      <div className="min-h-screen relative mt-16 md:mt-[70px]">
        <div className={`px-4 lg:px-10 pt-10`}>
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
