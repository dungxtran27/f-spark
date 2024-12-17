import { Badge, Modal, Popover, Spin, Table, Tabs, Tag } from "antd";
import { ModalProps } from "../../../../model/common";
import styles from "../styles.module.scss";
import classNames from "classnames";
import { AiTwotoneDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { manageClass } from "../../../../api/ManageClass/manageClass";
import { QUERY_KEY } from "../../../../utils/const";
import { Admin } from "../../../../api/manageAccoount";

const colorMajorGroup: { [key: string]: string } = {
  SE: "blue",
  HS: "green",
  GD: "red",
  IB: "purple",
};
interface Props extends ModalProps {
  excelData: any;
}
const ImportClassesModal = ({ isOpen, setIsOpen, excelData }: Props) => {
  const { data: studentData } = useQuery({
    queryKey: [QUERY_KEY.STUDENT_OF_TERM],
    queryFn: async () => {
      return Admin.getStudent({
        limit: 10000,
        page: 1,
        searchText: null,
        classId: null,
        // status: statusFilter || null,
      });
    },
  });
  const queryClient = useQueryClient();
  const [data, setData] = useState(excelData);
  const changes = data
    ?.map((s: any) => {
      // Assuming `s` from `data` has the same structure
      const matchingStudent = studentData?.data?.data?.students.find(
        (student: any) => student.studentId === s.studentId
      );

      if (matchingStudent) {
        return {
          studentId: s?.studentId,
          name: s?.name,
          major: s?.major,
          oldClass: matchingStudent?.classDetail?.classCode || null,
          newClass: s?.classCode || null,
        };
      }

      return null;
    })
    .filter((item: any) => item !== null && item?.oldClass !== item?.newClass);
  const [selectedRowKeys, setSelectedRowKeys] = useState(
    changes.map((change: any) => change.studentId)
  );
  useEffect(() => {
    if (excelData?.length > 0) {
      setData(excelData);
    }
  }, [excelData]);
  const col = [
    {
      title: "Class code",
      dataIndex: "classCode",
      key: "classCode",
    },
    {
      title: "Groups",
      render: (_: any, record: any) => <span>{record?.groups?.length}</span>,
    },
    {
      title: "Student",
      render: (_: any, record: any) => <span>{record?.students?.length}</span>,
    },
    {
      title: "Majors",
      render: (_: any, record: any) => {
        return record?.majors?.map((m: any) => (
          <Tag key={m} color={colorMajorGroup[m] || "default"}>
            {m}
          </Tag>
        ));
      },
    },
  ];

  const processStudents = () => {
    const initialClasses = excelData.reduce((acc: any, student: any) => {
      const { classCode } = student;

      // Initialize class entry if it doesn't already exist
      if (classCode && !acc[classCode]) {
        acc[classCode] = {
          classCode,
          students: [],
          majors: new Set(),
          groups: new Set(),
        };
      }

      return acc;
    }, {});
    // Grouping by class
    const groupedByClass = data.reduce((acc: any, student: any) => {
      const { classCode, name, major, studentId, group, email } = student;

      // Skip students without a class
      if (classCode) {
        if (!acc[classCode]) {
          acc[classCode] = {
            classCode,
            students: [],
            majors: new Set(), // To store unique majors
            groups: new Set(), // To store unique groups
          };
        }

        // Add student to the class
        acc[classCode].students.push({ studentId, name, group, email, major });

        // Add the major to the Set (ensures uniqueness)
        acc[classCode].majors.add(major);

        // If a student has a group, add it to the Set
        if (group) {
          acc[classCode].groups.add(group);
        }
      }

      return acc;
    }, initialClasses);

    // Mapping the grouped data into an array
    return Object.values(groupedByClass).map((classGroup: any) => ({
      classCode: classGroup.classCode,
      majors: Array.from(classGroup.majors), // Convert Set to array
      students: classGroup.students,
      groups: Array.from(classGroup.groups), // Convert Set to array
    }));
  };

  const mappedData = processStudents();

  const studentCol = [
    {
      title: "Student Id",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Majors",
      render: (_: any, record: any) => {
        return (
          <Tag color={colorMajorGroup[record?.major] || "default"}>
            {record?.major}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <AiTwotoneDelete
          size={20}
          className="cursor-pointer hover:text-red-500"
          onClick={() => {
            setData((prev: any) => {
              return prev.map((item: any) => {
                if (
                  item.studentId === record.studentId ||
                  (!!item?.group && item?.group === record?.group)
                ) {
                  return { ...item, classCode: null };
                }
                return item;
              });
            });
          }}
        />
      ),
    },
  ];

  const changesCol = [
    {
      title: "Student Id",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Major",
      render: (_: any, record: any) => {
        return (
          <Tag
            key={record?.major}
            color={colorMajorGroup[record?.major] || "default"}
          >
            {record?.major}
          </Tag>
        );
      },
    },
    {
      title: "Change",
      render: (_: any, record: any) => {
        return (
          <div className="flex items-center gap-3">
            <span
              className={`${
                !record?.oldClass ? "text-red-500" : ""
              } font-semibold`}
            >
              {record?.oldClass || "No Class"}
            </span>
            {" ->"}
            <span
              className={`${
                !record?.newClass ? "text-red-500" : ""
              } font-semibold`}
            >
              {record?.newClass || "No Class"}
            </span>
          </div>
        );
      },
    },
  ];
  const Students = ({ studentData }: { studentData: any }) => (
    <Table columns={studentCol} dataSource={studentData} pagination={false} />
  );
  const handleAssignClass = (record: any, classCode: string) => {
    setData((prev: any) => {
      return prev.map((item: any) => {
        if (
          item.studentId === record.studentId ||
          (!!item?.group && item?.group === record?.group)
        ) {
          return { ...item, classCode: classCode }; // Update classCode
        }
        return item;
      });
    });
  };
  const noClassStudents = data?.filter((s: any) => !s?.classCode);
  const noClassStudentCol = [
    {
      title: "Student Id",
      dataIndex: "studentId",
      key: "studentId",
      width: "25%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Major",
      render: (_: any, record: any) => {
        return (
          <Tag color={colorMajorGroup[record?.major] || "default"}>
            {record?.major}
          </Tag>
        );
      },
      width: "20%",
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Popover
          content={
            <Table
              className=" border border-primary/30 rounded w-[500px]"
              dataSource={mappedData}
              columns={col}
              pagination={false}
              scroll={{ y: 170 }}
              onRow={(classItem: any) => ({
                onClick: () => handleAssignClass(record, classItem?.classCode),
              })}
            />
          }
          title="Assign Class"
          trigger="click"
        >
          <CiEdit className="text-primaryBlue cursor-pointer" size={20} />
        </Popover>
      ),
      width: "20%",
    },
  ];
  const noClassGroupCol = [
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "",
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (_: any, record: any) => <span>{record?.members?.length}</span>,
    },
    {
      title: "Majors",
      render: (_: any, record: any) => {
        return record?.majors?.map((m: any) => (
          <Tag key={m} color={colorMajorGroup[m] || "default"}>
            {m}
          </Tag>
        ));
      },
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <CiEdit className="text-primaryBlue cursor-pointer" size={20} />
      ),
    },
  ];

  const getGroupedData = (students: any[]) => {
    const grouped = students.reduce((acc, student) => {
      const { group, major } = student;

      // Skip students with no group
      if (!group) return acc;

      // Check if the group already exists in the accumulator
      if (!acc[group]) {
        acc[group] = {
          groupName: group,
          members: [],
          majors: new Set(),
        };
      }

      // Add student to the group's members
      acc[group].members.push(student);

      // Add the majors to the set (to ensure no duplicates)
      acc[group].majors.add(major);

      return acc;
    }, {});

    // Convert the object into an array of groups
    return Object.values(grouped).map((group: any) => ({
      groupName: group.groupName,
      members: group.members, // All member information
      majors: Array.from(group.majors), // Convert Set to Array to avoid duplicates
    }));
  };
  const importClassData = useMutation({
    mutationFn: ({
      studentData,
      classData,
      unchecked,
    }: {
      studentData: any;
      classData: any;
      unchecked?: any;
    }) => {
      return manageClass.importClassData({
        studentData,
        classData,
        unchecked,
      });
    },
    onSuccess: () =>{
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.CLASSES]})
    }
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: any) => {
      setSelectedRowKeys(newSelectedRowKeys); // Update selected rows on change
    },
  };
  const noClassGroupedData = getGroupedData(noClassStudents);
  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      onOk={() => {
        importClassData.mutate({
          studentData: data,
          classData: [
            ...new Set(excelData.map((student: any) => student.classCode)),
          ],
          unchecked: changes
            .map((change: any) => change.studentId)
            .filter((s: any) =>
              selectedRowKeys?.some((r: any) => r === s?.studentId)
            ),
        });
        setIsOpen(false);
        setData([]);
      }}
      title={"Preview Import"}
      destroyOnClose
      width={1300}
      centered
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div
            className={classNames("flex flex-col w-7/12", styles.customTable)}
          >
            <h1 className="text-lg font-semibold">Generated Classes</h1>
            <Tabs
              items={[
                {
                  key: "Available",
                  label: (
                    <Badge
                      count={
                        mappedData?.filter((c: any) => c?.students?.length < 30)
                          ?.length
                      }
                    >
                      Available
                    </Badge>
                  ),
                  children: (
                    <Table
                      className=" border border-primary/30 rounded"
                      dataSource={mappedData?.filter(
                        (c: any) => c?.students?.length < 30
                      )}
                      columns={col}
                      pagination={false}
                      scroll={{ y: 230 }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div className="">
                            <h3 className="font-semibold">Students</h3>
                            <Students studentData={record?.students} />
                          </div>
                        ),
                      }}
                      rowKey={"classCode"}
                    />
                  ),
                },
                {
                  key: "Full",
                  label: (
                    <Badge
                      count={
                        mappedData?.filter((c: any) => c?.students?.length >= 30)
                          ?.length
                      }
                    >
                      Full
                    </Badge>
                  ),
                  children: (
                    <Table
                      className=" border border-primary/30 rounded"
                      dataSource={mappedData?.filter(
                        (c: any) => c?.students?.length >= 30
                      )}
                      columns={col}
                      pagination={false}
                      scroll={{ y: 230 }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div className="">
                            <h3 className="font-semibold">Students</h3>
                            <Students studentData={record?.students} />
                          </div>
                        ),
                      }}
                      rowKey={"classCode"}
                    />
                  ),
                },
              ]}
            />
          </div>
          <div
            className={classNames("flex flex-col w-5/12", styles.customTable)}
          >
            <h1 className="text-lg font-semibold">No Class</h1>
            <Tabs
              items={[
                {
                  key: "students",
                  label: (
                    <Badge
                      count={
                        noClassStudents?.filter((s: any) => !s?.group)?.length
                      }
                    >
                      Students
                    </Badge>
                  ),
                  children: (
                    <Table
                      className=" border border-primary/30 rounded"
                      columns={noClassStudentCol}
                      dataSource={noClassStudents?.filter(
                        (s: any) => !s?.group
                      )}
                      pagination={false}
                      scroll={{ y: 230 }}
                    />
                  ),
                },
                {
                  key: "groups",
                  label: (
                    <Badge count={noClassGroupedData?.length}>Groups</Badge>
                  ),
                  children: (
                    <Table
                      className=" border border-primary/30 rounded"
                      pagination={false}
                      columns={noClassGroupCol}
                      dataSource={noClassGroupedData}
                      scroll={{ y: 230 }}
                    />
                  ),
                },
              ]}
              defaultActiveKey="students"
            />
          </div>
        </div>

        <div className={classNames("flex flex-col", styles.customTable)}>
          <h1 className="text-lg font-semibold">Changes</h1>
          <Table
            className=" border border-primary/30 rounded"
            dataSource={changes}
            columns={changesCol}
            pagination={false}
            scroll={{ y: 230 }}
            rowSelection={rowSelection}
            rowKey={"studentId"}
          />
        </div>
        {importClassData?.isPending && <Spin fullscreen />}
      </div>
    </Modal>
  );
};

export default ImportClassesModal;
