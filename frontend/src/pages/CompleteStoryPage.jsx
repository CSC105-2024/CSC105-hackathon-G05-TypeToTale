import CompleteStoryComponent from "../components/CompleteStoryComponent";
import FooterComponent from "../components/FooterComponent";

export default function CompleteStoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow">
        <CompleteStoryComponent />
      </div>
      <FooterComponent />
    </div>
  );
}
