import FooterComponent from "../components/FooterComponent";
import StoryComponent from "../components/StoryComponent";

export default function StoryPage(){
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow">
          <StoryComponent/>
        </div>
        <FooterComponent />
      </div>
    );
  };
  
