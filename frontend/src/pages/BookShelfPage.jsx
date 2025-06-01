import BookShelfComponent from "../components/BookShelfComponent";
import FooterComponent from "../components/FooterComponent";

const BookShelfPage = () => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow">
          <BookShelfComponent/>
        </div>
        <FooterComponent />
      </div>
    );
  };
  

export { BookShelfPage };
