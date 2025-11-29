import { FaFacebook } from "react-icons/fa";
import footerPhoto from "./../assets/image-logo-sks.jpg";

const Footer = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="mt-5 py-10 w-full px-10 flex items-start justify-between gap-10 bg-gradient-to-tr from-black via-gray-800 to-sky-800 text-white flex-wrap">
        <div className="max-w-60 max-h-60 rounded-lg overflow-hidden sm:mx-0 mx-auto">
          <img
            className="w-full h-full object-cover"
            src={footerPhoto}
            alt="footerPhoto"
          />
        </div>
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-3xl font-bold">Social Links</h3>
          <ul className="flex flex-col items-start gap-1">
            <li>
              <a
                className="group flex items-center gap-2 py-2 px-2 rounded-full hover:bg-white transition duration-300"
                href="https://www.facebook.com/profile.php?id=61575016271467"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook className="text-2xl text-gray-400 group-hover:text-blue-600" />
                <span className="text-gray-300 group-hover:text-black font-medium">
                  Facebook
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-3xl font-bold">About Us</h3>
          <p className="max-w-60 text-gray-300 font-medium">
            SKS (Sinthia Kitchen Shop) is a social e-commerce platform. We aim
            to provide you with the best kitchen products.
          </p>
        </div>
      </div>
      <div className="w-full p-5 bg-gray-300 text-center flex items-center justify-center">
        <p className="md:text-lg text-base text-center font-semibold flex items-center gap-1">
          Developed & Managed by:
          <a
            className="italic hover:text-sky-700 duration-300 font-bold"
            target="_blank"
            href="https://www.facebook.com/4B.Code.Hub"
          >
            4B Code Hub
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
