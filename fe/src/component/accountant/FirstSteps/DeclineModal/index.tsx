import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

interface Props {
  updateRequest: any;
  requestId: string | null;
  setRequestId: (value: any) => void;
}
const DeclineModal = ({
  updateRequest,
  requestId,
  setRequestId,
}: Props) => {
  const [note, setNote] = useState("");
  return (
    <Modal
      open={!!requestId}
      onCancel={() => {
        setRequestId(null);
      }}
      title={"Decline Sponsorship request"}
      onOk={() => {
        updateRequest.mutate({
          requestIds: requestId,
          status: "declined",
          note: note,
        });
        setRequestId(null);
      }}
      destroyOnClose
    >
      <TextArea
        rows={6}
        placeholder="State the reason for this decline"
        onChange={(e) => setNote(e?.target?.value)}
      />
    </Modal>
  );
};
export default DeclineModal;
