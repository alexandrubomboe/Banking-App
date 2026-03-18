import CriteriaButton from "./CriteriaButton";
import PieChart from "./PieChart";
import TotalAcc from "./TotalAcc";
import DropBox from "./DropBox";

const timeCriterias = ["By Year", "By Month"];
const expenseCriterias = [
  "Groceries",
  "Transportation",
  "Healthcare",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "ALL TIME",
];

export default function ContentDisplay() {
  return (
    <div className="flex flex-row flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <div
        className={`flex flex-col w-[20%] border-r border-stone-600/30 border-solid pr-7 py-3`}
      >
        <div
          className={`text-xl border-b border-stone-600/30 border-solid pb-2`}
        >
          Time Criteria
        </div>
        <div className={`flex flex-col mt-5`}>
          {timeCriterias.map((label) => (
            <CriteriaButton label={label} />
          ))}
        </div>
        <div
          className={`text-xl border-b border-stone-600/30 border-solid pb-2 pt-5`}
        >
          Expense criteria
        </div>
        <div className={`flex flex-col mt-5`}>
          {expenseCriterias.map((label) => (
            <CriteriaButton label={label} />
          ))}
        </div>
      </div>

      <div
        className={`flex flex-col flex-1 border-t border-b mx-5 border-stone-600/30 border-solid`}
      >
        <div className="border-b border-stone-600/30 border-solid h-[10%] p-2">
          <DropBox />
        </div>
        <PieChart />
        <TotalAcc />
      </div>
    </div>
  );
}
