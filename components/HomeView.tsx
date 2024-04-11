"use client"
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hook';
import { HeaderProps, StudentProps, TeacherProps, AdminProps } from '@/utils/interface';

const HomeView = ({ type }: HeaderProps) => {
  const { teacherData, studentData, adminData, isSidebarOpen, searchTerm } =
    useAppSelector((state) => state.record);
  const [recordData, setRecordData] = useState<TeacherProps[] | StudentProps[] | AdminProps[]>([]);

  const getFetchData = () => {
    if (type === 'teacher') setRecordData(teacherData);
    else if (type === 'admin') setRecordData(adminData);
    else setRecordData(studentData);

  };

  useEffect(() => {
    getFetchData();
  }, [type, teacherData, studentData]); // Removed loading dependency

  if (recordData.length === 0 && searchTerm) {
    return (
      <div className="flex justify-center items-center text-center text-lg text-gray-700">
        <p className="capitalize">
          No <span className="font-bold">{type}</span> records found.
        </p>
      </div>
    );
  }

  return (
    <div className={`${!isSidebarOpen ? 'mx-6' : 'mx-1'}`}>
      {/* Save for admin later
      <div className={`record__container ${!isSidebarOpen ? 'ml-[1em]' : 'ml-0'}`}>
        {recordData?.map((val: TeacherProps | StudentProps | AdminProps, i: number) => (
          <div
            key={i}
            className="w-full h-auto sm:h-[180px] border-2 border-gray-100 shadow-lg mb-5 p-3"
          >
            <h1 className="text-blue-700 font-bold text-md sm:text-lg pb-2 uppercase">
              {type === 'teacher' && 'title' in val
                ? `Name: ${val?.title}. ${val?.name} ${val?.surname}`
                : `Name: ${val?.name} ${val?.surname}`}
            </h1>
            <h2 className="text-gray-900 font-normal text-md pb-2">
              {type === 'teacher' && 'title' in val
                ? `Teacher Number: ${val?.teacherNumber}`
                : `Student Number: ${val?.studentNumber}`}
            </h2>
            <h2 className="text-gray-900 font-normal text-md pb-2">
              National ID Number: {val?.nationalIdNumber}
            </h2>
            {type === 'teacher' && 'title' in val && (
              <h2 className="text-gray-900 font-normal text-md pb-2">
                Salary: ₦{formatCurrency(val?.salary)}
              </h2>
            )}
            <h6 className="text-red-600 text-sm">
              <span className="text-gray-900">Date of birth: </span>
              {moment(val?.dob).format('LL')}
            </h6>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default HomeView;
