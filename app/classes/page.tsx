import React from "react";
import Card from "../../components/Card"

const page = () => {
  return (
    <div className="flex mx-6 px-5">
        <Card
          subject="Math"
          path={`/classes/math`}
          color="#FFB6C1 "
        />
        <Card
          subject="Physics"
          path={`/classes/phy`}
          color="#87CEEB"
        />
        <Card
          subject="Chemistry"
          path={`/classes/chem`}
          color="#90EE90"
        />
        <Card
          subject="Biology"
          path={`/classes/bio`}
          color="#FFD700"
        />
    </div>
  );
};

export default page;
