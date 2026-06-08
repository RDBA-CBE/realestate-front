"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  GitCompareArrowsIcon,
  Heart,
  Home,
  Loader,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MenuIcon,
  Settings,
  User,
  User2,
  User2Icon,
  UserPlus,
} from "lucide-react";
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
import { usePathname } from "next/navigation";

const Header = () => {
  const username = useSelector((state) => state.auth.username);

  const [activeMenu, setActiveMenu] = useState(null);
  const [clickedMenu, setClickedMenu] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [state, setState] = useSetState({
    token: null,
    logoutLoading: false,
    selectedLocation: null,
  });

  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/home";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedLocation = localStorage.getItem("userLocation");

    const parsedLocation = savedLocation ? JSON.parse(savedLocation) : null;

    setState({
      token,
      selectedLocation: parsedLocation?.value === "all" ? null : parsedLocation,
    });

    const onLocationChanged = (e) => {
      setState({ selectedLocation: e.detail });
    };
    window.addEventListener("locationChanged", onLocationChanged);
    return () =>
      window.removeEventListener("locationChanged", onLocationChanged);
  }, []);

  const handleLocationClick = () => {
    if (isHomePage) {
      window.dispatchEvent(new Event("openLocationPicker"));
    } else {
      router.push("/");
    }
  };

  const handleLogout = async () => {
    try {
      setState({ logoutLoading: true });
      const refresh = localStorage.getItem("refresh");
      await Models.auth.logout({ refresh });
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      localStorage.clear();
      window.location.href = "/login";
    } finally {
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
      title: "Compare",
      url: "/compare",
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white sticky top-0 z-[50]"
      >
        <div className="section-wid  web-header">
          <div className="  flex justify-between items-center gap-3 md:gap-20 ">
            <div className="flex items-center gap-20">
              {/* Logo */}
              <Link className="flex justify-center gap-3 py-3 md:py-4" href="/">
                {/* <Link href="home">
                  <Image
                    src="/assets/images/logo.png"
                    alt="logo"
                    width={60}
                    height={40}
                  />
                </Link> */}

                <img
                  src="/assets/images/real-estate/home/boom-logo.png"
                  alt="Logo"
                  className="h-8 xs:h-10 sm:h-12 w-auto object-contain"
                />
              </Link>

              {/* Left Menu (Desktop) */}
              <nav className="hidden xl:flex space-x-6">
                {StudentLeftSideMenu.map((menu) => {
                  const isActive =
                    pathname === menu.url ||
                    (menu.url !== "/" && pathname.startsWith(menu.url));
                  return (
                    <div
                      key={menu.title}
                      className="relative"
                      onMouseEnter={() =>
                        menu.items && setActiveMenu(menu.title)
                      }
                      onMouseLeave={() => menu.items && setActiveMenu(null)}
                    >
                      <Link
                        prefetch={true}
                        href={menu.url}
                        className={`text-[16px] font-[500] nav-ti transition-colors relative pb-1 ${
                          isActive
                            ? "text-dred after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-dred after:rounded-full"
                            : "hover:text-dred"
                        }`}
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
                                    className="text-xs text-black font-[600] uppercase hover:text-themeColor1"
                                  >
                                    {item.title}
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="flex items-center gap-2 md:gap-3">
                {/* <div className="flex items-center gap-3 me-4 hidden xl:flex">
                  <Mail className="w-4 h-4 text-dred" />
                  <Link
                    href={"mailto:support@realestate.com"}
                    className="font-[500] text-[16px] nav-ti"
                  >
                    support@realestate.com
                  </Link>
                </div> */}

                {state.token && state.selectedLocation && isHomePage ? (
                  <button
                    onClick={handleLocationClick}
                    className="hidden lg:flex items-center gap-1.5 me-2 px-3 py-1 rounded-full bg-[#9b0f09]/10 hover:bg-[#9b0f09]/20 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-dred shrink-0" />
                    <span className="text-sm font-medium text-dred">
                      {state.selectedLocation.label}
                    </span>
                  </button>
                ) : state.token && !state.selectedLocation && isHomePage ? (
                  <button
                    onClick={handleLocationClick}
                    className="hidden lg:flex items-center gap-1.5 me-2 px-3 py-1 rounded-full border border-dashed border-[#9b0f09]/50 hover:bg-[#9b0f09]/10 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-dred shrink-0" />
                    <span className="text-sm font-medium text-dred">
                      Choose Location
                    </span>
                  </button>
                ) : null}

                {state.token && state.selectedLocation  ? (
                  <button
                    onClick={handleLocationClick}
                    className="flex lg:hidden items-center gap-1  px-1.5 py-1 rounded-full bg-[#9b0f09]/10 hover:bg-[#9b0f09]/20 transition-colors cursor-pointer"
                    title={state.selectedLocation.label}
                  >
                    {/* <MapPin className="w-2.5 h-2.5 text-dred shrink-0" /> */}
                    <span className="text-[11px] font-medium text-dred">
                      {state.selectedLocation.label}
                    </span>
                  </button>
                ) : state.token && !state.selectedLocation && isHomePage ? (
                  <button
                    onClick={handleLocationClick}
                    className="flex lg:hidden items-center gap-1.5 px-1.5 py-1.5 rounded-full border border-dashed border-[#9b0f09]/50 hover:bg-[#9b0f09]/10 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-dred shrink-0" />
                  </button>
                ) : null}

                {/* <div className="group p-1 rounded-full  relative transition-all duration-300 cursor-pointer">
  
                    <span className="absolute inset-0 rounded-full border-2 border-dred scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>

                    <img
                      src="/assets/images/real-estate/home/ai-search-2.png"
                      alt=""
                      className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:scale-105"
                      onClick={() => router.push("/ai-search")}
                    />
                  </div> */}

                {/* <div className="p-1 rounded-full group cursor-pointer">
                    <img
                      src="/assets/images/real-estate/home/ai-search-2.png"
                      alt=""
                      onClick={() => router.push("/ai-search")}
                      className="w-9 h-9 transform transition-transform duration-500 ease-out group-hover:scale-[1.3]"
                    />
                  </div> */}

                {/* <Button
                  onClick={() => router.push("/ai-search")}
                  className="bg-color2 hover:bg-color2 text-white rounded-full  hover:text-white hidden md:block"
                >
                  AI Search
                </Button> */}
                <Button
                  onClick={() => router.push("/post-property")}
                  variant="outline"
                  className="bg-color2 hover:bg-color2 !text-white hover:!text-white rounded-full hidden md:block nav-ti font-[400] mt-[-1px]"
                >
                  Post Property
                </Button>

                {state.token ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-2 focus:outline-none">
                        <Avatar className="h-[30px] w-[30px] md:h-9 md:w-9">
                          <AvatarFallback>
                            <User2 className="text-white w-4 h-4 md:w-5 md:h-5" />
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[280px]" align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <User className="mr-2 h-4 w-4 text-dred" />
                        <span>Profile</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => router.push("/wishlist")}
                      >
                        <Heart className="mr-2 h-4 w-4 text-dred" />
                        <span>Wishlist</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => router.push("/compare")}>
                        <GitCompareArrowsIcon className="mr-2 h-4 w-4 text-dred" />
                        <span>Compare</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDialogOpen(true)}
                        className="text-dred focus:text-dred"
                      >
                        <LogOut className="mr-2 h-4 w-4 text-dred" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    {/* // !username && ( */}
                    <div className="hidden xl:flex items-center gap-3">
                      <Button
                        onClick={() => router.push("/login")}
                        variant="outline"
                        className="px-6 rounded-full bg-lred hover:bg-color2 border-[#9b0f09]  text-dred hover:text-white"
                      >
                        Login
                      </Button>
                      {/* <Button
                        onClick={() => router.push("/signin")}
                        className="rounded-full bg-color2 hover:bg-color2 text-white"
                      >
                        Register
                      </Button> */}
                    </div>
                  </>
                )}
                <div className="p-1 rounded-full group hidden xl:block">
                  <img
                    src="/assets/images/real-estate/home/ai-search-1.png"
                    alt=""
                    className="w-10 h-10 transition-transform duration-500  ease-out group-hover:scale-[1.2]"
                    onClick={() => router.push("/ai-search")}
                  />
                </div>

                <div className="block xl:hidden">
                  <Sheet open={open} onOpenChange={setOpen}>
                    <div className="flex items-center gap-2 md:gap-3">
                      {/* AI Search icon */}
                      <img
                        src="/assets/images/real-estate/home/ai-search-1.png"
                        alt="AI Search"
                        className="w-8 h-8 cursor-pointer"
                        onClick={() => router.push("/ai-search")}
                      />
                      {/* Profile / Login icon */}
                      {/* {state.token ? null : (
                        <button
                          onClick={() => router.push("/login")}
                          className="flex items-center justify-center w-8 h-8 rounded-full border border-dred"
                        >
                          <LogIn className="text-dred w-4 h-4" />
                        </button>
                      )} */}
                      <SheetTrigger asChild>
                        <MenuIcon className="text-dred cursor-pointer w-6 h-6 xs:w-auto xs:h-auto" />
                      </SheetTrigger>
                    </div>

                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>
                          {/* <div className="flex justify-center gap-3 py-4"> */}
                          <img
                            src="/assets/images/real-estate/home/boom-logo.png"
                            alt="Logo"
                            className="h-10 w-auto object-contain -mt-2"
                            onClick={() => {
                              router.push("/");
                              setOpen(false);
                            }}
                          />
                          {/* </div> */}
                        </SheetTitle>
                      </SheetHeader>
                      {/* <div className="flex justify-between items-center "> */}
                      {/* <Link href="home">
                          <Image
                            src="/assets/images/logo.png"
                            alt="logo"
                            width={60}
                            height={80}
                          />
                        </Link> */}
                      {/* <div className="flex justify-center gap-3 py-4">
                          <img
                            src="/assets/images/real-estate/home/boom-logo.png"
                            alt="Logo"
                            className="h-10 w-auto object-contain"
                            onClick={() => { router.push("/")
                               setOpen(false)}}
                          />
                        </div> */}

                      {/* {!state.token && (
                          <Button
                            onClick={() => router.push("/login")}
                            variant="outline"
                            // className="w-full"
                          >
                            Login
                          </Button>
                        )} */}
                      {/* </div> */}

                      {/* Mobile Auth Buttons */}
                      {/* {!username && ( */}
                      {/* <div className="flex flex-col gap-3 mt-6 mb-6">
                      <Button
                        onClick={() => router.push("/login")}
                        variant="outline"
                        className="w-full"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => router.push("/signin")}
                        className="w-full bg-color2 hover:bg-color2"
                      >
                        Register
                      </Button> */}
                      {/* </div> */}
                      {/* )} */}

                      <div className="mt-4">
                        {StudentLeftSideMenu.map((menu, index) => {
                          const isActive =
                            pathname === menu.url ||
                            (menu.url !== "/" && pathname.startsWith(menu.url));
                          return (
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              key={index}
                            >
                              <AccordionItem value={`item-${index + 1}`}>
                                <AccordionTrigger
                                  className={`no-underline hover:no-underline uppercase text-sm pb-4${
                                    menu.items?.length > 0
                                      ? ""
                                      : "[&>svg]:hidden"
                                  } ${isActive ? "text-dred" : ""}`}
                                  onClick={() => {
                                    if (!menu.items?.length) {
                                      router.push(menu.url);
                                      setOpen(false);
                                    }
                                  }}
                                >
                                  {menu.title}
                                </AccordionTrigger>
                                {menu.items?.length > 0 && (
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
                                            <a
                                              href={item.url}
                                              onClick={() => setOpen(false)}
                                            >
                                              {item.title}
                                            </a>
                                          </motion.li>
                                        ))}
                                      </motion.ul>
                                    ) : (
                                      <p className="uppercase">
                                        <a href={menu.url}>{menu.title}</a>
                                      </p>
                                    )}
                                  </AccordionContent>
                                )}
                              </AccordionItem>
                            </Accordion>
                          );
                        })}
                        {/* Login + Post Property buttons inside sidebar */}
                        <div className="flex flex-col gap-3 mt-8">
                          {!state.token ? (
                            <Button
                              onClick={() => {
                                router.push("/login");
                                setOpen(false);
                              }}
                              variant="outline"
                              className="w-full rounded-full bg-lred border-[#9b0f09] text-dred hover:bg-color2 hover:text-white"
                            >
                              <LogIn className="w-4 h-4 mr-2" /> Login
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                router.push("/profile");
                                setOpen(false);
                              }}
                              variant="outline"
                              className="w-full rounded-full border-[#9b0f09] text-dred hover:bg-color2 hover:text-white"
                            >
                              <User className="w-4 h-4 mr-2" /> My Profile
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              router.push("/post-property");
                              setOpen(false);
                            }}
                            className="w-full rounded-full bg-dred hover:bg-[#7d0c07] text-white"
                          >
                            Post Property
                          </Button>
                        </div>

                        <div className="flex items-center gap-3 me-4 mt-6 lg:flex">
                          <Mail className="w-4 h-4 text-dred" />
                          <Link
                            href={"mailto:support@realestate.com"}
                            className="font-normal text-[16px]"
                          >
                            support@realestate.com
                          </Link>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            {/* User Avatar Dropdown and Auth Buttons */}
            {/* <div className="flex items-center gap-4"> */}
            {/* Login and Register Buttons (Visible when not logged in) */}
            {/* {!username && (
                <div className="hidden xl:flex items-center gap-3">
                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                    className="border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/signin")}
                    className="bg-color2 hover:bg-color2 text-white"
                  >
                    Register
                  </Button>
                </div>
              )} */}

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

            {/* </div> */}

            {/* Logout Confirmation Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="bg-white p-8 rounded-2xl max-w-sm w-full">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#fff6f6] flex items-center justify-center">
                    <LogOut className="w-6 h-6 text-[#9b0f09]" />
                  </div>
                  <DialogTitle className="text-lg font-bold text-black">
                    Sign Out
                  </DialogTitle>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to sign out of your account?
                  </p>
                  <div className="flex gap-3 w-full pt-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 rounded-xl border-gray-200 text-black hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className="flex-1 rounded-xl bg-[#9b0f09] hover:bg-[#7d0c07] text-white"
                    >
                      {state.logoutLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        "Sign Out"
                      )}
                    </Button>
                  </div>
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
