import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef } from "react";

//Types
import { theAsidePropsType } from "@/ts/types/layouts.type";

//Redux
import { useAppDispatch } from "@/store/hooks";
import { logOut } from "@/store/auth/actions";

//Components
import {
  Book,
  BrifecaseTimer,
  Category,
  Gallery,
  Home,
  Logout,
  Messages1,
  Messages3,
  Note1,
  People,
  UserOctagon,
} from "iconsax-react";

export default function TheAside({
  isAsideOpen,
  setIsAsideOpen,
}: theAsidePropsType) {
  //Redux
  const dispatch = useAppDispatch();

  //Refs
  const aside = useRef<any>(null);

  //Next
  const router = useRouter();

  //Effects
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        aside.current &&
        !aside.current.contains(event.target) &&
        isAsideOpen
      ) {
        setIsAsideOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aside, isAsideOpen]);

  //Functions
  function toggleAside() {
    setIsAsideOpen(!isAsideOpen);
  }

  function logout() {
    dispatch(logOut());
    router.push("/auth");
  }

  return (
    <aside
      className={`fixed min-h-screen duration-500 ${
        isAsideOpen ? "right-2" : "-right-96"
      } z-[9999] duration-500 top-16 md:top-[70px]`}
      ref={aside}
    >
      <ul className="bg-white w-full h-[85vh] rounded-xl px-7 py-7 text-right overflow-y-auto">
        <Link onClick={() => setIsAsideOpen(false)} href={"/"}>
          <li className="font-semibold text-base p-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center ">
            <Home className="ml-2" size="18" />
            داشبورد
          </li>
        </Link>
        <Link onClick={() => setIsAsideOpen(false)} href={"/comments"}>
          <li
            className={`font-semibold text-base p-3 rounded-lg ${
              router.route.includes("comments")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <Messages3 className="ml-2" size={18} />
            نظرات
          </li>
        </Link>
        <Link onClick={() => setIsAsideOpen(false)} href={"/notifications"}>
          <li
            className={`font-semibold mb-3 text-base p-3 rounded-lg ${
              router.route.includes("notifications")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <Messages1 className="ml-2" size={18} />
            پیام ها
          </li>
        </Link>
        <hr className="my-3 bg-gray-200 h-[1px]" />
        <Link onClick={() => setIsAsideOpen(false)} href={"/users"}>
          <li
            className={`font-semibold mb-3 text-base p-3 rounded-lg ${
              router.route.includes("users")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <People className="ml-2" size="18" />
            کاربران
          </li>
        </Link>
        <Link onClick={() => setIsAsideOpen(false)} href={"/admins"}>
          <li
            className={`font-semibold text-base p-3 rounded-lg ${
              router.route.includes("admins")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <UserOctagon className="ml-2" size="18" />
            ادمین ها
          </li>
        </Link>
        <hr className="my-3 bg-gray-200 h-[1px]" />
        <Link onClick={() => setIsAsideOpen(false)} href={"/categories"}>
          <li
            className={`font-semibold text-base p-3 rounded-lg ${
              router.route.includes("categories")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <Category className="ml-2" size="18" />
            دسته بندی ها
          </li>
        </Link>
        <hr className="my-3 bg-gray-200 h-[1px]" />
        <Link onClick={() => setIsAsideOpen(false)} href={"/courses"}>
          <li
            className={`font-semibold mb-3 text-base p-3 rounded-lg ${
              router.route.includes("courses")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <Book className="ml-2" size="18" />
            دوره ها
          </li>
        </Link>
        <Link onClick={() => setIsAsideOpen(false)} href={"/episodes"}>
          <li
            className={`font-semibold mb-3 text-base p-3 rounded-lg ${
              router.route.includes("episodes")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <Note1 className="ml-2" size="18" />
            جلسات
          </li>
        </Link>
        <Link onClick={() => setIsAsideOpen(false)} href={"/learnings"}>
          <li
            className={`font-semibold text-base p-3 rounded-lg ${
              router.route.includes("learnings")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-700 duration-300 flex items-center `}
          >
            <BrifecaseTimer className="ml-2" size="18" />
            درحال یادگیری ها
          </li>
        </Link>
        <hr className="my-3 bg-gray-200 h-[1px]" />
        <Link onClick={() => setIsAsideOpen(false)} href={"/articles"}>
          <li
            className={`font-semibold mb-3 text-base p-3 rounded-lg ${
              router.route.includes("articles")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-800 duration-300 flex items-center `}
          >
            <Book className="ml-2" size="18" />
            مقالات
          </li>
        </Link>
        <hr className="my-3 bg-gray-200 h-[1px]" />
        <Link onClick={() => setIsAsideOpen(false)} href={"/files"}>
          <li
            className={`font-semibold mb-3 text-base p-3 rounded-lg ${
              router.route.includes("files")
                ? "text-gray-800 bg-gray-100"
                : "text-gray-500"
            } hover:bg-gray-100 hover:text-gray-800 duration-300 flex items-center `}
          >
            <Gallery className="ml-2" size="18" />
            فایل ها
          </li>
        </Link>
        <hr className="my-3 bg-gray-200 h-[1px]" />
        <li
          className={`font-semibold mb-3 text-base p-3 rounded-lg cursor-pointer text-red-500 hover:bg-red-100 hover:text-red-800 duration-300 flex items-center `}
          onClick={logout}
        >
          <Logout className="ml-2" size="18" />
          خروج
        </li>
      </ul>
    </aside>
  );
}
