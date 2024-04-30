import React from "react";
import Card from "../../components/Card";

const page = () => {
  return (
    <div className="flex mx-6 px-5 flex-wrap">
      <Card subject="Math" color="#FFB6C1 " />
      <Card subject="Physics" color="#87CEEB" />
      <Card subject="Chemistry" color="#90EE90" />
      <Card subject="Biology" color="#FFD700" />
      <Card subject="Additional Math" color="#9370DB" />
      <Card subject="Accounting" color="#4682B4" />
      <Card subject="Economics" color="#F08080" />
    </div>
  );
};

export default page;
