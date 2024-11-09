import { Breadcrumb, Card, Skeleton } from "antd";
import { ReadOutlined, SoundOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { classwork } from "../../../../api/ClassWork/classwork";

interface Statistic {
  id: string;
  count?: number;
  description: string;
  backgroundColor?: string;
}

interface Props {
  name: string;
  classId: string;
}

const Banner = ({ name, classId }: Props) => {
  const [statsData, setStatsData] = useState<Statistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClassStatistics = async () => {
    try {
      const response = await classwork.getClassStatistics(classId);
      const statsArray: Statistic[] = [
        {
          id: '1',
          count: response.data.data.ungradedOutcomeSubmisstion ?? 0,
          description: 'Ungraded Outcome Submissions',
          backgroundColor: "#fde68a",
        },
        {
          id: '2',
          count: response.data.data.upvotesOnLatestAnnouncement ?? 0,
          description: 'Upvotes on Latest Announcement',
          backgroundColor: "#fde68a",
        },
        {
          id: '3',
          count: response.data.data.submissionsOnLatestAssignment ?? 0,
          description: 'Submissions on Latest Assignment',
          backgroundColor: "#fde68a",
        },
      ];
      setStatsData(statsArray);
    } catch (error) {
      console.error("Failed to fetch class statistics:", error);
      setStatsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassStatistics();
    }
  }, [classId]);

  return (
    <div className="w-full p-4 bg-white">
      <Breadcrumb
        items={[
          { title: <a href="/classes">Classes</a> },
          { title: <span className="text-primary">{name}</span> },
        ]}
      />
      <div className="w-11/12 mx-auto mt-4 flex space-x-4">
        {isLoading ? (
          <Skeleton active className="w-full" />
        ) : (
          statsData.map((stat) => (
            <Card
              key={stat.id}
              className="flex-1 rounded-md shadow-sm bg-pendingStatus/25 border-[1px] border-pendingStatus"
              bordered={false}
            >
              <div className="flex items-center">
                {stat.id === '1' ? (
                  <ReadOutlined className="text-orange-500 text-2xl mr-2" />
                ) : stat.id === '2' ? (
                  <SoundOutlined className="text-orange-500 text-2xl mr-2" />
                ) : (
                  <EditOutlined className="text-orange-500 text-2xl mr-2" />
                )}
                <div>
                  {stat.id === '1' ? (
                    <h2 className="text-xl font-medium">{stat.count}</h2>
                  ) : (
                    <h2 className="text-xl font-medium">{`${stat.count || 0}/30`}</h2>
                  )}
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Banner;
