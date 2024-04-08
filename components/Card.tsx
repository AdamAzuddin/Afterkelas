import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const OutlinedCard = ({ subject, path }: { subject: string; path: string }) => {
  const cardContent = (
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Subject
      </Typography>
      <Typography variant="h5" component="div">
        {subject}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Description
      </Typography>
      <Typography variant="body2">
        Brief description of the subject.
      </Typography>
    </CardContent>
  );

  return (
    <Box>
      <Card variant="outlined">
        {path ? (
          <Link href={path} passHref>
            <Button component="a" style={{ textDecoration: 'none', color: 'inherit' }}>
              {cardContent}
            </Button>
          </Link>
        ) : (
          cardContent
        )}
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default OutlinedCard;
