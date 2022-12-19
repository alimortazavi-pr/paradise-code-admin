import { GetServerSideProps } from "next";
import { Button, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

//Types
import { ISingleFile } from "@/ts/interfaces/layouts.interface";

//Redux
import { setFiles } from "@/store/layouts/actions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getFiles } from "@/store/layouts/selectors";

//Tools
import api from "@/api";

//Components
import UploadFileModal from "@/components/files/UploadFileModal";
import DeleteFileModal from "@/components/files/DeleteFileModal";
import SingleImageFile from "@/components/files/SingleImageFile";
import SingleVideoFile from "@/components/files/SingleVideoFile";
import SingleOtherFile from "@/components/files/SingleOtherFile";

type Props = {
  files: ISingleFile[];
  totalPages: number;
};
export default function Files({ files, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const globalFiles = useAppSelector(getFiles);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDeleteModal, setDeleteVisibleModal] = useState(false);
  const [fileSelected, setFileSelected] = useState<ISingleFile>();

  //Effects
  useEffect(() => {
    dispatch(setFiles(files));
  }, [files, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/categories?page=${index}`);
  }

  function destroyFile(file: ISingleFile) {
    setFileSelected(file);
    setDeleteVisibleModal(true);
  }

  return (
    <div className="min-h-screen   mb-5 rounded-xl">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 mb-5">
          <Button className="" onClick={() => setVisibleModal(true)}>
            فایل جدید
          </Button>
        </div>
        {globalFiles.map((file,i) =>
          file.type === "image" ? (
            <SingleImageFile file={file} destroyFile={destroyFile} key={i} />
          ) : file.type === "video" ? (
            <SingleVideoFile file={file} destroyFile={destroyFile} key={i} />
          ) : (
            <SingleOtherFile file={file} destroyFile={destroyFile} key={i} />
          )
        )}
      </div>
      {files && files.length !== 0 ? (
        <div className="ltr-important flex justify-center w-full mt-5">
          <Pagination
            shadow
            color={"default"}
            initialPage={
              router.query.page ? parseInt(router.query.page as string) : 1
            }
            total={totalPages}
                      onChange={changePage}
          hidden={totalPages < 1}
          />
        </div>
      ) : null}
      <UploadFileModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
      />
      <DeleteFileModal
        visibleModal={visibleDeleteModal}
        setVisibleModal={setDeleteVisibleModal}
        file={fileSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let files = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/files?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      files = response.data.files;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      files: files,
      totalPages: totalPages,
    },
  };
};
