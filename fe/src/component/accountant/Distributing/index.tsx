import { Table, Tag } from "antd";
import styles from "../styles.module.scss";
import classNames from "classnames";
import { TbPigMoney } from "react-icons/tb";
import { Link } from "react-router-dom";
const Distributing = () => {
  const data = [
    {
      GroupName: "Group A",
      amount: 1200.5,
      bankNumber: "123456789",
      bank: "Bank A",
      bankOwner: "John Doe",
      status: "Pending",
    },
    {
      GroupName: "Group B",
      amount: 1500.0,
      bankNumber: "987654321",
      bank: "Bank B",
      bankOwner: "Jane Smith",
      status: "Received",
    },
    {
      GroupName: "Group C",
      amount: 2500.75,
      bankNumber: "192837465",
      bank: "Bank C",
      bankOwner: "Sarah Lee",
      status: "Pending",
    },
    {
      GroupName: "Group D",
      amount: 500.4,
      bankNumber: "564738291",
      bank: "Bank D",
      bankOwner: "Michael Brown",
      status: "Received",
    },
    {
      GroupName: "Group E",
      amount: 3800.0,
      bankNumber: "283746190",
      bank: "Bank E",
      bankOwner: "Emily Davis",
      status: "Pending",
    },
    {
      GroupName: "Group F",
      amount: 1750.3,
      bankNumber: "674839201",
      bank: "Bank F",
      bankOwner: "Chris Wilson",
      status: "Received",
    },
    {
      GroupName: "Group G",
      amount: 2200.0,
      bankNumber: "112233445",
      bank: "Bank G",
      bankOwner: "Oliver Taylor",
      status: "Pending",
    },
    {
      GroupName: "Group H",
      amount: 2700.5,
      bankNumber: "556677889",
      bank: "Bank H",
      bankOwner: "Sophia Clark",
      status: "Received",
    },
    {
      GroupName: "Group I",
      amount: 3200.6,
      bankNumber: "998877665",
      bank: "Bank I",
      bankOwner: "Daniel Harris",
      status: "Pending",
    },
    {
      GroupName: "Group J",
      amount: 4100.8,
      bankNumber: "443322110",
      bank: "Bank J",
      bankOwner: "Olivia White",
      status: "Received",
    },
    {
      GroupName: "Group K",
      amount: 1850.0,
      bankNumber: "778899001",
      bank: "Bank K",
      bankOwner: "Lucas King",
      status: "Pending",
    },
    {
      GroupName: "Group L",
      amount: 2950.4,
      bankNumber: "445566778",
      bank: "Bank L",
      bankOwner: "Isabella Adams",
      status: "Received",
    },
    {
      GroupName: "Group M",
      amount: 550.9,
      bankNumber: "334455667",
      bank: "Bank M",
      bankOwner: "James Scott",
      status: "Pending",
    },
    {
      GroupName: "Group N",
      amount: 2700.3,
      bankNumber: "221133445",
      bank: "Bank N",
      bankOwner: "Mia Perez",
      status: "Received",
    },
    {
      GroupName: "Group O",
      amount: 6300.2,
      bankNumber: "334477889",
      bank: "Bank O",
      bankOwner: "Alexander Martin",
      status: "Pending",
    },
    {
      GroupName: "Group P",
      amount: 800.5,
      bankNumber: "123987456",
      bank: "Bank P",
      bankOwner: "Charlotte Evans",
      status: "Received",
    },
    {
      GroupName: "Group Q",
      amount: 1400.75,
      bankNumber: "658934210",
      bank: "Bank Q",
      bankOwner: "Matthew Collins",
      status: "Pending",
    },
    {
      GroupName: "Group R",
      amount: 2600.0,
      bankNumber: "777888999",
      bank: "Bank R",
      bankOwner: "Amelia Perez",
      status: "Received",
    },
    {
      GroupName: "Group S",
      amount: 1900.6,
      bankNumber: "556677223",
      bank: "Bank S",
      bankOwner: "Henry Morris",
      status: "Pending",
    },
    {
      GroupName: "Group T",
      amount: 4400.1,
      bankNumber: "889977664",
      bank: "Bank T",
      bankOwner: "Zoe Walker",
      status: "Received",
    },
    {
      GroupName: "Group U",
      amount: 2000.0,
      bankNumber: "992211445",
      bank: "Bank U",
      bankOwner: "Liam Hall",
      status: "Pending",
    },
    {
      GroupName: "Group V",
      amount: 3200.3,
      bankNumber: "331122667",
      bank: "Bank V",
      bankOwner: "Ava Allen",
      status: "Received",
    },
    {
      GroupName: "Group W",
      amount: 4100.8,
      bankNumber: "889922113",
      bank: "Bank W",
      bankOwner: "Jack Carter",
      status: "Pending",
    },
    {
      GroupName: "Group X",
      amount: 1100.0,
      bankNumber: "443322998",
      bank: "Bank X",
      bankOwner: "Grace Green",
      status: "Received",
    },
    {
      GroupName: "Group Y",
      amount: 2750.2,
      bankNumber: "665544889",
      bank: "Bank Y",
      bankOwner: "Ethan Young",
      status: "Pending",
    },
    {
      GroupName: "Group Z",
      amount: 1650.5,
      bankNumber: "112233667",
      bank: "Bank Z",
      bankOwner: "Madison King",
      status: "Received",
    },
    {
      GroupName: "Group AA",
      amount: 3900.0,
      bankNumber: "778899000",
      bank: "Bank AA",
      bankOwner: "Benjamin Nelson",
      status: "Pending",
    },
    {
      GroupName: "Group AB",
      amount: 4200.7,
      bankNumber: "992211333",
      bank: "Bank AB",
      bankOwner: "Harper Lee",
      status: "Received",
    },
    {
      GroupName: "Group AC",
      amount: 3300.9,
      bankNumber: "223344998",
      bank: "Bank AC",
      bankOwner: "William Wright",
      status: "Pending",
    },
    {
      GroupName: "Group AD",
      amount: 2100.6,
      bankNumber: "554433887",
      bank: "Bank AD",
      bankOwner: "Ella Hill",
      status: "Received",
    },
    {
      GroupName: "Group AE",
      amount: 2800.2,
      bankNumber: "665544776",
      bank: "Bank AE",
      bankOwner: "Elijah Adams",
      status: "Pending",
    },
    {
      GroupName: "Group AF",
      amount: 3400.1,
      bankNumber: "223344115",
      bank: "Bank AF",
      bankOwner: "Charlotte Scott",
      status: "Received",
    },
    {
      GroupName: "Group AG",
      amount: 4500.5,
      bankNumber: "334455667",
      bank: "Bank AG",
      bankOwner: "Lucas Walker",
      status: "Pending",
    },
    {
      GroupName: "Group AH",
      amount: 5100.0,
      bankNumber: "998877665",
      bank: "Bank AH",
      bankOwner: "Amelia Cooper",
      status: "Received",
    },
    {
      GroupName: "Group AI",
      amount: 4100.0,
      bankNumber: "112233445",
      bank: "Bank AI",
      bankOwner: "Mason Harris",
      status: "Pending",
    },
    {
      GroupName: "Group AJ",
      amount: 2700.8,
      bankNumber: "445566778",
      bank: "Bank AJ",
      bankOwner: "Harper Martin",
      status: "Received",
    },
  ];

  const columns = [
    {
      title: "Group Name",
      dataIndex: "GroupName",
      key: "GroupName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Bank Number",
      dataIndex: "bankNumber",
      key: "bankNumber",
    },
    {
      title: "Bank Number",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "Bank Owner",
      dataIndex: "bankOwner",
      key: "bankOwner",
    },
    {
      title: "Bank Number",
      dataIndex: "bankNumber",
      key: "bankNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: any) => (
        <Tag color={record?.status == "Pending" ? "gold" : "green"}>
          {record?.status}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: () => (
        <Link
          to={
            "https://sandbox.vnpayment.vn/paymentv2/Ncb/Transaction/Index.html?token=07a0b7a5cad641ecbfd131fef9c3d361"
          }
        >
          <TbPigMoney
            size={25}
            className="hover:text-orange-400 cursor-pointer"
          />
        </Link>
      ),
    },
  ];
  return (
    <div className={classNames(styles.customTable, "p-3 bg-white rounded")}>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};
export default Distributing;
