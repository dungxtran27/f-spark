import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createViewWeek,
  createViewMonthGrid,
  createViewDay,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { viewMonthGrid } from "@schedule-x/calendar";

import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createResizePlugin } from "@schedule-x/resize";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import { createCurrentTimePlugin } from "@schedule-x/current-time";
import "@schedule-x/theme-default/dist/calendar.css";
import { CALENDAR_CONFIG } from "../../../utils/const";
const Timeline = () => {
  const calendar = useCalendarApp({
    weekOptions: {
      gridHeight: 1000,

      eventWidth: 100,
    },
    monthGridOptions: {
      nEventsPerDay: 4,
    },
    dayBoundaries: {
      start: "06:00",
      end: "18:00",
    },
    calendars: CALENDAR_CONFIG,
    defaultView: viewMonthGrid.name,
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      {
        id: 6,
        start: "2024-09-24 ",
        end: "2024-09-27 ",
        title: "kkk 1",
        description: "dungmuahaahahahahahaahahah",
        calendarId: "leisure",
      },
      {
        id: 1,
        start: "2024-09-27 06:00",
        end: "2024-09-27 08:00",
        title: "dungmuahaha 1",
        description: "dungmuahaahahahahahaahahah",
        calendarId: "school",
      },
      {
        id: 1,
        start: "2024-09-27 07:00",
        end: "2024-09-27 11:00",
        title: "dungmuahaha 2",
        description: "dungmuahaahahahahahaahahah",
        calendarId: "personal",
      },
      {
        id: 1,
        start: "2024-09-27 8:00",
        end: "2024-09-27 10:00",
        title: "dungmuahaha 3",
        description: "dungmuahaahahahahahaahahah",
        calendarId: "work",
      },
      {
        id: 1,
        start: "2024-09-27 09:00",
        end: "2024-09-27 14:00",
        title: "dungmuahaha 4",
        description: "dungmuahaahahahahahaahahah",
        calendarId: "leisure",
      },
      {
        id: 1,
        start: "2024-09-27 15:00",
        end: "2024-09-27 16:00",
        title: "dungmuahaha 5",
        description: "dungmuahaahahahahahaahahah",
        calendarId: "leisure",
      },
      {
        id: 2,
        start: "2024-09-27 07:00",
        end: "2024-09-27 10:00",
        title: "dungmuahaha 6",
        description:
          "Diễn Viên Hài Hữu Tín Tiết Lộ Rằng Mình Từng Là Gái Anime!!!!!!",
      },
      {
        id: 3,
        start: "2024-09-28 09:00",
        end: "2024-09-28 15:00",
        title: "dungmuahaha 3",
      },
    ],
    selectedDate: "2024-09-25 10:00",
    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
      createResizePlugin(),
      createCurrentTimePlugin(),
      createEventsServicePlugin(),
    ],
  });

  return (
    <>
      <ScheduleXCalendar calendarApp={calendar} />
    </>
  );
};
export default Timeline;
