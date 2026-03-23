import colors from "../../../constants/colors.ts";

export default function TotalAcc({
  sent,
  recieved,
}: {
  sent: number;
  recieved: number;
}) {
  return (
    <div className="flex flex-row gap-4 flex-1">
      <div className={`flex flex-col flex-1 rounded-xl p-5 ${colors.nav}`}>
        <div
          className={`border-b border-${colors.secBg} border-solid pb-5 text-white font-bold text-3xl`}
        >
          Total Sent
        </div>
        <div className="text-white pt-5 text-3xl">{sent.toFixed(2)} RON</div>
      </div>
      <div className={`flex flex-col flex-1 rounded-xl p-5 ${colors.nav}`}>
        <div
          className={`border-b border-${colors.secBg} border-solid pb-5 text-white font-bold text-3xl`}
        >
          Total Recieved
        </div>
        <div className="text-white pt-5 text-3xl">
          {recieved.toFixed(2)} RON
        </div>
      </div>
      <div className={`flex flex-col flex-1 rounded-xl p-5 ${colors.nav}`}>
        <div
          className={`border-b border-${colors.secBg} border-solid pb-5 text-white font-bold text-3xl`}
        >
          Summary
        </div>
        <div className="text-white pt-5 text-3xl">
          {(sent - recieved).toFixed(2)} RON
        </div>
      </div>
    </div>
  );
}
