import NavigationBar from "./NavigationBar";
import colors from "../../../constants/colors.ts";
import ContentDisplay from "./ContentDisplay.tsx";

export default function MainApp() {
  return (
    <div className={`w-full min-h-screen ${colors.pageBg}`}>
      <NavigationBar />
      <main className={`flex p-7 mt-16`}>
        <ContentDisplay />
      </main>
    </div>
  );
}
