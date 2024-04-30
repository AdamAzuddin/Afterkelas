"use client";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../app/firebase"; // Adjust the path as per your project structure
import { UserDetails } from "@/utils/interface";

interface LinkItem {
  text: string;
  path: string;
}

const HamburgerMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [userType, setUserType] = React.useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setUser(user);
      if (user) {
        try {
          if (!db) {
            console.error("Firebase is not initialized.");
            return;
          }

          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(usersRef, where("uid", "==", user.uid))
          );

          if (!querySnapshot.empty) {
            // Assuming there's only one document with the given uid
            const userData = querySnapshot.docs[0].data() as UserDetails; // Cast to UserDetails
            setUserType(userData.userType);
          } else {
            console.log("No user document found with the provided uid.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserType(null); // Reset userType if no user is signed in
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const links: Record<string, LinkItem[]> = userType
    ? {
        student: [
          { text: "Home", path: "/" },
          { text: "Classes", path: "/classes" },
          { text: "Bookings", path: "/bookings" },
          { text: "Assignments", path: "/assignments" },
        ],
        teacher: [
          { text: "Home", path: "/" },
          { text: "My class", path: "/my-class" },
          { text: "Bookings", path: "/bookings" },
          { text: "Assignments", path: "/assignments" },
        ],
        admin: [
          { text: "Home", path: "/admin" },
          { text: "Manage Users", path: "/admin/manage-users" },
          { text: "Attendance", path: "/admin/attendance" },
          { text: "Analytics", path: "/admin/analytics" },
        ],
      }
    : {
        default: [
          { text: "Home", path: "/" },
          { text: "Classes", path: "/classes" },
          { text: "Assignments", path: "/assignments" },
        ],
      };

  const currentUserLinks = userType ? links[userType] ?? [] : [];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
      <List>
        {currentUserLinks.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            onClick={() => handleLinkClick(item.path)}
          >
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  const handleLinkClick = (path: string) => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        <MenuIcon className=" text-white text-3xl" />
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default HamburgerMenu;
