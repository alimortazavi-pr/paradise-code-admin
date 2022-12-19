import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination } from "@nextui-org/react";

//Types
import { ISingleArticle } from "@/ts/interfaces/articles.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setArticles } from "@/store/articles/actions";
import { getArticles } from "@/store/articles/selectors";

//Tools
import api from "@/api";

//Components
import DeleteArticleModal from "@/components/articles/DeleteArticleModal";
import { ArrowLeft2, Edit, Trash } from "iconsax-react";

type Props = {
  articles: ISingleArticle<{ title: string }>[];
  totalPages: number;
};
export default function Articles({ articles, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const articlesGlobal = useAppSelector(getArticles);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [articleSelected, setArticleSelected] =
    useState<ISingleArticle<{ title: string }>>();

  //Effects
  useEffect(() => {
    dispatch(setArticles(articles));
  }, [articles, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/articles?page=${index}`);
  }

  function destroyArticle(article: ISingleArticle<{ title: string }>) {
    setArticleSelected(article);
    setVisibleModal(true);
  }

  return (
    <div>
      <div className="w-full lg:w-20">
        <Link href={"/articles/create"}>
          <Button shadow bordered ghost className="z-0 w-full">
            ایجاد مقاله
          </Button>
        </Link>
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
            عنوان
          </Table.Column>
          <Table.Column css={{ textAlign: "right" }}>مدرس</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>دسته بندی</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>زمان خواندن</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>وضعیت</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>حذف شده</Table.Column>
          <Table.Column
            css={{ borderRadius: "1rem 0 0 1rem", textAlign: "right" }}
          >
            <span></span>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {articlesGlobal.map((article) => (
            <Table.Row css={{ zIndex: "0" }} key={article._id}>
              <Table.Cell>{article.title}</Table.Cell>
              <Table.Cell>{article.createdBy?.name}</Table.Cell>
              <Table.Cell>{article.category?.title}</Table.Cell>
              <Table.Cell>{article.readingTime}</Table.Cell>
              <Table.Cell>
                {article.status === 0 ? (
                  <span className="badge text-xs p-2 badge-warning">
                    پیش نویس
                  </span>
                ) : article.status === 1 ? (
                  <span className="badge text-xs p-2 badge-info">
                    درحال نوشتن
                  </span>
                ) : article.status === 2 ? (
                  <span className="badge text-xs p-2 badge-success">
                    منتشر شده
                  </span>
                ) : null}
              </Table.Cell>
              <Table.Cell>
                {article.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!article.deleted ? (
                    <div
                      onClick={() => destroyArticle(article)}
                      className="font-medium text-red-600 hover:underline ml-3 cursor-pointer"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 hover:underline ml-3 cursor-pointer"
                      onClick={() => destroyArticle(article)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/articles/${article.slug}`}
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
      <DeleteArticleModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        article={articleSelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let articles: ISingleArticle[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/articles?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      articles = response.data.articles;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      articles: articles,
      totalPages: totalPages,
    },
  };
};
