import colors from "../../../constants/colors.ts";

export default function TotalAcc() {
  return (
    <div className="flex flex-row gap-4 flex-1">
      <div className={`flex flex-col flex-1 rounded-xl p-5 ${colors.nav}`}>
        <div className={`border-b border-${colors.secBg} border-solid pb-5 text-white font-bold text-3xl`}>
          Total Accounts
        </div>
        <div className="text-white pt-5 text-3xl">12,500</div>
      </div>
      <div className={`flex flex-col flex-1 rounded-xl p-5 ${colors.nav}`}>
        <div className={`border-b border-${colors.secBg} border-solid pb-5 text-white font-bold text-3xl`}>
          Savings Accounts
        </div>
        <div className="text-white pt-5 text-3xl">4,375</div>
      </div>
      <div className={`flex flex-col flex-1 rounded-xl p-5 ${colors.nav}`}>
        <div className={`border-b border-${colors.secBg} border-solid pb-5 text-white font-bold text-3xl`}>
          Credit Accounts
        </div>
        <div className="text-white pt-5 text-3xl">3,125</div>
      </div>
    </div>
  );
}
