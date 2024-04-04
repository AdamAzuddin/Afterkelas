"use client"

// app/admin/page.tsx
import { Header, HomeView, SideLayout } from "@/components";
import { saveAdminData } from "@/redux/features/records/recordSlice";
import { useAppDispatch } from "@/redux/hook";
import { adminData } from "@/utils/data";
import {
  getAdminLocalStorage,
  saveAdminLocalStorage,
} from "@/utils/getLocalStorage";
import { AdminPropsWithId } from "@/utils/interface";
import { useEffect } from "react";

//TODO: Clean up admin page
const AdminPage = () => {
  const dispatch = useAppDispatch();

  const loadData = async () => {
    try {
      // Fetch data or perform any initialization required for admin page
      // For example:
      let value = getAdminLocalStorage().data;
      if (value && Array.isArray(value) && value.length > 0) {
        let adminData = value as AdminPropsWithId[];
        dispatch(saveAdminData(adminData));
      } else {
        let val = adminData as unknown as AdminPropsWithId[];
        saveAdminLocalStorage(val);
        dispatch(saveAdminData(adminData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SideLayout>
      <Header type="admin" />
      <HomeView type="admin" />
    </SideLayout>
  );
};

export default AdminPage;