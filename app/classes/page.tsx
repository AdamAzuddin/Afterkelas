import React from "react";
import Card from "../../components/Card"

const page = () => {
  return (
    <div className="flex mx-6 px-5">
        <Card
          subject="Math"
          color="#FFB6C1 "
        />
        <Card
          subject="Physics"
          color="#87CEEB"
        />
        <Card
          subject="Chemistry"
          color="#90EE90"
        />
        <Card
          subject="Biology"
          color="#FFD700"
        />
    </div>
  );
};

export default page;
