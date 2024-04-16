// AssignmentItem.js

import React from "react";
import { ListItem, ListItemText, Button } from "@mui/material";
import Link from "next/link";
import { Assignment } from "@/utils/interface";

interface AssignmentItemProps {
    assignment: Assignment;
    userType: string;
  }

const AssignmentCard:React.FC<AssignmentItemProps> = ({ assignment,userType }) => {
  console.log("User type: " + userType);
  const { assignmentId, title, dueDate, description, file } = assignment;
  let buttonRef = "";
  let buttonText = "";
  if (userType=="student"){
    buttonRef = `/assignments/assignment/${assignmentId}`
    buttonText = "Submit assignment"
  } else if (userType=="teacher"){
    buttonRef = `/assignments/submission/${assignmentId}`
    buttonText = "View submissions"
  }

  return (
    <ListItem className="border border-black rounded cursor-pointer">
      <Link href={buttonRef}>
          <ListItemText primary={`Title: ${title}`} secondary={`Due Date: ${dueDate}`} />
          {description && <ListItemText primary={`Description: ${description}`} />}
          
          <Button variant="contained" color="primary" href={buttonRef} target="_blank">{buttonText}</Button>
      </Link>
    </ListItem>
  );
};

export default AssignmentCard;
