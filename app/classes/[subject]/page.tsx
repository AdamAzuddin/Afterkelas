'use client'
 
import { usePathname } from 'next/navigation'
 

const Page = () => {
  // Access the dynamic route parameter
  const pathname = usePathname()
  const subject = pathname.replace('/classes/', '');

  return (
    <div>
      {/* Display the subject name as a header */}
      <h1>{subject}</h1>
      {/* Other content can be added here */}
    </div>
  );
};

export default Page;
