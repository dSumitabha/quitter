// src/app/page.jsx

import Feed from "./components/Feed";
import AIFetchTester from "./components/AIFetchTester"
import TriggerApiButton from "./components/TriggerApiButton"

const Page = () => {
  return (
    <div>
      {/* You can add other elements like a header, footer, etc. here */}
      <Feed />
      <div className="py-20 mx-auto text-center border max-w-md ">Thank You : )</div>
    </div>
  );
};

export default Page;