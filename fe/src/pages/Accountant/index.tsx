import { useState } from "react";
import AccountantWrapper from "../../component/accountant";
import TermSelector from "../../component/common/TermSelector";
import DefaultLayout from "../../layout/DefaultLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Term } from "../../model/auth";

const AccountantPage = () => {
  const activeTerm = useSelector(
    (state: RootState) => state.auth.activeTerm
  ) as Term | null;
  const [term, setTerm] = useState<string>(activeTerm?._id || "");
  return (
    <DefaultLayout>
      <div className="px-5 py-3 text-lg font-semibold flex justify-between items-center">
        Cost Management <TermSelector termId={term} setTermId={setTerm} />
      </div>
      <AccountantWrapper termId={term} />
    </DefaultLayout>
  );
};
export default AccountantPage;
