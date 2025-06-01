import EditAccountComponent from "../components/EditAccountComponent";
import FooterComponent from "../components/FooterComponent";

const EditAccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow">
        <EditAccountComponent />
      </div>
      <FooterComponent />
    </div>
  );
};

export { EditAccountPage };
