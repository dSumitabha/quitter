// src/app/page.jsx

import Feed from "./components/Feed";
import AIFetchTester from "./components/AIFetchTester"
import TriggerApiButton from "./components/TriggerApiButton"

const Page = () => {
  return (
    <div className="pb-32">
      {/* You can add other elements like a header, footer, etc. here */}
      <Feed />
    </div>
  );
};

export default Page;