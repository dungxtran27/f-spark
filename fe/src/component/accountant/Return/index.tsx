import classNames from "classnames";
import styles from "../styles.module.scss";
import { Button, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { TbPigMoney } from "react-icons/tb";
const Return = () => {
  const columns = [
    {
      title: "Group Name",
      dataIndex: "GroupName",
      key: "GroupName",
    },
    {
      title: "Total Fund",
      dataIndex: "totalFund",
      key: "totalFund",
    },
    {
      title: "Fund used",
      dataIndex: "fundUsed",
      key: "fundUsed",
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "remaining",
      render: (_: any, record: any) => {
        return (
          <span
            className={`${
              record?.remaining < 0 ? "text-red-500" : "text-green-500"
            } font-semibold`}
          >
            <span className="text-2xl">
              {record?.remaining < 0 ? "↓" : "↑"}
            </span>
            {record?.remaining}
          </span>
        );
      },
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
      render: (_: any, record: any) =>
        record?.remaining < 0 ? (
          <Button>Remind Group</Button>
        ) : (
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
  const dataSource = [
    {
      key: "1",
      GroupName: "Group 1 - Fund Allocation",
      totalFund: 5000000,
      fundUsed: 2000000,
      remaining: 3000000,
      bankNumber: "123456789",
      bank: "Bank A",
      bankOwner: "John Doe",
      status: "Processed",
    },
    {
      key: "2",
      GroupName: "Group 2 - Project Fund",
      totalFund: 3000000,
      fundUsed: 1500000,
      remaining: 1500000,
      bankNumber: "987654321",
      bank: "Bank B",
      bankOwner: "Jane Smith",
      status: "Pending",
    },
    {
      key: "3",
      GroupName: "Group 3 - Operational Fund",
      totalFund: 10000000,
      fundUsed: 4000000,
      remaining: 6000000,
      bankNumber: "1122334455",
      bank: "Bank C",
      bankOwner: "Mike Johnson",
      status: "Processed",
    },
    {
      key: "4",
      GroupName: "Group 4 - Research Fund",
      totalFund: 15000000,
      fundUsed: 5000000,
      remaining: 10000000,
      bankNumber: "5566778899",
      bank: "Bank D",
      bankOwner: "Sarah Brown",
      status: "Pending",
    },
    {
      key: "5",
      GroupName: "Group 5 - Innovation Fund",
      totalFund: 2000000,
      fundUsed: 500000,
      remaining: 1500000,
      bankNumber: "6677889900",
      bank: "Bank E",
      bankOwner: "David White",
      status: "Processed",
    },
    {
      key: "6",
      GroupName: "Group 6 - Strategic Fund",
      totalFund: 7000000,
      fundUsed: 4000000,
      remaining: 3000000,
      bankNumber: "1122334455",
      bank: "Bank F",
      bankOwner: "Emily Davis",
      status: "Pending",
    },
    {
      key: "7",
      GroupName: "Group 7 - Expansion Fund",
      totalFund: 8000000,
      fundUsed: 2000000,
      remaining: 6000000,
      bankNumber: "9988776655",
      bank: "Bank G",
      bankOwner: "Paul Wilson",
      status: "Processed",
    },
    {
      key: "8",
      GroupName: "Group 8 - Education Fund",
      totalFund: 10000000,
      fundUsed: 3000000,
      remaining: 7000000,
      bankNumber: "1233211234",
      bank: "Bank H",
      bankOwner: "Anna Clark",
      status: "Pending",
    },
    {
      key: "9",
      GroupName: "Group 9 - Infrastructure Fund",
      totalFund: 6000000,
      fundUsed: 2500000,
      remaining: 3500000,
      bankNumber: "4455667788",
      bank: "Bank I",
      bankOwner: "Samuel Green",
      status: "Processed",
    },
    {
      key: "10",
      GroupName: "Group 10 - Sustainability Fund",
      totalFund: 12000000,
      fundUsed: 5000000,
      remaining: 7000000,
      bankNumber: "3344556677",
      bank: "Bank J",
      bankOwner: "Charlotte Lee",
      status: "Pending",
    },
    {
      key: "11",
      GroupName: "Group 11 - Technology Fund",
      totalFund: 15000000,
      fundUsed: 7000000,
      remaining: 8000000,
      bankNumber: "5566778899",
      bank: "Bank K",
      bankOwner: "Ethan Scott",
      status: "Processed",
    },
    {
      key: "12",
      GroupName: "Group 12 - Marketing Fund",
      totalFund: 4000000,
      fundUsed: 1000000,
      remaining: 3000000,
      bankNumber: "9988776655",
      bank: "Bank L",
      bankOwner: "Olivia Turner",
      status: "Pending",
    },
    {
      key: "13",
      GroupName: "Group 13 - Travel Fund",
      totalFund: 2000000,
      fundUsed: 500000,
      remaining: 1500000,
      bankNumber: "1122334455",
      bank: "Bank M",
      bankOwner: "Liam Harris",
      status: "Processed",
    },
    {
      key: "14",
      GroupName: "Group 14 - Education & Research Fund",
      totalFund: 10000000,
      fundUsed: 2000000,
      remaining: 8000000,
      bankNumber: "6677889900",
      bank: "Bank N",
      bankOwner: "Sophia Allen",
      status: "Pending",
    },
    {
      key: "15",
      GroupName: "Group 15 - Health Fund",
      totalFund: 5000000,
      fundUsed: 1500000,
      remaining: 3500000,
      bankNumber: "5566778899",
      bank: "Bank O",
      bankOwner: "Lucas Young",
      status: "Processed",
    },
    {
      key: "16",
      GroupName: "Group 16 - Humanitarian Fund",
      totalFund: 8000000,
      fundUsed: 2500000,
      remaining: -100000, // Negative remaining value
      bankNumber: "1122334455",
      bank: "Bank P",
      bankOwner: "Ava Adams",
      status: "Pending",
    },
    {
      key: "17",
      GroupName: "Group 17 - Community Fund",
      totalFund: 12000000,
      fundUsed: 4000000,
      remaining: 8000000,
      bankNumber: "4455667788",
      bank: "Bank Q",
      bankOwner: "Mason Carter",
      status: "Processed",
    },
    {
      key: "18",
      GroupName: "Group 18 - Scientific Fund",
      totalFund: 20000000,
      fundUsed: 10000000,
      remaining: -500000, // Negative remaining value
      bankNumber: "3344556677",
      bank: "Bank R",
      bankOwner: "Isabella Murphy",
      status: "Pending",
    },
    {
      key: "19",
      GroupName: "Group 19 - Fundraising Fund",
      totalFund: 1000000,
      fundUsed: 200000,
      remaining: 800000,
      bankNumber: "9988776655",
      bank: "Bank S",
      bankOwner: "Elijah Walker",
      status: "Processed",
    },
    {
      key: "20",
      GroupName: "Group 20 - Sports Fund",
      totalFund: 3000000,
      fundUsed: 1500000,
      remaining: -100000, // Negative remaining value
      bankNumber: "6677889900",
      bank: "Bank T",
      bankOwner: "Mia King",
      status: "Pending",
    },
    {
      key: "21",
      GroupName: "Group 21 - Government Fund",
      totalFund: 20000000,
      fundUsed: 5000000,
      remaining: 15000000,
      bankNumber: "4455667788",
      bank: "Bank U",
      bankOwner: "Zoe Wright",
      status: "Processed",
    },
    {
      key: "22",
      GroupName: "Group 22 - Charitable Fund",
      totalFund: 3000000,
      fundUsed: 1000000,
      remaining: 2000000,
      bankNumber: "3344556677",
      bank: "Bank V",
      bankOwner: "Jacob Moore",
      status: "Pending",
    },
    {
      key: "23",
      GroupName: "Group 23 - Agriculture Fund",
      totalFund: 7000000,
      fundUsed: 2500000,
      remaining: 4500000,
      bankNumber: "1122334455",
      bank: "Bank W",
      bankOwner: "Amelia Taylor",
      status: "Processed",
    },
    {
      key: "24",
      GroupName: "Group 24 - Education Fund",
      totalFund: 9000000,
      fundUsed: 4000000,
      remaining: -100000, // Negative remaining value
      bankNumber: "6677889900",
      bank: "Bank X",
      bankOwner: "Daniel Martin",
      status: "Pending",
    },
    {
      key: "25",
      GroupName: "Group 25 - Research & Development Fund",
      totalFund: 10000000,
      fundUsed: 5000000,
      remaining: 5000000,
      bankNumber: "9988776655",
      bank: "Bank Y",
      bankOwner: "Olivia Harris",
      status: "Processed",
    },
    {
      key: "26",
      GroupName: "Group 26 - Environmental Fund",
      totalFund: 9000000,
      fundUsed: 3500000,
      remaining: 5500000,
      bankNumber: "1122334455",
      bank: "Bank Z",
      bankOwner: "Nora King",
      status: "Pending",
    },
    {
      key: "27",
      GroupName: "Group 27 - Legal Fund",
      totalFund: 5000000,
      fundUsed: 3000000,
      remaining: 2000000,
      bankNumber: "4455667788",
      bank: "Bank A",
      bankOwner: "Liam Nelson",
      status: "Processed",
    },
    {
      key: "28",
      GroupName: "Group 28 - Energy Fund",
      totalFund: 12000000,
      fundUsed: 5000000,
      remaining: 7000000,
      bankNumber: "3344556677",
      bank: "Bank B",
      bankOwner: "Catherine Lee",
      status: "Pending",
    },
    {
      key: "29",
      GroupName: "Group 29 - Cultural Fund",
      totalFund: 8000000,
      fundUsed: 1000000,
      remaining: 7000000,
      bankNumber: "6677889900",
      bank: "Bank C",
      bankOwner: "George Adams",
      status: "Processed",
    },
    {
      key: "30",
      GroupName: "Group 30 - Business Fund",
      totalFund: 2000000,
      fundUsed: 1500000,
      remaining: 500000,
      bankNumber: "9988776655",
      bank: "Bank D",
      bankOwner: "Ava Brooks",
      status: "Pending",
    },
    {
      key: "31",
      GroupName: "Group 31 - Disaster Fund",
      totalFund: 6000000,
      fundUsed: 4000000,
      remaining: 2000000,
      bankNumber: "5566778899",
      bank: "Bank E",
      bankOwner: "Ethan Morgan",
      status: "Processed",
    },
    {
      key: "32",
      GroupName: "Group 32 - Family Fund",
      totalFund: 8000000,
      fundUsed: 5000000,
      remaining: 3000000,
      bankNumber: "6677889900",
      bank: "Bank F",
      bankOwner: "Julia Brown",
      status: "Pending",
    },
    {
      key: "33",
      GroupName: "Group 33 - National Fund",
      totalFund: 20000000,
      fundUsed: 15000000,
      remaining: 5000000,
      bankNumber: "1122334455",
      bank: "Bank G",
      bankOwner: "Samuel Lee",
      status: "Processed",
    },
    {
      key: "34",
      GroupName: "Group 34 - Technological Advancement Fund",
      totalFund: 10000000,
      fundUsed: 3000000,
      remaining: -500000, // Negative remaining value
      bankNumber: "4455667788",
      bank: "Bank H",
      bankOwner: "Sophia Harris",
      status: "Pending",
    },
    {
      key: "35",
      GroupName: "Group 35 - Marketing Strategy Fund",
      totalFund: 4000000,
      fundUsed: 1000000,
      remaining: 3000000,
      bankNumber: "3344556677",
      bank: "Bank I",
      bankOwner: "Emily Turner",
      status: "Processed",
    },
    {
      key: "36",
      GroupName: "Group 36 - Water Conservation Fund",
      totalFund: 5000000,
      fundUsed: 2000000,
      remaining: 3000000,
      bankNumber: "5566778899",
      bank: "Bank J",
      bankOwner: "David Martin",
      status: "Pending",
    },
    {
      key: "37",
      GroupName: "Group 37 - Fundraising and Charity Fund",
      totalFund: 15000000,
      fundUsed: 7000000,
      remaining: 8000000,
      bankNumber: "6677889900",
      bank: "Bank K",
      bankOwner: "Olivia Scott",
      status: "Processed",
    },
    {
      key: "38",
      GroupName: "Group 38 - Youth Education Fund",
      totalFund: 3000000,
      fundUsed: 1000000,
      remaining: 2000000,
      bankNumber: "9988776655",
      bank: "Bank L",
      bankOwner: "James Evans",
      status: "Pending",
    },
    {
      key: "39",
      GroupName: "Group 39 - Global Initiative Fund",
      totalFund: 10000000,
      fundUsed: 6000000,
      remaining: 4000000,
      bankNumber: "1122334455",
      bank: "Bank M",
      bankOwner: "Grace Hill",
      status: "Processed",
    },
    {
      key: "40",
      GroupName: "Group 40 - Sustainability and Growth Fund",
      totalFund: 15000000,
      fundUsed: 9000000,
      remaining: -500000, // Negative remaining value
      bankNumber: "4455667788",
      bank: "Bank N",
      bankOwner: "Jack Moore",
      status: "Pending",
    },
    {
      key: "41",
      GroupName: "Group 41 - Infrastructure and Development Fund",
      totalFund: 8000000,
      fundUsed: 4000000,
      remaining: 4000000,
      bankNumber: "3344556677",
      bank: "Bank O",
      bankOwner: "Lily Taylor",
      status: "Processed",
    },
    {
      key: "42",
      GroupName: "Group 42 - Global Health Fund",
      totalFund: 20000000,
      fundUsed: 12000000,
      remaining: 8000000,
      bankNumber: "5566778899",
      bank: "Bank P",
      bankOwner: "Matthew Clark",
      status: "Pending",
    },
    {
      key: "43",
      GroupName: "Group 43 - Community Development Fund",
      totalFund: 6000000,
      fundUsed: 2000000,
      remaining: 4000000,
      bankNumber: "6677889900",
      bank: "Bank Q",
      bankOwner: "Sophia Jones",
      status: "Processed",
    },
    {
      key: "44",
      GroupName: "Group 44 - Business and Technology Fund",
      totalFund: 10000000,
      fundUsed: 5000000,
      remaining: 5000000,
      bankNumber: "9988776655",
      bank: "Bank R",
      bankOwner: "Alexander Hill",
      status: "Pending",
    },
    {
      key: "45",
      GroupName: "Group 45 - Regional Development Fund",
      totalFund: 12000000,
      fundUsed: 7000000,
      remaining: 5000000,
      bankNumber: "1122334455",
      bank: "Bank S",
      bankOwner: "Isabella Davis",
      status: "Processed",
    },
    {
      key: "46",
      GroupName: "Group 46 - International Aid Fund",
      totalFund: 5000000,
      fundUsed: 2000000,
      remaining: 3000000,
      bankNumber: "4455667788",
      bank: "Bank T",
      bankOwner: "Ethan Thomas",
      status: "Pending",
    },
    {
      key: "47",
      GroupName: "Group 47 - Public Health Fund",
      totalFund: 3000000,
      fundUsed: 1000000,
      remaining: 2000000,
      bankNumber: "3344556677",
      bank: "Bank U",
      bankOwner: "Olivia Lewis",
      status: "Processed",
    },
    {
      key: "48",
      GroupName: "Group 48 - Disaster Relief Fund",
      totalFund: 7000000,
      fundUsed: 2000000,
      remaining: 5000000,
      bankNumber: "5566778899",
      bank: "Bank V",
      bankOwner: "Benjamin Roberts",
      status: "Pending",
    },
    {
      key: "49",
      GroupName: "Group 49 - Environmental Protection Fund",
      totalFund: 10000000,
      fundUsed: 4000000,
      remaining: 6000000,
      bankNumber: "6677889900",
      bank: "Bank W",
      bankOwner: "Liam Clark",
      status: "Processed",
    },
    {
      key: "50",
      GroupName: "Group 50 - Educational and Research Fund",
      totalFund: 20000000,
      fundUsed: 10000000,
      remaining: 10000000,
      bankNumber: "9988776655",
      bank: "Bank X",
      bankOwner: "Charlotte Hall",
      status: "Pending",
    },
  ];

  return (
    <div className={classNames(styles.customTable, "p-3 bg-white rounded")}>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};
export default Return;