import { Avatar } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../../../api/notification/notification";
import { QUERY_KEY, DATE_FORMAT } from "../../../utils/const";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
const Classes = () => {
  const { data: classNotification  } = useQuery({
    queryKey: [QUERY_KEY.CLASS_NOTIFICATION_DETAIL],
    queryFn: () => {
      return notificationApi.getClassNotificationDetail();
    },
  });
  
  return (
    <div className="bg-white p-4 rounded shadow mr-2 h-[500px]">
      <div className="flex items-center justify-between border-b-4 border-gray-300 pb-2 mb-2">
        <h3 className="text-lg font-bold p-1">Class ({classNotification?.data?.data.length})</h3>
      </div>
      <div className="space-y-4 overflow-y-auto h-[412px] pr-2">
        {classNotification?.data?.data.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 space-y-2 border-b border-gray-300 pb-2"
          >
            <Avatar size="large" className="mt-1" src={item?.sender?.account?.profilePicture || "https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png"}/>
            <div className="flex-grow">
              <div className="flex justify-between">
                <div className="flex">
                  {item?.action?.action == 'request deadline response'
                  ?
                  <>
                    <p className="font-medium">{item?.group?.GroupName}</p><p>'s deadline request has been</p> 
                    {new Date(item?.action?.newVersion?.endDate) > new Date(item?.action?.priorVersion?.endDate)
                      ?
                      <p className="font-medium text-green-600 ml-1">approved</p> 
                      :
                      <p className="font-medium text-red-600 ml-1">denied</p>
                    }
                  </>
                  :
                    <>
                    {item?.action?.action != 'request for funding'
                    ?
                      <>
                        {item?.action?.action == 'remind group submit outcome' ?
                          <>
                          <p className="font-medium mr-1">{item?.senderType}</p>
                          <span>remind group</span>
                          <p className="font-medium ml-1">{item?.group?.GroupName}</p>
                          <span className="ml-1">submit outcome for</span>
                          <span className="font-semibold ml-1">{item?.action?.newVersion?.title}</span>
                          </>
                          :
                          <>
                          {item?.action?.action == 'Graded your Submission on' ? (
                            <div className="flex items-center">
                              <p className="font-medium mr-1">{item?.senderType}</p>
                              <span className="mr-1">Graded</span>
                              <p className="font-medium mr-1">{item?.group?.GroupName}</p>
                              <span>submission</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <p className="font-medium mr-1">{item?.senderType}</p>
                              <Link to={`/class`} className="disabled:inline-block hover:underline">
                                <p className="m-0">{item?.action?.action}</p>
                              </Link>
                            </div>
                          )}
                        </>
                        }
                      </>
                    :
                      <>
                        <p className="font-medium inline">{item?.action?.newVersion?.GroupName}</p><p className="inline">'s sponsorship request has been</p> 
                        {item?.action?.newVersion?.sponsorStatus == 'sponsored' 
                          ?
                          <p className="font-medium text-green-600 ml-1">approved</p> 
                          :
                          <p className="font-medium text-red-600 ml-1">denied</p>
                        }
                      </>
                    }
                    </>
                  }
                  
                </div>
              </div>
              {item?.action?.action !== 'request deadline response' && (
                <div className="flex items-center justify-between">
                  <p
                    className="text-sm text-gray-500 pb-1"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        item?.action?.newVersion?.description?.length > 60
                          ? item.action.newVersion.description.substring(0, 60) + "..."
                          : item?.action?.newVersion?.description || ""
                      ),
                    }}
                  ></p>
                  <p className="text-xs text-gray-500">
                                {dayjs(item?.createdAt).format(DATE_FORMAT.withYearAndTime)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
