import React from "react";
import Card from "../../../components/Card"

const page = () => {
  return (
    <div className="mx-6">
        <Card
          subject="Math"
          path={`/student/classes/math`}
          color="#FFB6C1 "
        />
        <Card
          subject="Physics"
          path={`/student/classes/phy`}
          color="#87CEEB"
        />
        <Card
          subject="Chemistry"
          path={`/student/classes/chem`}
          color="#90EE90"
        />
        <Card
          subject="Biology"
          path={`/student/classes/bio`}
          color="#FFD700"
        />
    </div>
  );
};

export default page;
