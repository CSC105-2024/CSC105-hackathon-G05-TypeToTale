import { Link } from "react-router";
import { useTokenValidation } from "../hooks/validateToken";
export default function FooterComponent() {
  useTokenValidation();
  return (
    <footer className="text-black bg-[#ffffff] pt-5 drop-shadow-[0_-4px_6px_rgba(0,0,0,0.1)] w-full">
      <div className="flex flex-col md:flex-row ">
        <div className="flex flex-row md:flex-col md:justify-start justify-between">
          <div className="font-bold ml-5 text-[30px] text-[#5C5E81] m-1">
            TypeToTale
          </div>
        </div>
        <div className="flex flex-col md:flex-row m-1 mt-3 md:pb-10 md:justify-evenly w-full">
          <div className="flex flex-col ml-3">
            <div className="font-semibold">Contact info</div>
            <div className="font-light mt-3">Tel. 0xx-xxxx-xxx</div>
          </div>
          <div className="flex flex-col md:mt-0 mt-5 mb-5 ml-3">
            <div className="font-semibold">Explore</div>
            <div className="mt-3 font-light">
              <Link to={"/"}>Bookshelf</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
