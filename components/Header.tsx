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
      </div>
    </div>
  );
};

export default Header;
