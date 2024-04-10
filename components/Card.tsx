import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

interface OutlinedCardProps {
  subject: string;
  path: string;
  color: string;
}

const OutlinedCard = ({ subject, path, color }: OutlinedCardProps) => {
  return (
    <Link href={path} passHref>
      <Box component="a" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card
          variant="outlined"
          className='m-4'
          sx={{
            width: '20vw', // 20% of viewport width
            height: '20vw', // 20% of viewport width
            backgroundColor: color,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: '20px'
          }}
        >
          <Typography variant="h5" component="div">
            {subject}
          </Typography>
        </Card>
      </Box>
    </Link>
  );
};

export default OutlinedCard;
