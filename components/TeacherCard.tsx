import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

interface TeacherCardProps {
  name: string;
  onClick: () => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ name, onClick }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: '0 auto', boxShadow: 3 }}>
      <CardActionArea onClick={onClick}>
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
