import { Form, Input, Modal, Select, Upload, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { majors, QUERY_KEY } from "../../../../../utils/const";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { Term } from "../../../../../model/auth";
import { useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { teacherApi } from "../../../../../api/teacher/teacher";
interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AddTeacherModal = ({ isOpen, setIsOpen }: Props) => {
  const [form] = useForm();
  const [imageData, setImageData] = useState('');

  const handleCreateTeacher = () => {
    form.validateFields().then((values) => {
        teacherApi.createTeacher({
          name: values.name,
          phoneNumber: values.phoneNumber,
          email: values.email,
          profilePicture: imageData,
          salutation: values.salutation
        });
        setIsOpen(false)
        form.resetFields();
        setImageData('')
      }).catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  }
  const handleChange = (info) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(info.file.originFileObj); 
  };
  return (
    <Modal
      title="Add Teacher"
      onOk={handleCreateTeacher}
      open={isOpen}
      onCancel={() => {
        setIsOpen(false);
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className={styles.customForm}>
        <div className="flex justify-between gap-3 items-center">
          <FormItem
            className="flex-1"
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input size="middle" maxLength={50} showCount />
          </FormItem>
          <FormItem
            className="flex-1"
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Major is required",
              },
            ]}
          >
            <Input size="middle" maxLength={10} showCount />
          </FormItem>
        </div>
        <div className="flex justify-between gap-3 items-center">
          <FormItem
            className={classNames("flex-1")}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
            ]}
          >
            <Input size="middle" />
          </FormItem>
          <FormItem
            className={classNames("flex-1")}
            label="Salutation"
            name="salutation"
            rules={[
              {
                required: true,
                message: "salutation is required",
              },
            ]}
          >
            <Select
                size="middle">
                <Select.Option value="Mr.">Mr.</Select.Option>
                <Select.Option value="Mrs.">Mrs.</Select.Option>
            </Select>
          </FormItem>
        </div>
        <Form.Item label="Profile Picture" name="profilePicture">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Tải lên</Button>
          </Upload>
          {imageData && (
            <img 
              src={imageData} 
              alt="Xem trước" 
              style={{ maxWidth: '100px', height: 'auto', marginLeft: '10px' }} 
            />
          )}
        </div>
      </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddTeacherModal;
