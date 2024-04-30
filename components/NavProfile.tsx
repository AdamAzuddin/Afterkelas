"use client";

import userSvg from "@/assets/userIcon.svg";
import Link from "next/link";
import Image from "next/image";

const NavProfile = () => {
  return (
    <div className="flex justify-start items-center">
      <div className="flex justify-start items-center mx-3">
        <Link href="/profile">
            <Image
              priority
              src={userSvg}
              alt="profile-image"
              className="w-[25px] h-[25px] rounded-full"
            />
        </Link>
      </div>
    </div>
  );
};

export default NavProfile;
