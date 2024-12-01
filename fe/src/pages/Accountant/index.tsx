import AccountantWrapper from "../../component/accountant";
import TermSelector from "../../component/common/TermSelector";
import DefaultLayout from "../../layout/DefaultLayout";

const AccountantPage = () => {
  return (
    <DefaultLayout>
      <div className="px-5 py-3 text-lg font-semibold flex justify-between items-center">
        Cost Management <TermSelector />
      </div>
      <AccountantWrapper />
    </DefaultLayout>
  );
};
export default AccountantPage;
