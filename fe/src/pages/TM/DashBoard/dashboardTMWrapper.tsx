import React, { useRef,useEffect, useState } from "react";
import { ClockCircleOutlined } from '@ant-design/icons';
import {
  Select,
  Timeline,
  Modal,
  Button, 
  Input,
  Row, 
  Col, 
  Typography,
  Form,
  DatePicker
} from "antd";
import QuillEditor from "../../../component/common/QuillEditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../../utils/const";
import { Admin } from "../../../api/manageAccoount";
import dayjs from "dayjs";
import moment from "moment";
import { groupApi } from "../../../api/group/group";
import FormItem from "antd/es/form/FormItem";
import { term } from "../../../api/term/term";
const { Option } = Select;
const { Text, Title } = Typography;
const DashboardTMWrapper: React.FC = () => {
  const queryClient = useQueryClient();
  const [termFilter, setTermFilter] = useState<string | undefined>('674241ba21d3a593602e7994');
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(false)

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
    
      const handleDelete = async () => {
        const data = {
          termId: termFilter,
          timelineId: selectedItem._id
        }
        await term.deleteTimelineOfTerm(data)
        queryClient.invalidateQueries([QUERY_KEY.TERM_TIMELINE]);
        setIsOpenDelete(false)
      };
    
      const handleChange = () => {
        setStatusUpdate(true)
        form.setFieldsValue({
          title: selectedItem?.title,
          type: selectedItem?.type,
          description: selectedItem?.description,
          duration: [
            selectedItem?.startDate ? moment(selectedItem?.startDate) : null,
            selectedItem?.endDate ? moment(selectedItem?.endDate) : null
          ],
        });

        setIsModalOpen(true)

      };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const handleAccept = () => {
    setStatusUpdate(false)
    setIsModalOpen(true)
  };
  
  const handleOk = async () => {
    const { title, type, description, duration } = form.getFieldsValue(); 
    const data = {
      title,
      type,
      description,
      startDate: duration? duration[0] : null,
      endDate: duration ? duration[1] : null,
      termId: termFilter
    }
    if(!statusUpdate){
      await term.createTimelineOfTerm(data)
    }else{
      data.timelineId = selectedItem?._id
      await term.updateTimelineOfTerm(data)
    }
    queryClient.invalidateQueries([QUERY_KEY.TERM_TIMELINE]);
    form.resetFields()
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
    setIsOpenDelete(false)
  }

  return (
    <div className="mx-auto p-3">
        <FormItem className="w-1/6" name={"semester"} label={"Semester"}>
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
        <div style={{ display: "flex", flexDirection: "column", background: "white" }}>
        <Row
            justify="center"
            style={{
            height: "46px",
            marginTop: "10px"
            }}
        >
            <Title level={5} style={{ margin: 0 }}>Today: {formattedDate}</Title>
        </Row>
        <div style={{ flex: 1, display: "flex" }}>
            <Col span={12} style={{ padding: "8px" }}>
            <Timeline mode="left" items={timelineItems} />
            </Col>
            <Col span={2}>
                <Button onClick={handleAccept} type="primary" style={{ marginTop: 0 }}>+ Add</Button>
            </Col>
            <Col
            span={1}
            style={{
                borderLeft: "1px solid #d9d9d9",
                marginBottom: "2vh"
            }}
            />
            <Col span={9} style={{ paddingRight: "28px" }}>
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
                <Text style={{ marginBottom: "10px", display: "inline-block", color: "#333333" }}>
                    <b>Date:</b> {new Date(selectedItem?.endDate).toLocaleDateString('en-GB')}
                </Text>
                <div style={{ margin: 8, display: "flex", justifyContent: "flex-end"}}>
                    <Button onClick={() => handleChange()} style={{ marginRight: 8 }}>Change</Button>
                    <Button onClick={() => setIsOpenDelete(true)} danger>Delete</Button>
                </div>
                </div>
            </Col>
        </div>
        </div>
        
      <Modal title={!statusUpdate ? "Create Timeline" : "Change Timeline"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <div className="w-full mt-5 flex flex-col gap-3">
        <Form layout="vertical" form={form}>
          <Row gutter={16}> 
          <Col span={12}> 
            <FormItem
              name={"title"}
              label={"Title"}
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Title" size="large" />
            </FormItem>
          </Col>
          <Col span={12}> 
            <FormItem
              name={"type"}
              label={"Type"}
              rules={[{ required: true, message: "Type is required" }]}
            >
              <Input placeholder="Type" size="large" />
            </FormItem>
          </Col>
        </Row>
          <FormItem name={"description"} label={"Description"}>
            <Input.TextArea placeholder="Description" size="large" rows={4} />
          </FormItem>
            <FormItem name={"duration"} label={"Duration"}>
              <DatePicker.RangePicker
                className="w-full"
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                placeholder={["Start Date", "Due date"]}
              />
            </FormItem>
        </Form>
      </div>
      </Modal>
      <Modal title={"Confirm Delete Deadline"} open={isOpenDelete} onOk={handleDelete} onCancel={handleCancel}>
        <p>{"Are you sure you want to delete this timeline?"}</p>
      </Modal>
    </div>
  );
};

export default DashboardTMWrapper;
