import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";
import Link from "next/link";

const PleaseSignIn = () => {
  return (
    <div>
      <Typography variant="body1">Please sign in</Typography>
      <Link href={"/auth/sign-in"} passHref>
        <Button variant="contained" color="primary">
          Sign In
        </Button>
      </Link>
    </div>
  );
};

export default PleaseSignIn;
