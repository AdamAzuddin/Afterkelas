import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, Link } from "react-router-dom";

interface LinkItem {
  text: string;
  path: string;
}

const HamburgerMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const links: Record<string, LinkItem[]> = {
    "/": [
      { text: "Home", path: "/student" },
      { text: "Classes", path: "/student/classes" },
      { text: "Assignments", path: "/student/assignments" },
    ],
    "/teacher": [
      { text: "Home", path: "/" },
      { text: "Classes", path: "/classes" },
      { text: "Assignments", path: "/assignments" },
    ],
    "/admin": [
      { text: "Home", path: "/admin" },
      { text: "Manage Users", path: "/admin/manage-users" },
      { text: "Attendance", path: "/admin/attendance" },
      { text: "Analytics", path: "/admin/analytics" },
    ],
  };

  const currentLinks: LinkItem[] = Object.entries(links).reduce(
    (acc, [key, value]) => {
      if (currentPath.startsWith(key)) {
        acc = value;
      }
      return acc;
    },
    [] as LinkItem[]
  );

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {currentLinks.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon className=" text-white text-3xl" />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default HamburgerMenu;
