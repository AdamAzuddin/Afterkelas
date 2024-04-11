"use client"
import React from "react";
import { usePathname } from "next/navigation";

const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/'); // Split the pathname into segments
  const teacherId = pathSegments[pathSegments.length - 1]; // Access the last segment

  console.log(teacherId);
  return <div>page</div>;
};

export default page;
