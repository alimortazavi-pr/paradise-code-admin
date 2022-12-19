import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { Button } from "@nextui-org/react";

//Types
import { ISingleUser } from "@/ts/interfaces/users.interface";
import { ICreateLearning } from "@/ts/interfaces/learnings.interface";

//Redux
import { useAppSelector } from "@/store/hooks";
import { getToken } from "@/store/auth/selectors";

//Tools
import api from "@/api";
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
  users: ISingleUser[];
  form: any;
  setForm: any;
};
export default function InfiniteScrollUsers({ users, form, setForm }: Props) {
  //Redux
  const adminToken = useAppSelector(getToken);

  //States
  const [userPage, setUserPage] = useState<number>(1);
  const [usersContainer, setUsersContainer] = useState<ISingleUser[]>(
    []
  );
  const [hasMore, setHasMore] = useState<boolean>(true);

  //Effects
  useEffect(() => {
    if (users.length <= 0) {
      setHasMore(false)
    }
    setUsersContainer(users as ISingleUser[]);
  }, [users]);

  //Functions
  async function getMoreUsers() {
    try {
      const res = await api.get(`/admin/variables/users?page=${userPage + 1}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.data.users.length === 0) {
        setHasMore(false);
      }
      setUsersContainer([...usersContainer, ...res.data.users]);
      setUserPage(userPage + 1);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  }

  function setUser(user: ICreateLearning["user"]) {
    setForm({
      ...form,
      user: user,
    });
  }

  return (
    <div
      className="h-52 w-full bg-gray-100 bg-opacity-20 mt-5 rounded-xl overflow-y-auto px-2"
      id="scrollableUsersContainer"
    >
      <InfiniteScroll
        dataLength={usersContainer.length}
        next={getMoreUsers}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableUsersContainer"
      >
        {usersContainer.map((user) => (
          <Button
            key={user._id}
            className="w-full my-2"
            bordered
            color={"secondary"}
            onClick={() =>
              setUser({
                _id: user._id as string,
                firstName: user.firstName,
                lastName: user.lastName,
                mobile: user.mobile,
              })
            }
          >
            {user.firstName} {user.lastName} - {user.mobile}
          </Button>
        ))}
      </InfiniteScroll>
    </div>
  );
}
