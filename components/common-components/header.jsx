"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Loader, LogIn, MenuIcon, User2Icon, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSetState } from "@/utils/function.utils";

const Header = () => {
  const username = useSelector((state) => state.auth.username);

  const [activeMenu, setActiveMenu] = useState(null);
  const [clickedMenu, setClickedMenu] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const [state, setState] = useSetState({
    token: null,
    group: null,
    username: null,
    logoutLoading: false,
  });

  const handleLogout = async () => {
    try {
      setState({ logoutLoading: true });
      setDialogOpen(false);
      router.push("/login");
    } catch (error) {
      localStorage.clear();
      setState({ logoutLoading: false });
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const StudentLeftSideMenu = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Property",
      url: "/property-list",
    },
    {
      title: "Profile",
      url: "/profile",
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-md sticky top-0 z-[10]"
      >
        <div className=" border-b border-gray-200">
          <div className=" container mx-auto flex items-center justify-between gap-20 ">
            {/* Logo */}
            <div className="flex justify-center">
              <Link href="https://zenwellnesslounge.com/" target="_blank">
                <Image
                  src="/assets/images/logo.png"
                  alt="logo"
                  width={60}
                  height={40}
                />
              </Link>
            </div>

            {/* Left Menu (Desktop) */}
            <nav className="hidden lg:flex space-x-6">
              {StudentLeftSideMenu.map((menu) => (
                <div
                  key={menu.title}
                  className="relative"
                  onMouseEnter={() => menu.items && setActiveMenu(menu.title)}
                  onMouseLeave={() => menu.items && setActiveMenu(null)}
                >
                  <Link
                    prefetch={true}
                    href={menu.url}
                    className="hover:text-themePurple text-[14px] font-[600] uppercase "
                  >
                    {menu.title}
                  </Link>

                  {/* Submenu with animation */}
                  <AnimatePresence>
                    {(activeMenu === menu.title ||
                      clickedMenu === menu.title) &&
                      menu.items && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute left-0 w-56 bg-white p-4 rounded-lg shadow-lg"
                          onMouseEnter={() => setActiveMenu(menu.title)}
                          onMouseLeave={() => setActiveMenu(null)}
                        >
                          {menu.items.map((item, index) => (
                            <motion.div
                              key={item.title}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                              className="mb-2"
                            >
                              <Link
                                prefetch={true}
                                href={item.url}
                                className="text-xs text-black font-[600] uppercase hover:text-themePurple"
                              >
                                {item.title}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* User Avatar Dropdown and Auth Buttons */}
            <div className="flex items-center gap-4">
              {/* Login and Register Buttons (Visible when not logged in) */}
              {!username && (
                <div className="hidden lg:flex items-center gap-3">
                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                    className="border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/signin")}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Register
                  </Button>
                </div>
              )}

              {/* User Avatar Dropdown */}
              {/* <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 rounded cursor-pointer">
                      <AvatarFallback>
                        <User2Icon />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    asChild
                    className="bg-fuchsia-100 w-[220px] p-4 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownMenuLabel className="p-0 pb-2">
                        {username && (
                          <div className="flex items-center gap-2 text-sm">
                            <Avatar className="h-8 w-8 rounded">
                              <AvatarFallback>
                                <User2Icon />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-semibold">{username}</span>
                            </div>
                          </div>
                        )}
                      </DropdownMenuLabel>
                      {username && <DropdownMenuSeparator />}
                      
                      {username ? (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              router?.push("/change-password-confirm")
                            }
                          >
                            Change Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                            Logout
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => router.push("/login")}>
                            Login
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push("/signin")}>
                            Register
                          </DropdownMenuItem>
                        </>
                      )}
                    </motion.div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}

              {/* Mobile Sheet Menu */}
              <div className="block lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <MenuIcon />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle></SheetTitle>
                    </SheetHeader>
                    <div className="flex justify-center">
                      <Link
                        href="https://zenwellnesslounge.com/"
                        target="_blank"
                      >
                        <Image
                          src="/assets/images/logo.png"
                          alt="logo"
                          width={200}
                          height={80}
                        />
                      </Link>
                    </div>
                    
                    {/* Mobile Auth Buttons */}
                    {!username && (
                      <div className="flex flex-col gap-3 mt-6 mb-6">
                        <Button
                          onClick={() => router.push("/login")}
                          variant="outline"
                          className="w-full"
                        >
                          Login
                        </Button>
                        <Button
                          onClick={() => router.push("/signin")}
                          className="w-full bg-red-500 hover:bg-red-600"
                        >
                          Register
                        </Button>
                      </div>
                    )}

                    <div className="mt-4">
                      {StudentLeftSideMenu.map((menu, index) => (
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          key={index}
                        >
                          <AccordionItem value={`item-${index + 1}`}>
                            <AccordionTrigger className="no-underline hover:no-underline uppercase text-sm">
                              {menu.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              {menu.items ? (
                                <motion.ul
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.3 }}
                                  className="pl-5 uppercase"
                                >
                                  {menu.items.map((item, itemIndex) => (
                                    <motion.li
                                      key={itemIndex}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        duration: 0.2,
                                        delay: itemIndex * 0.05,
                                      }}
                                      className="pb-2 text-sm"
                                    >
                                      <a href={item.url}>{item.title}</a>
                                    </motion.li>
                                  ))}
                                </motion.ul>
                              ) : (
                                <p className="uppercase">
                                  <a href={menu.url}>{menu.title}</a>
                                </p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="bg-white p-6 rounded-lg md:w-96 w-full">
                <DialogTitle className="text-[20px] font-semibold">
                  Confirm Logout
                </DialogTitle>
                <div className="mb-4">Are you sure you want to log out?</div>
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleCancel}
                    variant={"outline"}
                    className="px-4 py-2 border-themeGreen hover:border-themeGreen text-themeGreen hover:text-themeGreen bg-none rounded text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-themeGreen hover:bg-themeGreen text-white rounded text-sm"
                  >
                    {state.logoutLoading ? <Loader /> : "Confirm"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;