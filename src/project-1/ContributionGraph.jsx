import React, { useState } from "react";
import "./ContributionGraph.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const contributions = [
  { date: "2024-01-01", count: 5 },
  { date: "2024-01-02", count: 3 },
  // Initial data, can be updated by tasks
];

const getColor = (count) => {
  if (count >= 5) return "#216e39"; // dark green
  if (count >= 3) return "#30a14e"; // medium green
  if (count >= 1) return "#40c463"; // light green
  return "#ebedf0"; // light gray
};

const getWeeks = () => {
  const weeks = [];
  let date = new Date();
  date.setMonth(0);
  date.setDate(1);

  for (let i = 0; i < 52; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

const getMonthLabels = (weeks) => {
  const monthLabels = [];
  weeks.forEach((week, index) => {
    const firstDayOfWeek = week[0];
    const month = firstDayOfWeek.toLocaleString("default", { month: "short" });
    if (index === 0 || firstDayOfWeek.getDate() <= 7) {
      monthLabels.push({ month, index });
    }
  });
  return monthLabels;
};

const ContributionGraph = () => {
  const [tooltip, setTooltip] = useState({
    show: false,
    text: "",
    left: 0,
    top: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [contributionData, setContributionData] = useState(contributions);
  const weeks = getWeeks();
  const monthLabels = getMonthLabels(weeks);

  const handleMouseEnter = (e, dayData) => {
    setTooltip({
      show: true,
      // text: `Date: ${dayData.date}\nCount: ${dayData.count}`,
      text: `${dayData.count} contribution on ${dayData.date}`,
      left: e.clientX,
      top: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      show: false,
      text: "",
      left: 0,
      top: 0,
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskInput = e.target.task.value;
    if (!taskInput) return;

    const taskDate = selectedDate.toISOString().split("T")[0];
    setTasks([...tasks, { date: taskDate, task: taskInput }]);

    setContributionData((prevData) => {
      const existing = prevData.find((d) => d.date === taskDate);
      if (existing) {
        existing.count += 1;
        return [...prevData];
      }
      return [...prevData, { date: taskDate, count: 1 }];
    });

    e.target.task.value = "";
  };

  const renderGrid = () => {
    return weeks.map((week, weekIndex) => (
      <div className="week" key={weekIndex}>
        {week.map((day, dayIndex) => {
          const dayData = contributionData.find(
            (d) => d.date === day.toISOString().split("T")[0]
          );

          return (
            <div
              key={dayIndex}
              className="day"
              style={{ backgroundColor: getColor(dayData ? dayData.count : 0) }}
              onMouseEnter={(e) =>
                handleMouseEnter(e, {
                  date: day.toISOString().split("T")[0],
                  count: dayData ? dayData.count : 0,
                })
              }
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Github Contribution💻</h1>
      <div className="header">
        {" "}
        <div className="month-labels">
          {monthLabels.map(({ month, index }) => (
            <div
              key={index}
              className="month-label"
              style={{ gridColumnStart: index + 1 }}
            >
              {month}
            </div>
          ))}
        </div>
        <div className="contribution-graph">{renderGrid()}</div>
      </div>
      {tooltip.show && (
        <div
          className="tooltip"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          {tooltip.text}
        </div>
      )}
      <div className="calendar-task-container">
        <div className="calendar">
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
        <form onSubmit={handleAddTask} className="task-form">
          <input type="text" name="task" placeholder="Add a task" required />
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default ContributionGraph;
