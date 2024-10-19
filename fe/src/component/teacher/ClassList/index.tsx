import { GoDotFill } from "react-icons/go";
import { RiGroup2Fill } from "react-icons/ri";
import { Badge, Popover } from "antd";
const classesList = [
  {
    name: "SE1704_NJ",
    groups: 6,
    students: 33,
    redundantStudents: 3,
    schedule: [
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
    ],
    notifications: [
      {
        content: "New submissions on  Outcomes 2",
        type: "outcomes",
      },
      {
        content: "There are redundant students in this class.",
        type: "people",
      },
    ],
    location: "AL-R-201",
    background:
      "https://4kwallpapers.com/images/wallpapers/windows-11-dark-mode-abstract-background-black-background-3440x1440-8710.jpg",
  },
  {
    name: "SE1704_DN",
    groups: 7,
    students: 40,
    redundantStudents: 0,
    schedule: [
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
    ],
    notifications: [
      {
        content: "New submissions on  Outcomes 2",
        type: "outcomes",
      },
    ],
    location: "AL-R-201",
    background:
      "https://4kwallpapers.com/images/wallpapers/windows-11-dark--11771.png",
  },
  {
    name: "SE1704_NJ",
    groups: 6,
    students: 33,
    redundantStudents: 3,
    schedule: [
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
      "Tuesday - 7:30 - 9:30 a.m",
    ],
    notifications: [
      {
        content: "New submissions on  Outcomes 2",
        type: "outcomes",
      },
      {
        content: "There are redundant students in this class.",
        type: "people",
      },
    ],
    location: "AL-R-201",
    background:
      "https://e1.pxfuel.com/desktop-wallpaper/107/730/desktop-wallpaper-the-windows-11-in-pantone-s-color-of-the-year-2022-very-peri.jpg",
  },
];
const ClassListWrapper = () => {
  return (
    <div className="w-full min-h-full flex-col flex p-5 gap-5">
      <h1 className="text-[28px] font-medium">FAll24</h1>
      <div className="flex flex-wrap gap-8">
        {classesList.map((c, index) => (
          <div
            key={index}
            className="w-[22%] min-h-[300px] rounded-md border border-textSecondary/40 flex flex-col bg-white"
          >
            <div
              className="w-full h-[100px] rounded-t-md bg-cover bg-center pt-3 pl-3 text-white flex flex-col"
              style={{ backgroundImage: `url('${c.background}')` }}
            >
              <a
                href={`/class/${index}`}
                className="font-medium text-lg hover:underline"
              >
                {c.name}
              </a>
              <div className="items-center flex flex-wrap text-sm gap-2">
                <span>{c?.groups} groups</span>
                <GoDotFill />
                <span>{c?.students} students</span>
              </div>
              {c?.redundantStudents > 0 && (
                <div className=" text-sm">
                  <span className="text-red-400">{c.redundantStudents}</span>{" "}
                  <span>redundant students</span>
                </div>
              )}
            </div>
            <div className="flex-col flex flex-grow">
              <div className=" border-b-textSecondary/40 border-b p-3 flex flex-col">
                <h3 className="font-medium text-lg">Schedule</h3>
                <span className="font-medium">{c.location}</span>
                <div className="flex-grow items-end flex">
                  <span className="flex flex-col">
                    {c?.schedule?.slice(0, 3).map((s) => (
                      <span
                        className="text-sm whitespace-nowrap block"
                        key={index}
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                  {c?.schedule?.length > 3 && (
                    <Popover
                      className="p-[3px] border border-textSecondary rounded text-primary ml-3"
                      placement="right"
                      content={() => (
                        <div className="flex flex-col">
                          {c?.schedule?.slice(3).map((o) => (
                            <span
                              className="text-sm whitespace-nowrap"
                              key={index}
                            >
                              {o}
                            </span>
                          ))}
                        </div>
                      )}
                    >
                      +{c?.schedule?.slice(3).length}
                    </Popover>
                  )}
                </div>
              </div>
              <div className="flex flex-grow py-2  px-5 items-center justify-end">
                <Badge dot>
                  <RiGroup2Fill size={30} />
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClassListWrapper;
