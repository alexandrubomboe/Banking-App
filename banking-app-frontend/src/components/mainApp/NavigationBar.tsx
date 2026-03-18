import { BsBank2 } from "react-icons/bs";
import colors from "../../../constants/colors.ts";

export default function NavigationBar() {
  return (
    <div
      className={`flex flex-row h-16 items-center border-b px-4 ${colors.nav}`}
    >
      <section className="h-full flex flex-row items-center w-[30%] gap-5 justify-center">
        <BsBank2 className={`text-3xl ${colors.navTitle}`} />
        <h2 className={`text-3xl ${colors.navTitle}`}>Banking calculator</h2>
      </section>

      <section></section>
    </div>
  );
}
