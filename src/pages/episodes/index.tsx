import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination } from "@nextui-org/react";

//Types
import { ISingleEpisode } from "@/ts/interfaces/episodes.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setEpisodes } from "@/store/episodes/actions";
import { getEpisodes } from "@/store/episodes/selectors";

//Tools
import api from "@/api";

//Components
import DeleteEpisodeModal from "@/components/episodes/DeleteEpisodeModal";
import { ArrowLeft2, Edit, Trash } from "iconsax-react";

type Props = {
  episodes: ISingleEpisode<{ title: string }>[];
  totalPages: number;
};
export default function Episodes({ episodes, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const episodesGlobal = useAppSelector(getEpisodes);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [episodeSelected, setEpisodeSelected] =
    useState<ISingleEpisode<{ title: string }>>();

  //Effects
  useEffect(() => {
    dispatch(setEpisodes(episodes));
  }, [episodes, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/episodes?page=${index}`);
  }

  function destroyEpisode(episode: ISingleEpisode<{ title: string }>) {
    setEpisodeSelected(episode);
    setVisibleModal(true);
  }

  return (
    <div>
      <div className="w-full lg:w-20">
        <Button
          shadow
          bordered
          ghost
          className="z-0 w-full"
          onClick={() => router.push("/episodes/create")}
        >
          ایجاد جلسه
        </Button>
      </div>
      <hr className="my-5" />
      <Table
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        selectionMode="none"
        className="z-0"
        aria-label="simple table"
      >
        <Table.Header>
          <Table.Column
            css={{
              borderRadius: "0 1rem 1rem 0",
              textAlign: "right",
              paddingRight: "12px",
            }}
          >
            ردیف
          </Table.Column>
          <Table.Column css={{ textAlign: "right", paddingRight: "12px" }}>
            عنوان
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>مدرس</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>دوره</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>وضعیت</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>رایگان</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>حذف شده</Table.Column>
          <Table.Column
            css={{ borderRadius: "1rem 0 0 1rem", textAlign: "right" }}
          >
            {" "}
            <span></span>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {episodesGlobal.map((episode) => (
            <Table.Row css={{ zIndex: "0" }} key={episode._id}>
              <Table.Cell>{episode.row}</Table.Cell>
              <Table.Cell>{episode.title}</Table.Cell>
              <Table.Cell>{episode.createdBy?.name}</Table.Cell>
              <Table.Cell>{episode.course?.title}</Table.Cell>
              <Table.Cell>
                {episode.status === 0 ? (
                  <span className="badge text-xs p-2 badge-warning">
                    پیش نویس
                  </span>
                ) : episode.status === 1 ? (
                  <span className="badge text-xs p-2 badge-info">
                    درحال ضبط
                  </span>
                ) : episode.status === 2 ? (
                  <span className="badge text-xs p-2 badge-success">
                    تمام شده
                  </span>
                ) : null}
              </Table.Cell>
              <Table.Cell>
                {episode.free ? (
                  <span className="badge text-xs p-2 badge-success">
                    رایگان
                  </span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">
                    رایگان نیست
                  </span>
                )}
              </Table.Cell>

              <Table.Cell>
                {episode.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!episode.deleted ? (
                    <div
                      onClick={() => destroyEpisode(episode)}
                      className="font-medium text-red-600 hover:underline ml-3 cursor-pointer"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 hover:underline ml-3 cursor-pointer"
                      onClick={() => destroyEpisode(episode)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/episodes/${episode.slug}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <Edit size="20" />
                    </Link>
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
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
      <DeleteEpisodeModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        episode={episodeSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let episodes: ISingleEpisode[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/episodes?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      episodes = response.data.episodes;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      episodes: episodes,
      totalPages: totalPages,
    },
  };
};
