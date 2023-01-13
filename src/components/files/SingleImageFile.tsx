import Image from "next/image";

//Types
import { ISingleFile } from "@/ts/interfaces/layouts.interface";

//Components
import { CloseSquare } from "iconsax-react";

type Props = {
  file: ISingleFile;
  destroyFile: any;
};
export default function SingleImageFile({ file, destroyFile }: Props) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 h-72 mb-4 border rounded-xl relative">
      <span
        className="absolute top-2 left-2 cursor-pointer z-10"
        onClick={() => destroyFile(file)}
      >
        <CloseSquare className="text-red-500"/>
      </span>

      <div className="w-full h-full relative">
        <Image
          src={`https://api.alimortazavi.org/static${file.path}`}
          fill
          alt=""
          className="object-contain"
        />
      </div>
    </div>
  );
}
