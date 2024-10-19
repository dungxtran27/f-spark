import { Checkbox, Divider, Form, Modal, Tabs, TabsProps } from "antd";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { CiEdit } from "react-icons/ci";
import {
  DATE_FORMAT,
  TEACHER_OUTCOMES_MODAL_TYPES,
} from "../../../../utils/const";
import Submissions from "./Submissions";
import { useState } from "react";
import GradingSubmission from "./GradingSubmission";
const TeacherOutcomes = () => {
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    modalType: "",
  });
  const [form] = Form.useForm();
  const outcomesList = [
    {
      id: "0",
      title: "Outcome 1: Sample data",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur velit a orci efficitur dignissim. In lacinia velit eget diam gravida semper. Praesent nec mollis quam, a posuere massa. Nullam sagittis suscipit ante non fermentum. Praesent dapibus orci ac hendrerit eleifend. Aliquam molestie sapien nec turpis varius, sed porta nisl fermentum. Donec a ex est. Vestibulum eros lorem, laoreet in lacus ut, finibus bibendum est. Aenean ultrices lectus magna, eu tristique dui ullamcorper quis. Vivamus semper nisi velit, sit amet condimentum risus vestibulum sed. Praesent dui mauris, molestie porttitor euismod sed, gravida at libero.",
      GradingCriteria: [
        {
          _id: "670bb8274027e28e0d90d465",
          description: "Criteria 1",
        },
        {
          _id: "670bb85508b330ae5ec166cb",
          description: "Criteria 2",
        },
      ],
      startDate: "2024-09-01T12:34:56.789Z",
      dueDate: "2024-09-05T12:34:56.789Z",
      submissions: [
        {
          _id: "1",
          group: {
            _id: "1",
            name: "Trà thảo mộc T+",
            avatar:
              "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
          },
          score: 9,
          attachment:
            "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
          passedCriteria: ["670bb8274027e28e0d90d465"],
          createdAt: "2024-09-01T12:34:56.789Z",
        },
        {
          _id: "2",
          group: {
            _id: "2",
            name: "Ăn vặt kiểu Nhật - Maneki chan",
            avatar:
              "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
          },
          score: 9,
          attachment:
            "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
          passedCriteria: [],
          createdAt: "2024-09-01T12:34:56.789Z",
        },
      ],
    },
    {
      id: "1",
      title: "Outcome 2: Sample data",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur velit a orci efficitur dignissim. In lacinia velit eget diam gravida semper. Praesent nec mollis quam, a posuere massa. Nullam sagittis suscipit ante non fermentum. Praesent dapibus orci ac hendrerit eleifend. Aliquam molestie sapien nec turpis varius, sed porta nisl fermentum. Donec a ex est. Vestibulum eros lorem, laoreet in lacus ut, finibus bibendum est. Aenean ultrices lectus magna, eu tristique dui ullamcorper quis. Vivamus semper nisi velit, sit amet condimentum risus vestibulum sed. Praesent dui mauris, molestie porttitor euismod sed, gravida at libero.",
      GradingCriteria: [
        {
          _id: "670bb8274027e28e0d90d465",
          description: "Criteria 1",
        },
        {
          _id: "670bb85508b330ae5ec166cb",
          description: "Criteria 2",
        },
      ],
      startDate: "2024-10-01T12:34:56.789Z",
      dueDate: "2024-10-31T12:34:56.789Z",
      submissions: [
        {
          _id: "1",
          group: {
            _id: "1",
            name: "Trà thảo mộc T+",
            avatar:
              "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
          },
          score: 9,
          attachment:
            "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
          passedCriteria: ["670bb8274027e28e0d90d465"],
          createdAt: "2024-09-01T12:34:56.789Z",
        },
        // {
        //   _id: "2",
        //   group: {
        //     _id: "2",
        //     name: "Ăn vặt kiểu Nhật - Maneki chan",
        //     avatar:
        //       "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
        //   },
        //   attachment:
        //     "https://4kwallpapers.com/images/wallpapers/windows-11-stock-grey-abstract-dark-background-3840x2400-8957.png",
        //   passedCriteria: [],
        //   createdAt: "2024-09-01T12:34:56.789Z",
        // },
      ],
    },

    {
      id: "3",
      title: "Outcome 3: Sample data",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur velit a orci efficitur dignissim. In lacinia velit eget diam gravida semper. Praesent nec mollis quam, a posuere massa. Nullam sagittis suscipit ante non fermentum. Praesent dapibus orci ac hendrerit eleifend. Aliquam molestie sapien nec turpis varius, sed porta nisl fermentum. Donec a ex est. Vestibulum eros lorem, laoreet in lacus ut, finibus bibendum est. Aenean ultrices lectus magna, eu tristique dui ullamcorper quis. Vivamus semper nisi velit, sit amet condimentum risus vestibulum sed. Praesent dui mauris, molestie porttitor euismod sed, gravida at libero.",
      GradingCriteria: [
        {
          _id: "670bb8274027e28e0d90d465",
          description: "Criteria 1",
        },
        {
          _id: "670bb85508b330ae5ec166cb",
          description: "Criteria 2",
        },
      ],
      startDate: "2024-11-01T12:34:56.789Z",
      dueDate: "2024-11-31T12:34:56.789Z",
    },
  ];

  const outcomesTabs: TabsProps["items"] = outcomesList.map((o) => {
    return {
      key: o.id,
      label: `${o.title}${
        dayjs().isAfter(o.startDate) && dayjs().isBefore(o.dueDate)
          ? "(onngoing)"
          : ""
      }`,
      children: (
        <div className="w-full bg-white rounded-md p-5 min-h-[500px] mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[18px]">{o.title}</span>
              <CiEdit className="text-primaryBlue" size={23} />
            </div>
            <span className="font-medium text-[16px]">
              {dayjs(o?.startDate).format(DATE_FORMAT.withoutYear)} -{" "}
              {dayjs(o?.dueDate).format(DATE_FORMAT.withYear)}
            </span>
          </div>
          <div className="py-5 flex-col flex">
            <p className="mb-5">{o?.description}</p>
            <span className="font-medium text-[18px]">Grading Criteria</span>
            {o?.GradingCriteria?.length > 0 && (
              <div className="flex flex-col gap-2 p-3">
                {o?.GradingCriteria.map((gc: any) => (
                  <Checkbox key={gc._id} checked={true}>
                    {gc?.description}
                  </Checkbox>
                ))}
              </div>
            )}
            <Divider variant="dashed" style={{ borderColor: "black" }} dashed />
            <span className="font-medium text-[18px]">Submissions</span>
            <Submissions
              submissions={o?.submissions}
              gradingCriteria={o?.GradingCriteria}
              setOpenModal={setOpenModal}
            />
          </div>
        </div>
      ),
    };
  });
  return (
    <div className={styles.outcomes}>
      <Tabs
        items={outcomesTabs}
        tabPosition="left"
        defaultActiveKey={
          outcomesList.find(
            (o) => dayjs().isAfter(o.startDate) && dayjs().isBefore(o.dueDate)
          )?.id
        }
      />
      <Modal
        open={openModal.isOpen}
        title={
          openModal.modalType === TEACHER_OUTCOMES_MODAL_TYPES.grading ? (
            <span className="text-lg font-semibold">Grade submission</span>
          ) : (
            <span className="text-lg font-semibold">Grade submission</span>
          )
        }
        onOk={() => {
          setOpenModal({
            isOpen: false,
            modalType: "",
          });
        }}
        onCancel={() => {
          setOpenModal({
            isOpen: false,
            modalType: "",
          });
        }}
        destroyOnClose
      >
        {openModal.modalType === TEACHER_OUTCOMES_MODAL_TYPES.grading ? (
          <GradingSubmission form={form} />
        ) : (
          <>hehe</>
        )}
      </Modal>
    </div>
  );
};
export default TeacherOutcomes;
