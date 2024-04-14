// AssignmentItem.js

import React from "react";
import { ListItem, ListItemText, Button } from "@mui/material";
import Link from "next/link";
import { Assignment } from "@/utils/interface";

interface AssignmentItemProps {
    assignment: Assignment;
  }

const AssignmentCard:React.FC<AssignmentItemProps> = ({ assignment }) => {
  const { assignmentId, title, dueDate, description, file } = assignment;

  return (
    <ListItem className="border border-black rounded cursor-pointer">
      <Link href={`/assignments/assignment/${assignmentId}`}>
          <ListItemText primary={`Title: ${title}`} secondary={`Due Date: ${dueDate}`} />
          {description && <ListItemText primary={`Description: ${description}`} />}
          {file && (
            <Button variant="contained" color="primary" href={file} target="_blank">
              View File
            </Button>
          )}
      </Link>
    </ListItem>
  );
};

export default AssignmentCard;
