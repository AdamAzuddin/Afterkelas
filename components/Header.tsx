"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import homeSVG from "@/assets/dashboard.svg";
import paperClip from "@/assets/paperclip_icon.png";
import book from "@/assets/book.svg";
import school from "@/assets/school.jpg";
import manageUsers from "@/assets/manage_users.jpg";
import attendanceIcon from "@/assets/attendance.jpg";
import analyticsIcon from "@/assets/analytics.jpg";

const Header = () => {
  const pathname = usePathname();
  return (
    <div
      className={`flex flex-wrap justify-between items-center mt-2 py-5 px-5`}
    >
      <div
        className={`mb-2 flex justify-start items-center ml-12`}
      >
        {pathname === "/" ? (
          <Image src={homeSVG} alt="Home" height={30} width={30} />
        ) : pathname === "/classes" || pathname === "/my-class" ? (
          <Image src={book} alt="Classes" height={30} width={30} />
        ) : pathname === "/bookings" ? (
          <Image src={school} alt="Bookings" height={30} width={30} />
        ) : pathname === "/assignments" ? (
          <Image src={paperClip} alt="Assignments" height={30} width={30} />
        ) : pathname === "/admin/manage-users" ? (
          <Image src={manageUsers} alt="Manage Users" height={30} width={30} />
        ) : pathname === "/admin/attendance" ? (
          <Image src={attendanceIcon} alt="Attendance" height={30} width={30} />
        ) : pathname === "/admin/analytics" ? (
          <Image src={analyticsIcon} alt="Analytics" height={30} width={30} />
        ) : (
          <div></div>
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
