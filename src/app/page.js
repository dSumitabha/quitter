// src/app/page.jsx

import Feed from "./components/Feed";
import Header from "./components/Header";
import AIFetchTester from "./components/AIFetchTester"
import TriggerApiButton from "./components/TriggerApiButton"

const Page = () => {
  return (
    <>
      {/* You can add other elements like a header, footer, etc. here */}
      <Feed />
      {/*<div className="py-20 mx-auto text-center border max-w-md ">Thank You : )</div>*/}    
    </>
  );
};

export default Page;