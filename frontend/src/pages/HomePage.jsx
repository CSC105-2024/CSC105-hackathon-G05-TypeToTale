import HomePageComponent from "../components/HomeComponent";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow">
        {/* Main content */}
        <HomePageComponent />
      </div>
    </div>
  );
};

export { HomePage };
