"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const assignmentId = pathSegments[pathSegments.length - 1]; // Access the last segment
  return (
    <div>{assignmentId}</div>
  )
}

export default page