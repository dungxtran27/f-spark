import { Button, Empty, Select } from "antd";
import { useState } from "react";
import CreateTermModal from "../../pdt/ManageTerm/CreateTermModal";
import { QUERY_KEY } from "../../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { term } from "../../../api/term/term";

const EmptyTerm = ({ setSemester }: { setSemester?: (value: any) => void }) => {
  const [createTerm, setCreateTerm] = useState(false);
  const { data: termData } = useQuery({
    queryKey: [QUERY_KEY.TERM],
    queryFn: () => {
      return term.getAllTermsToFilter();
    },
  });
  const termOptions = termData?.data?.data?.map((t: any) => {
    return {
      value: t?.termCode,
      label: t?.termCode,
    };
  });
  return (
    <Empty
      className="h-screen flex flex-col items-center justify-center"
      description={
        <div>
          <h1>No Active Term</h1>
          <div className="pt-3">
            <Button
              type="primary"
              onClick={() => {
                setCreateTerm(true);
              }}
            >
              Create new Term
            </Button>
            <div className="flex items-center gap-3 pt-3">
              <span>Or view older Term</span>
              <Select
                placeholder="Choose Term"
                showSearch
                options={termOptions}
                onChange={setSemester}
              />
            </div>
          </div>
          <CreateTermModal isOpen={createTerm} setIsOpen={setCreateTerm} />
        </div>
      }
    />
  );
};
export default EmptyTerm;
