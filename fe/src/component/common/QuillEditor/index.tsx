import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.scss";
interface Props {
  onChange: (value: any) => void;
  placeHolder?: string;
}
const QuillEditor = ({
  onChange,
  placeHolder = "Write something...",
}: Props) => {
  return (
    <div className={styles.customQuill}>
      <ReactQuill
        onChange={(e) => {
          onChange(e);
        }}
        placeholder={placeHolder}
      />
    </div>
  );
};
export default QuillEditor;
