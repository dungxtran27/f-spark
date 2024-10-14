import { Modal } from "antd";
import { Typography } from "antd";
const { Text } = Typography;
interface CommentModalProps {
  open: boolean;
  closeModal: () => void;
  comments: {
    avatar: string;
    date: string;
    content: string;
    username: string;
  }[];
}
const CommentModal: React.FC<CommentModalProps> = ({
  open,
  closeModal,
  comments,
}) => {
  const handleCancel = () => {
    closeModal();
  };

  return (
    <Modal title="Comment" open={open} onCancel={handleCancel}>
      {comments.map((c) => (
        <div className="stream_cmt_body pt-3">
          <div className="flex items-start">
            <img className="w-[35px] rounded-full" src={c.avatar} />
            <div className="ml-3">
              <div className="flex j">
                <div className="font-semibold">{c.username}</div>
                <Text
                  type="secondary"
                  className="stream_date text-[0.7rem] ml-2"
                >
                  {c.date}
                </Text>
              </div>
              <div className="text-sm">{c.content}</div>
            </div>
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default CommentModal;
