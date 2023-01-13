import Link from "next/link";

//Types
import { navBarPropsType } from "@/ts/types/layouts.type";

//Components
import { Input } from "@nextui-org/react";
import { More, More2, SearchNormal, User } from "iconsax-react";

export default function NavBar({
  isAsideOpen,
  setIsAsideOpen,
}: navBarPropsType) {
  return (
    <div className="md:p-2 fixed w-full top-0 z-[999]">
      <nav className="w-full min-h-8 px-3 py-2 bg-white bg-opacity-50 backdrop-blur shadow-sm md:rounded-md flex items-center justify-between gap-4">
        <div className="">
          {isAsideOpen ? (
            <More2
              variant="TwoTone"
              size="24"
              className="text-gray-800 cursor-pointer"
              onClick={() => setIsAsideOpen(false)}
            />
          ) : (
            <More
              variant="TwoTone"
              size="24"
              className="text-gray-800 rotate-90 cursor-pointer"
              onClick={() => setIsAsideOpen(true)}
            />
          )}
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full md:w-5/12 lg:w-4/12 xl:w-3/12">
            <Input
              type="text"
              placeholder="جستجو"
              contentRight={
                <div className="cursor-pointer ml-2">
                  <SearchNormal size="18" className="text-gray-800" />
                </div>
              }
              contentRightStyling={false}
              width="100%"
            />
          </div>
        </div>
        <div className="">
          <Link href={'/profile'}>
            <User
              variant="Bulk"
              size="22"
              className="text-gray-800 cursor-pointer"
            />
          </Link>
        </div>
      </nav>
    </div>
  );
}
