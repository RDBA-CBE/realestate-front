import CustomSelect from "@/components/common-components/dropdown";
import { ArrowRight, Home, MapPin, Search } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HomeBanner = ({ propertyTypeList = [], cityList = [] }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Sale");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchText, setSearchText] = useState("");

  const propertyTypeOptions = propertyTypeList.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const cityOptions = cityList.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab !== "All") params.set("type", activeTab.toLowerCase());
    if (selectedCity) params.set("location", selectedCity);
    if (selectedType) params.set("propertyType", selectedType);
    if (searchText) params.set("search", searchText);
    router.push(`/property-list?${params.toString()}`);
  };

  

  return (
    <section className="adv-wrapper relative lg:min-h-[90vh] py-20 lg:py-0 flex items-center justify-center overflow-hidden">
      {/* <div className="
    absolute left-0 top-0 h-full w-[60%] z-0
    bg-gradient-to-rb
    from-black/65
    via-black/35
    to-transparent
    backdrop-blur-[5px]
  "></div> */}
       <div className="section-wid adv-container relative z-10 w-full gap-10 items-center overflow-visible">
        {/* Left Content */}
        <div className="adv-left">
          <h1 className="adv-title w-full ">
            Discover Your  <br /> Perfect Home in  <br /> Paradise
          </h1>
          <p className="adv-subtitle">
            Browse luxury properties, modern apartments, and exclusive villas in the world&apos;s most desirable locations
          </p>
          <button className="adv-btn lg:mb-12"  > <a href="/property-list">Find Your Home</a></button>
           <button className="!border !border-white !bg-transparent adv-btn  hover:!bg-white hover:!text-black lg:mb-12 ms-4"  > <a href="mailto:support@gmail.com">Contact Us</a></button>

          {/* Tabs */}
          <div className="adv-tabs flex gap-8 mt-12 lg:mt-14 lg:ms-[25px]">
            {["Sale", "Lease", "All"].map((tab, i) => (
              <span
                key={i}
                onClick={() => setActiveTab(tab)}
                className={`adv-tab cursor-pointer ${activeTab === tab ? "active" : ""}`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Search Bar */}
          <div className="adv-searchbar flex items-center justify-between gap-2 mt-6">
             <div className="flex  flex-1 gap-3 items-center lg:items-start px-4">
              <Search className="text-dred w-4 h-4 md:w-5 md:h-5  md:mt-0.5 shrink-0" />
              <div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  // placeholder={`Search ${
                  //   activeTab === "All"
                  //     ? "properties"
                  //     : activeTab === "Sale"
                  //       ? "properties for sale"
                  //       : "properties for lease"
                  // }...`}
                  placeholder="Search Properties"
                  className="adv-field-input placeholder:lg:text-[15px] placeholder:text-[#737373]"
                />
              </div>
            </div>

            <div className="flex  flex-1 gap-3 items-center lg:items-start px-4">
              <MapPin className="text-dred w-4 h-4 md:w-5 md:h-5  md:mt-1.5 shrink-0" />
              <div>
                {/* <p className="adv-field-label">Location</p> */}
                <CustomSelect
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(selected) => setSelectedCity(selected ? selected.value : "")}
                  className="custom-select placeholder:lg:text-[16px]"
                  placeholder="Choose City"
                  
                />
              </div>
            </div>

            <div className="adv-divider"></div>

            <div className="flex flex-1 gap-3 items-center lg:items-start px-4">
              <Home className="text-dred w-4 h-4 md:w-5 md:h-5 md:mt-1.5 shrink-0" />
              <div>
                {/* <p className="adv-field-label">Property Type</p> */}
                <CustomSelect
                  options={propertyTypeOptions}
                  value={selectedType}
                  onChange={(selected) => setSelectedType(selected ? selected.value : "")}
                  className="custom-select placeholder:lg:text-[16px]"
                  placeholder="Choose Property Type"
                />
                {/* <select className="adv-field-input cursor-pointer">
                  <option value="">Choose type...</option>
                  <option value="sale">For Sale</option>
                  <option value="lease">For Lease</option>
                </select> */}
              </div>
            </div>

            <div className="adv-divider"></div>

           

            <button className="adv-search-btn" onClick={handleSearch}>
              <ArrowRight className="w-5 h-5 search-ico" />
              <p className="adv-search-label">Search</p>
            </button>
          </div>
        </div>

        {/* Right Images — hidden on mobile */}
        {/* <div className="adv-right hidden md:flex relative gap-5">
          <div className="flex flex-col gap-5 mt-[-50px]">
            <img
              src="assets/images/real-estate/home/home-banner.png"
              alt=""
              className="adv-img w-full h-auto  object-cover"
            />
           
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HomeBanner;
