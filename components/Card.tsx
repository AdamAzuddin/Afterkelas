import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface OutlinedCardProps {
  subject: string;
  path: string;
  color: string;
}

const OutlinedCard = ({ subject, path, color }: OutlinedCardProps) => {
  return (
    <Box>
      <Card
        variant="outlined"
        sx={{
          width: '20vw', // Adjust the width for square shape
          height: '20vw', // Adjust the height for square shape
          backgroundColor: color,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {path ? (
          <Link href={path} passHref>
            <Button component="a" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h5" component="div">
                {subject}
              </Typography>
            </Button>
          </Link>
        ) : (
          <Typography variant="h5" component="div">
            {subject}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default OutlinedCard;
