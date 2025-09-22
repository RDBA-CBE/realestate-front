// "use client";

// import LoginForm from "@/components/ui/login-form";
// import { useState } from "react";

// export default function Login() {
//   return (
//     <div className="flex  md:min-h-[40vh] min-h-[60vh] w-full items-center justify-center md:p-6">
//       <LoginForm />
   
//     </div>
//   );
// }

"use client";
import { useEffect } from 'react';
import LoginForm from "@/components/ui/login-form";

export default function Login() {
  useEffect(() => {
      // Disable page scroll
      document.body.style.overflow = 'hidden';
  
      // Re-enable scroll on cleanup/unmount
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);
  return (
    <div className="flex w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
