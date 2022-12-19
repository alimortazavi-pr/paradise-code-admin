import { useState } from "react";
import { Button, Modal, Text, useModal } from "@nextui-org/react";

//Types
import { ISingleCourse } from "@/ts/interfaces/courses.interface";

//Types
import InfiniteScrollCourses from "@/components/episodes/InfiniteScrollCourses";

type Props = {
  courses: ISingleCourse[];
  form: any;
  setForm: any;
};
export default function CoursesListModal({ courses,form,setForm }: Props) {
  //Other hooks
  const { setVisible, bindings } = useModal();

  return (
    <div>
      <Button size="lg" className="w-full" onClick={() => setVisible(true)}>
        انتخاب دوره
      </Button>
      <Modal
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            انتخاب دوره
          </Text>
        </Modal.Header>
        <Modal.Body>
          <InfiniteScrollCourses
            courses={courses}
            form={form}
            setForm={setForm}
            setVisible={setVisible}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
