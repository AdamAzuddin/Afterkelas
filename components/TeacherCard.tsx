import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

interface TeacherCardProps {
  name: string;
  uid: string;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ name, uid }) => {
  const handleCardClick = () => {
    // Construct the dynamic route path based on the subject name and teacher's UID
    const path = `/classes/${encodeURIComponent(name.toLowerCase())}/${uid}`;
    // Navigate to the dynamic route
    window.location.href = path;
  };

  return (
    <Card sx={{ maxWidth: 300, margin: '0 auto', boxShadow: 3 }}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TeacherCard;
