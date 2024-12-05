import React, { useRef,useEffect, useState } from "react";
import { ClockCircleOutlined } from '@ant-design/icons';
import {
  Select,
  Timeline,
  Steps,
  Row, 
  Col, 
  Typography,
  Form,
  Button,
  Modal,
  Input,
  Popover
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { Admin } from "../../../api/manageAccoount";
import dayjs from "dayjs";
import moment from "moment";
import { groupApi } from "../../../api/group/group";
import FormItem from "antd/es/form/FormItem";
import { term } from "../../../api/term/term";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CiCircleMinus, CiCirclePlus  } from "react-icons/ci";
import { outcomeApi } from "../../../api/outcome";
const { Option } = Select;
const { Text, Title } = Typography;
const DashboardTMWrapper: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(false)
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;
  const defaultTerm = activeTerm?._id;
  const [termFilter, setTermFilter] = useState<string | undefined>(defaultTerm);
  const [titleNew, setTitleNew] = useState('')
  const { data: termTimeline, isSuccess } = useQuery({
    queryKey: [
      QUERY_KEY.TERM_TIMELINE,
      termFilter
    ],
    queryFn: async () => {
      return term.getTimelineOfTerm(termFilter);
    },
  });

  useEffect(() => {
    if (isSuccess && termTimeline?.data) {
      const currentDate = new Date(); 
      const foundItem = termTimeline?.data?.data.find((item) => {
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        return currentDate >= startDate && currentDate <= endDate;
      });
      if (foundItem) {
        setSelectedItem(foundItem);
      }else {
        setSelectedItem(termTimeline?.data?.data[0]);
      }
    }
  }, [termTimeline, isSuccess]);

    const { data: terms } = useQuery({
      queryKey: [QUERY_KEY.TERM_LIST],
      queryFn: async () => {
        return Admin.getAllTerms();
      },
    });

    const { data: outcomes, isLoading } = useQuery({
      queryKey: [QUERY_KEY.All_OUTCOMES],
      queryFn: async () => {
        return outcomeApi.getAllOutcome();
      },
    });
    useEffect(() => {
      if (outcomes?.data.data) {
        setTitleNew(`Outcome ${outcomes?.data.data.length + 1}`);
      }
    }, [isLoading, outcomes]);

    const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
    const handleOpenChange = (open, index) => {
      if (open) {
        setOpenPopoverIndex(index); // Mở Popover tại index cụ thể
      } else {
        setOpenPopoverIndex(null); // Đóng Popover
      }
    };
    
    const handleDelete = async (outcomeId) => {
      await outcomeApi.deleteOutcome(outcomeId)
      queryClient.invalidateQueries([QUERY_KEY.TERM_TIMELINE]);
    };
    const daysPerStep = outcomes?.data?.data.length > 0 ? 90 / outcomes?.data?.data.length : 0;
    const steps = outcomes?.data?.data.map((item,index) => ({
      title: (
        <Popover
          content={
            <div className="w-80">
              <p>
                <strong>Title:</strong> {item.title}
              </p>
              <p className="mt-1 block">
                <strong>Description:</strong> {item.description}
              </p>
              {item.GradingCriteria && (
                <div>
                  <strong className="mt-1 block">Grading Criteria:</strong>
                  <ul>
                    {item.GradingCriteria.map((criteria, idx) => (
                      <li key={idx}>{criteria.description}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 mt-3 justify-end">
                <Button type="primary" onClick={() => console.log("Change:", item)}>
                  Change
                </Button>
                <Button onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </div>
            </div>
          }
          title={`Details ${item.title}`}
          trigger="click"
          open={openPopoverIndex === index} 
          onOpenChange={(open) => handleOpenChange(open, index)} 
        >
          <span style={{ cursor: "pointer" }}>{item.title}</span>
        </Popover>
      ),
      status: "process",
      subTitle: `Duration: ${Math.ceil(daysPerStep)} days`,
      description:
        item.description.length > 50
          ? item.description.substring(0, 50) + "..."
          : item.description,
    })) || [];


    const termOptions = terms?.data?.data?.map((t: any) => ({
      value: t?._id,
      label: t?.termCode,
    })) || [];

    const today = new Date();
    const timelineItems = termTimeline?.data?.data.map((item) => {
      const startDate = new Date(item?.startDate);
      const endDate = new Date(item?.endDate);
      const timeDifference = Math.floor((endDate - today) / (1000 * 60 * 60 * 24)); 
      const isRunning = today >= startDate && today <= endDate;
      const isPast = today > endDate; 
      let dot;
      if (isRunning) {
        if (timeDifference <= 1) {
          dot = <ClockCircleOutlined className="text-red-500 text-lg" />;
        } else {
          dot = <ClockCircleOutlined className="text-blue-500 text-lg" />
        }
      } else if (isPast) {
        dot = <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />;
      } else {
        dot = <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />;
      }
      const isSelected = selectedItem?.title === item?.title;
      return {
        label: `${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}`,
        children: (
          <div onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
            <Text className={`${isSelected ? 'text-purple-700 text-sm' : 'text-sm'}`} strong>{item?.title}</Text>
          </div>
        ),
        dot: dot,
      };
    }) || [];
    const formattedDate = today.toLocaleDateString('en-GB');
    
    const [form] = Form.useForm();

    const handleItemClick = (item) => {
        setSelectedItem(item);
      };

      // const handleChange = () => {
      //   setStatusUpdate(true)
      //   form.setFieldsValue({
      //     title: selectedItem?.title,
      //     type: selectedItem?.type,
      //     description: selectedItem?.description,
      //     duration: [
      //       selectedItem?.startDate ? moment(selectedItem?.startDate) : null,
      //       selectedItem?.endDate ? moment(selectedItem?.endDate) : null
      //     ],
      //   });

      //   setIsModalOpen(true)

      // };
  const [gradingCriteria, setGradingCriteria] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isOpenDelete, setIsOpenDelete] = useState(false);
  const handleAccept = () => {
    setStatusUpdate(false)
    setIsModalOpen(true)
    form.setFieldsValue({
      title: titleNew,
    });
  };
  
  steps.push({
    title: 'Create Outcome',
    status: 'wait',
    icon: <CiCirclePlus style={{ fontSize: '36px', cursor: 'pointer' }} onClick={handleAccept} />,
  });
  
  const handleOk = async () => {
    const { title, description } = form.getFieldsValue(); 
    const data = {
      title,
      description,
      gradingCriteria
    }
    if(!statusUpdate){
      await outcomeApi.createOutcome(data)
    }else{
      // data.timelineId = selectedItem?._id
      // await term.updateTimelineOfTerm(data)
    }
    form.resetFields()
    setGradingCriteria([''])
    setIsModalOpen(false)
    queryClient.invalidateQueries([QUERY_KEY.All_OUTCOMES]); 
  }

  const handleCancel = () => {
    // form.resetFields()
    setIsModalOpen(false)
    // setIsOpenDelete(false)
  }
  const addGradingCriteria = () => {
    setGradingCriteria([...gradingCriteria, '']);
  };
  const updateGradingCriteria = (index, value) => {
    const updatedCriteria = [...gradingCriteria];
    updatedCriteria[index] = value;
    setGradingCriteria(updatedCriteria);
  };

  const removeGradingCriteria = (index) => {
    const updatedCriteria = gradingCriteria.filter((_, i) => i !== index);
    setGradingCriteria(updatedCriteria);
  };
  return (
    <div className="mx-auto p-3">
        <div style={{ display: "flex", flexDirection: "column", background: "white" }}>
        <FormItem className="w-1/6 font-semibold p-3 pb-0" name={"semester"} label={"Semester"}>
        {terms?.data?.data && (
        <Select
          placeholder="Term"
          value={termFilter}
          onChange={setTermFilter}
          options={termOptions}
          defaultValue={`${
            terms?.data?.data?.find(
              (t: any) =>
                dayjs().isAfter(t?.startTime) &&
                dayjs().isBefore(t?.endTime)
            )?._id
          }`}
        />
        )}
        </FormItem>
        <Row
            justify="center"
            style={{
            height: "40px",
            }}
        >
            <Title level={5} style={{ margin: 0 }}>Today: {formattedDate}</Title>
        </Row>
        <div style={{ flex: 1, display: "flex" }}>
            <Col span={13} style={{ padding: "8px" }}>
            <Timeline mode="left" items={timelineItems} />
            </Col>
            <Col
            span={1}
            style={{
                borderLeft: "1px solid #d9d9d9",
                marginBottom: "2vh"
            }}
            />
            <Col span={10} style={{ paddingRight: "28px" }}>
                <div>
                <Text style={{ marginBottom: "10px", display: "inline-block", color: "#333333" }}>
                    <b>Title: {selectedItem?.title}</b>
                </Text>
                <br className="block h-6"/>
                <Text style={{ marginBottom: "10px", display: "inline-block"}}>
                    <b>Type:</b> {selectedItem?.type}
                </Text>
                <br />
                <Text style={{ marginBottom: "10px", display: "inline-block"}}>
                    <b>Description:</b> {selectedItem?.description}
                </Text>
                <br />
                <Text style={{display: "inline-block", color: "#333333" }}>
                    <b>Date:</b> {new Date(selectedItem?.endDate).toLocaleDateString('en-GB')}
                </Text>
                {/* <div style={{ margin: 8, display: "flex", justifyContent: "flex-end"}}>
                    <Button onClick={() => handleChange()} style={{ marginRight: 8 }}>Change</Button>
                    <Button onClick={() => setIsOpenDelete(true)} danger>Delete</Button>
                </div> */}
                </div>
            </Col>
        </div>
        </div>
        <div className="bg-white mt-3 p-3">
        <span className="font-semibold">Update timeline for next term</span>
        <div className="flex items-center justify-center p-10">
        <Steps items={steps} />
        </div>
        </div>
      <Modal title={!statusUpdate ? "Create Outcome" : "Change Outcome"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <div className="w-full mt-5 flex flex-col gap-3">
        <Form layout="vertical" form={form}>
          <Col span={24}> 
            <FormItem
              name={"title"}
              label={"Title"}
              rules={[{ required: true, message: "Title is required" }]}
              // initialValue={!statusUpdate ? titleNew : undefined}
            >
              <Input placeholder="Title" size="large" disabled={!statusUpdate}/>
            </FormItem>
          </Col>
          <FormItem name={"description"} label={"Description"} rules={[{ required: true, message: "Description is required" }]}>
            <Input.TextArea placeholder="Description" size="large" rows={4} />
          </FormItem>
          <div className="mt-4">
            <label className="font-semibold mb-2 block">Grading Criteria</label>
            {gradingCriteria.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <Input
                  placeholder="Enter Grading Criteria"
                  size="large"
                  value={item}
                  onChange={(e) => updateGradingCriteria(index, e.target.value)}
                />
                {gradingCriteria.length > 1 && (
                  <Button
                    icon={<CiCircleMinus className="text-xl"/>}
                    type="text"
                    danger
                    onClick={() => removeGradingCriteria(index)}
                  />
                )}
              </div>
            ))}
            <Button
              type="dashed"
              icon={<CiCirclePlus className="text-xl"/>}
              onClick={addGradingCriteria}
              className="mt-2"
            >
              Add Grading Criteria
            </Button>
          </div>
        </Form>
      </div>
      </Modal>
      {/* <Modal title={"Confirm Delete Deadline"} open={isOpenDelete} onOk={handleDelete} onCancel={handleCancel}>
        <p>{"Are you sure you want to delete this timeline?"}</p>
      </Modal> */}
    </div>
  );
};

export default DashboardTMWrapper;
