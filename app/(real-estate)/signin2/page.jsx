// "use client";

// import { useState } from "react";
// import SignInForm from "@/components/ui/signin-form";


// // export default function Signin() {
// //   return (
// //     <div className="flex md:min-h-[70vh] min-h-[60vh] w-full items-center justify-center md:p-6">
// //       <SignInForm />
   
// //     </div>
// //   );
// // }
// export default function Signin() {
//   return (
//      <div className="flex min-h-screen w-full items-center justify-center">
//       <SignInForm />
//     </div>
//   );
// }
"use client";
import { useEffect } from 'react';
import SignInForm from "@/components/ui/signin-form";

export default function Signin() {
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
      <SignInForm />
    </div>
  );
}
