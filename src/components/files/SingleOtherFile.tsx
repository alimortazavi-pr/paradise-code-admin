//Types
import { ISingleFile } from "@/ts/interfaces/layouts.interface";

//Tools
import axios from "axios";

//Components
import { Tooltip } from "@nextui-org/react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { CloseSquare, DocumentDownload, Link21 } from "iconsax-react";

type Props = {
  file: ISingleFile;
  destroyFile: any;
};
export default function SingleOtherFile({ file, destroyFile }: Props) {
  //Functions
  async function download() {
    axios
      .get(`http://localhost:7011/static${file.path}`)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.log(err));
  }

  function onCopyLink() {
    toast.success("لینک فایل با موفقیت کپی شد", {
      position: toast.POSITION.TOP_CENTER,
    });
  }

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 h-72 mb-4 border rounded-xl relative bg-white">
      <span
        className="absolute top-2 left-2 cursor-pointer z-10"
        onClick={() => destroyFile(file)}
      >
        <CloseSquare className="text-red-500" />
      </span>
      <div className="w-full h-full flex items-center justify-center flex-col">
        <h4 className="font-semibold ltr-important mb-3">{file.name}</h4>
        <div className="flex gap-2 items-center">
          <Tooltip content="دانلود فایل" color="primary">
            <DocumentDownload
              onClick={download}
              className="text-blue-500 cursor-pointer"
              size="30"
            />
          </Tooltip>
          <Tooltip content="کپی کردن لینک فایل" color="secondary">
            <CopyToClipboard
              onCopy={onCopyLink}
              text={`http://localhost:7011/static${file.path}`}
            >
              <Link21 className="text-purple-500 cursor-pointer" size="30" />
            </CopyToClipboard>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
