import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.scss";
interface Props {
  onChange: (value: any) => void;
}
const QuillEditor = ({ onChange }: Props) => {
  return (
    <div className={styles.customQuill}>
      <ReactQuill
        onChange={(e) => {
          onChange(e);
        }}
        placeholder="Write something..."
      />
    </div>
  );
};
export default QuillEditor;
