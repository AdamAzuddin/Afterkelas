"use client";

import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  setLoader,
} from "@/redux/features/records/recordSlice";
import HamburgerMenu from "./HamburgerMenu";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((state) => state.record);
  return (
    <div className="w-full h-[55px] relative bg-[#222]">
      <div
        className={`main-container flex flex-row ${
          !isSidebarOpen ? "justify-start" : "justify-between"
        } items-center`}
      >
        <HamburgerMenu />
        <Link
          href="/"
          onClick={() => dispatch(setLoader(true))}
          className="w-72 h-[55px]"
          style={{ fontFamily: "Lobster Two" }}
        >
          <h1
            className={`text-gray-50 text-3xl font-bold pt-2.5`}
          >
            Afterkelas
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
