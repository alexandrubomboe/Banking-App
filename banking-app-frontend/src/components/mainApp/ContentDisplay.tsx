import CriteriaButton from "./CriteriaButton";
import PieChart from "./PieChart";
import TotalAcc from "./TotalAcc";
import DropBox from "./DropBox";

import Calendar from "react-calendar";

import { useState } from "react";

const expenseCriterias = [
  "Groceries",
  "Transportation",
  "Healthcare",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "ALL TIME",
];

type CalendarMode = "none" | "year" | "month";
export default function ContentDisplay() {
  const [transfersData, setTransfersData] = useState({
    "Money Sent": 0,
    "Money Received": 0,
  });
  const [spendingsData, setSpendingsData] = useState<Record<string, number>>(
    {},
  );
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("none");
  const [displayedMode, setDisplayedMode] = useState<CalendarMode>("none");
  const [isVisible, setIsVisible] = useState(true);

  const switchCalendar = (mode: CalendarMode) => {
    const newMode = mode === calendarMode ? "none" : mode;
    setIsVisible(false);
    setTimeout(() => {
      setDisplayedMode(newMode);
      setCalendarMode(newMode);
      setIsVisible(true);
    }, 200);
  };

  const sendMonthData = async (year: number, month: number) => {
    try {
      const transfersResponse = await fetch(
        `http://127.0.0.1:8000/user/transfers/1/${year}-${String(month).padStart(2, "0")}/`,
        {
          method: "GET",
        },
      );

      const spendingsResponse = await fetch(
        `http://127.0.0.1:8000/user/spendings/1/${year}-${String(month).padStart(2, "0")}/`,
        {
          method: "GET",
        },
      );

      if (!transfersResponse.ok) {
        const errorText = await transfersResponse.text();
        console.error(
          `Backend Error (${transfersResponse.status}):`,
          errorText,
        );
        return;
      }

      if (!spendingsResponse.ok) {
        const errorText = await spendingsResponse.text();
        console.error(
          `Backend Error (${spendingsResponse.status}):`,
          errorText,
        );
        return;
      }

      const monthTransfersData = await transfersResponse.json();
      setTransfersData(monthTransfersData.summary);
      setSpendingsData((await spendingsResponse.json()).summary);

      console.log("Transfers:", monthTransfersData.summary);
      console.log("Spendings:", spendingsData);
    } catch (error) {
      // This catches network errors (like the server being down or CORS)
      console.error("Network or CORS error:", error);
    }
  };

  const sendYearData = async (year: number) => {
    try {
      const transfersResponse = await fetch(
        `http://127.0.0.1:8000/user/transfers/0/${year}`,
        {
          method: "GET",
        },
      );

      const spendingsResponse = await fetch(
        `http://127.0.0.1:8000/user/spendings/0/${year}`,
        {
          method: "GET",
        },
      );

      if (!transfersResponse.ok) {
        const errorText = await transfersResponse.text();
        console.error(
          `Backend Error (${transfersResponse.status}):`,
          errorText,
        );
        return;
      }

      if (!spendingsResponse.ok) {
        const errorText = await spendingsResponse.text();
        console.error(
          `Backend Error (${spendingsResponse.status}):`,
          errorText,
        );
        return;
      }

      const yearTransfersData = await transfersResponse.json();
      setTransfersData(yearTransfersData.summary);
      setSpendingsData((await spendingsResponse.json()).summary);

      console.log("Transfers:", yearTransfersData.summary);
      console.log("Spendings:", spendingsData);
    } catch (error) {
      // This catches network errors (like the server being down or CORS)
      console.error("Network or CORS error:", error);
    }
  };

  const handleClickYear = (year: number) => {
    sendYearData(year);
  };

  const handleClickMonth = (year: number, month: number) => {
    sendMonthData(year, month);
  };

  return (
    <div className="flex flex-row bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-[calc(100vw-3.5rem)] h-[calc(100vh-7.5rem)] overflow-hidden">
      <div className="flex flex-col w-[20%] border-r border-stone-600/30 border-solid pr-7 py-3 overflow-y-auto">
        <div className="text-xl border-b border-stone-600/30 border-solid pb-2">
          Time Criteria
        </div>
        <div className="flex flex-col mt-5">
          <CriteriaButton
            label="By Year"
            isSelected={calendarMode === "year"}
            onSelect={() => switchCalendar("year")}
          />
          <CriteriaButton
            label="By Month"
            isSelected={calendarMode === "month"}
            onSelect={() => switchCalendar("month")}
          />
        </div>

        <div
          className="transition-all duration-200 origin-top"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scaleY(1)" : "scaleY(0.96)",
          }}
        >
          {displayedMode === "none" && (
            <div className="flex items-center justify-center w-full py-3 my-2 rounded-lg text-slate-400 text-xs text-center bg-slate-50 border border-dashed border-slate-200">
              Select a time filter
            </div>
          )}

          {displayedMode === "year" && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm [&_.react-calendar]:w-full [&_.react-calendar]:border-0 [&_.react-calendar]:font-sans [&_.react-calendar__tile]:text-sm [&_.react-calendar__tile]:rounded-lg [&_.react-calendar__tile--active]:bg-blue-500! [&_.react-calendar__tile:hover]:bg-blue-100 [&_.react-calendar__navigation__label]:font-semibold [&_.react-calendar__navigation__label]:text-slate-700 [&_.react-calendar__navigation_button]:rounded-lg [&_.react-calendar__navigation_button:hover]:bg-slate-100">
              <Calendar
                onClickYear={(year) => handleClickYear(year.getFullYear())}
                maxDetail="decade"
                view="decade"
              />
            </div>
          )}

          {displayedMode === "month" && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm [&_.react-calendar]:w-full [&_.react-calendar]:border-0 [&_.react-calendar]:font-sans [&_.react-calendar__tile]:text-sm [&_.react-calendar__tile]:rounded-lg [&_.react-calendar__tile--active]:bg-blue-500! [&_.react-calendar__tile:hover]:bg-blue-100 [&_.react-calendar__navigation__label]:font-semibold [&_.react-calendar__navigation__label]:text-slate-700 [&_.react-calendar__navigation_button]:rounded-lg [&_.react-calendar__navigation_button:hover]:bg-slate-100">
              <Calendar
                onClickMonth={(month) =>
                  handleClickMonth(month.getFullYear(), month.getMonth() + 1)
                }
                maxDetail="year"
                view="year"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 border-t mx-5 border-stone-600/30 border-solid">
        <div className="border-b border-stone-600/30 border-solid h-[10%] p-2">
          <DropBox />
        </div>
        <PieChart spendingsData={spendingsData} />
        <TotalAcc
          sent={transfersData["Money Sent"]}
          recieved={transfersData["Money Received"]}
        />
      </div>
    </div>
  );
}
