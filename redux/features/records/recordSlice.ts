import { createSlice } from "@reduxjs/toolkit";
import { IIProps, StudentProps, TeacherProps, AdminProps } from "@/utils/interface";
import {
  saveStudentLocalStorage,
  saveTeacherLocalStorage,
  saveAdminLocalStorage
} from "@/utils/getLocalStorage";
import { uniqueId } from "@/utils/data";

const initialState: IIProps = {
  loading: true,
  isSidebarOpen: false,
  teacherData: [] as TeacherProps[],
  studentData: [] as StudentProps[],
  adminData: [] as AdminProps[],
  searchTerm: "",
};

export const recordSlice = createSlice({
  name: "record",

  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.loading = action.payload;
    },

    openSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    saveTeacherData: (state, action) => {
      state.teacherData = action.payload;
    },

    saveStudentData: (state, action) => {
      state.studentData = action.payload;
    },

    saveAdminData: (state, action) => {
      state.adminData = action.payload;
    },

    addTeacherData: (state, action) => {
      let value = {
        ...action.payload,
        id: uniqueId(),
      };
      state.teacherData = [...state.teacherData, value];
      saveTeacherLocalStorage(state.teacherData);
    },

    addStudentData: (state, action) => {
      let value = {
        ...action.payload,
        id: uniqueId(),
      };
      state.studentData = [...state.studentData, value];
      saveStudentLocalStorage(state.studentData);
    },

    addAdminData: (state, action) => {
      let value = {
        ...action.payload,
        id: uniqueId(),
      };
      state.adminData = [...state.adminData, value];
      saveAdminLocalStorage(state.adminData);
    },
  },
});

export const {
  setLoader,
  openSidebar,
  saveTeacherData,
  addTeacherData,
  addStudentData,
  saveStudentData,
  saveAdminData,
  addAdminData,
  setSearchTerm,
} = recordSlice.actions;

export default recordSlice.reducer;
