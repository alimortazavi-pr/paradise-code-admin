import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Table, Pagination } from "@nextui-org/react";

//Types
import { ISingleCategory } from "@/ts/interfaces/categories.interface";

//Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategories } from "@/store/categories/actions";
import { getCategories } from "@/store/categories/selectors";

//Tools
import api from "@/api";

//Components
import DeleteCategoryModal from "@/components/categories/DeleteCategoryModal";
import { ArrowLeft2, Edit, Trash } from "iconsax-react";

type Props = {
  categories: ISingleCategory<{ title: string }>[];
  totalPages: number;
};
export default function Categories({ categories, totalPages }: Props) {
  //Redux
  const dispatch = useAppDispatch();
  const categoriesGlobal = useAppSelector(getCategories);

  //Next
  const router = useRouter();

  //States
  const [visibleModal, setVisibleModal] = useState(false);
  const [categorySelected, setCategorySelected] =
    useState<ISingleCategory<{ title: string }>>();

  //Effects
  useEffect(() => {
    dispatch(setCategories(categories));
  }, [categories, dispatch, router.query]);

  //Functions
  function changePage(index: number) {
    router.push(`/categories?page=${index}`);
  }

  function destroyCategory(category: ISingleCategory<{ title: string }>) {
    setCategorySelected(category);
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
          onClick={() => router.push("/categories/create")}
        >
          ایجاد دسته بندی
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
            عنوان
          </Table.Column>
          {/* <Table.Column className="text-right">مدرس</Table.Column> */}
          <Table.Column css={{ textAlign: "right" }}>دسته بندی</Table.Column>
          <Table.Column css={{ textAlign: "right" }}>حذف شده</Table.Column>
          <Table.Column
            css={{ borderRadius: "1rem 0 0 1rem", textAlign: "right" }}
          >
            <span></span>
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {categoriesGlobal.map((category) => (
            <Table.Row css={{ zIndex: "0" }} key={category._id}>
              <Table.Cell>{category.title}</Table.Cell>
              {/* <Table.Cell>{category.createdBy?.name}</Table.Cell> */}
              <Table.Cell>{category.grandParent?.title}</Table.Cell>
              <Table.Cell>
                {category.deleted ? (
                  <span className="badge text-xs p-2 badge-error">حذف شده</span>
                ) : (
                  <span className="badge text-xs p-2 badge-info">حذف نشده</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex">
                  {!category.deleted ? (
                    <div
                      onClick={() => destroyCategory(category)}
                      className="font-medium text-red-600 hover:underline ml-3 cursor-pointer"
                    >
                      <Trash size="20" />
                    </div>
                  ) : (
                    <div
                      className="font-medium text-amber-500 hover:underline ml-3 cursor-pointer"
                      onClick={() => destroyCategory(category)}
                    >
                      <ArrowLeft2 size="20" />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/categories/${category.slug}`}
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
      <DeleteCategoryModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        category={categorySelected}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  let categories: ISingleCategory[] = [];
  let totalPages: number = 0;
  try {
    if (req.cookies.adminAuthorization) {
      const transformedData = JSON.parse(req.cookies.adminAuthorization);
      const page = query.page || 1;
      const response = await api.get(`/admin/categories?page=${page}`, {
        headers: {
          Authorization: `Bearer ${transformedData.token}`,
        },
      });
      categories = response.data.categories;
      totalPages = response.data.totalPages;
    }
  } catch (error: any) {
    console.log(error.response?.data);
  }

  return {
    props: {
      categories: categories,
      totalPages: totalPages,
    },
  };
};
