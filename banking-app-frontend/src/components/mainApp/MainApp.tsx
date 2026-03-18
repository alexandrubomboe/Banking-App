// import type { ReactNode } from "react";

import NavigationBar from "./NavigationBar";
import colors from "../../../constants/colors.ts";
import ContentDisplay from "./ContentDisplay.tsx";
// interface Props {
//   text: string;
//   cacat: ReactNode;
// }

export default function MainApp() {
  return (
    <div
      className={`flex flex-col w-full min-h-screen h-full ${colors.pageBg}`}
    >
      <NavigationBar />
      <main className={`flex-1 flex p-7`}>
        <ContentDisplay />
      </main>
    </div>
  );
}
