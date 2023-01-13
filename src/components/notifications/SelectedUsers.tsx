import { Button } from "@nextui-org/react";

//Types
import { selectedUsersPropsType } from "@/ts/types/notifications.type";
import { ISingleUserForCreateNotification } from "@/ts/interfaces/notifications.interface";

//Tools
import { Trash } from "iconsax-react";

export default function SelectedUsers({
  form,
  setForm,
}: selectedUsersPropsType) {
  //Functions
  function removeUser(user: ISingleUserForCreateNotification) {
    setForm({
      ...form,
      users: form.users.filter((u) => u._id !== user._id),
    });
  }

  return (
    <div className="h-max md:h-52 w-full bg-gray-100 bg-opacity-20 mt-5 rounded-xl overflow-y-auto px-2">
      {form.users.map((user) => (
        <Button
          key={user._id}
          className="w-full my-2"
          bordered
          color={"gradient"}
          icon={<Trash size="18" className="text-red-500" />}
          onClick={() => removeUser(user)}
        >
          {user.firstName} {user.lastName} - {user.mobile}
        </Button>
      ))}
    </div>
  );
}
