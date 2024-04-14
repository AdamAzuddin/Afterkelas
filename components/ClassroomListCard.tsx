import React from "react";
import { ListItemButton, ListItemText, List, Box } from "@mui/material";

interface ClassroomListItemProps {
  classroomUid: string;
}

const ClassroomListItem: React.FC<ClassroomListItemProps> = ({
  classroomUid,
}) => {
  const handleClick = () => {
    // Construct the dynamic route path based on the subject name and teacher's UID
    const path = `/classroom/${encodeURIComponent(classroomUid)}`;
    // Navigate to the dynamic route
    if (typeof window !== "undefined") {window.location.href = path;}
  };

  return (
    <Box
      sx={{
        borderRadius: 5,
        border: 1,
        borderColor: 'grey.300',
        padding: 2,
        width: 200,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3
      }}
    >
      <List>
        <ListItemButton onClick={handleClick}>
          <ListItemText
          />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default ClassroomListItem;
