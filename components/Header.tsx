"use client";
import dashboardSvg from "@/assets/dashboard.svg";
import book from "@/assets/book.svg";
import Image from "next/image";
import { useAppSelector } from "@/redux/hook";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { isSidebarOpen } = useAppSelector((state) => state.record);
  return (
    <div
      className={`flex flex-wrap justify-between items-center mt-2 py-5 px-5`}
    >
      <div
        className={`mb-2 flex justify-start items-center ${
          !isSidebarOpen ? "ml-[1em]" : "ml-0"
        }`}
      >
        {pathname === "/" && (
          <Image
            priority
            src={dashboardSvg}
            alt="dashboard"
            className="w-[30px] h-[30px]"
          />
        )}
        {(pathname === "/classes" || pathname === "/my-class" || pathname === "/assignments") && (
          <Image src={book} alt="Books" className="w-[30px] h-[30px]" />
        )}

        {/* use to display for admin later
        <Image
          priority
          src={arrowRightSvg}
          alt="arrow-right"
          className="w-[20px] h-[20px] mx-2"
        />
        <h3 className="font-bold text-[14px] md:text-[17px] leading-[20px] text-[#222]">
          {type === "teacher"
            ? "All Teachers Record"
            : type === "student"
            ? "All Students Record"
            : type}
        </h3>  */}
      </div>
      {/* {type === "teacher" || type === "student" ? (
        <div className="flex justify-center ">
          <Link
            href={`/create-form/${type === "teacher" ? "teacher" : "student"}`}
            className="rounded-[6px] bg-[#222] py-[5px] px-[10px] gap-[5px] flex items-center cursor-pointer"
          >
            <h3 className="text-white  text-[12px] sm:text-[14px] leading-[24px] font-normal">
              Create Record
            </h3>
          </Link>
          <Link
            href={`${type === "teacher" ? "/student" : "/"}`}
            onClick={() => dispatch(setLoader(true))}
            className="mx-2 rounded-[6px] bg-[#222] py-[5px] px-[10px] gap-[5px] flex items-center cursor-pointer"
          >
            <h3 className="text-white text-[12px] sm:text-[14px] leading-[24px] font-normal">
              {type === "teacher" ? "View Students" : "View Teachers"}
            </h3>
          </Link>
        </div>
      ) : (
        <button
          onClick={() => {
            router.back();
            dispatch(setLoader(true));
          }}
          className="rounded-[6px] bg-[#222] py-[5px] px-[10px] gap-[5px] flex items-center cursor-pointer"
        >
          <h3 className="text-white text-[14px] leading-[24px] font-normal">
            Go back
          </h3>
        </button>
      )} */}
    </div>
  );
};

export default Header;
