import CustomSelect from "@/components/common-components/dropdown";
import { ArrowRight, Home, MapPin, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Models from "@/imports/models.import";

const HomeBanner = ({locationLabel}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Sale");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchText, setSearchText] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [propertyTypeList, setPropertyTypeList] = useState([]);

  useEffect(() => {
    const cityValue = locationLabel?.value ? String(locationLabel.value) : "";
    setSelectedCity(cityValue);

    // Immediately sync the locationList with the selected city from prop
    // This ensures the label is available to CustomSelect even before API fetch
    if (locationLabel && cityValue) {
      setLocationList((prev: any) => {
        if (prev.some((loc: any) => loc.value === cityValue)) return prev;
        return [{ label: locationLabel.label, value: cityValue }, ...prev];
      });
    } else if (!locationLabel) {
      setSelectedCity("");
    }
  }, [locationLabel]);

  useEffect(() => {
    fetchDynamicFilters();
  }, [activeTab, selectedType, selectedCity]);

  const fetchDynamicFilters = async () => {
    try {
      const body: any = {};
      if (activeTab !== "All") body.listing_type = [activeTab.toLowerCase()];
      if (selectedCity && selectedCity !== "all") body.location = [Number(selectedCity)];
      if (selectedType) body.property_type = [Number(selectedType)];

      const res: any = await Models.property.dynamicFilter(body);

      const locations = (res?.location || []).map((item: any) => ({ 
        label: item.name, 
        value: String(item.id) 
      }));

      // Ensure "Show All Locations" is available if it's currently selected
      if (selectedCity === "all") {
        if (!locations.some(loc => loc.value === "all")) {
          locations.unshift({ label: "Show All Locations", value: "all" });
        }
      } 
      // Ensure the global location from props is always in the list so its label can be displayed
      else if (selectedCity && locationLabel && String(locationLabel.value) === selectedCity) {
        if (!locations.some(loc => loc.value === selectedCity)) {
          locations.unshift({ label: locationLabel.label, value: selectedCity });
        }
      }

      // Ensure the currently selected city is always in the list to avoid empty labels in the UI
      if (selectedCity && selectedCity !== "all") {
        const cityInRes = locations.some(l => l.value === selectedCity);
        if (!cityInRes) {
          const label = locationLabel?.label || "Selected City";
          locations.unshift({ label, value: selectedCity });
        }
      }

      setLocationList(locations);

      const types = (res?.property_type || []).map((item: any) => ({ 
        label: item.name, 
        value: String(item.id) 
      }));

      // If the list is empty and a specific city is selected, provide a descriptive disabled option.
      // This ensures the dropdown menu is never "empty" and provides clear feedback to the user.
      if (types.length === 0 && selectedCity && selectedCity !== "all") {
        const cityLabel = 
          locations.find((loc: any) => String(loc.value) === String(selectedCity))?.label || "chosen location";
        
        setPropertyTypeList([{ label: `No property type available for ${cityLabel}`, value: "no-results", isDisabled: true, disabled: true }]);
      } else {
        setPropertyTypeList(types);
      }

    } catch (error) {
      console.log("banner dynamicFilter error", error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab !== "All") params.set("type", activeTab.toLowerCase());
    if (selectedCity && selectedCity !== "all") params.set("location", selectedCity);
    if (selectedType) params.set("propertyType", selectedType);
    if (searchText) params.set("search", searchText);
    router.push(`/property-list?${params.toString()}`);
  };

  return (
    <section className="adv-wrapper relative lg:min-h-[90vh] py-20 lg:py-0 flex items-center justify-center overflow-hidden">
       <div className="section-wid adv-container relative z-10 w-full gap-10 items-center overflow-visible">
        {/* Left Content */}
        <div className="adv-left">
          <h1 className="adv-title w-full ">
            Discover Your  <br /> Perfect Home in  <br className="hidden xs:block"/> Paradise
          </h1>
          <p className="adv-subtitle">
            Browse luxury properties, modern apartments, and exclusive villas in the world&apos;s most desirable locations
          </p>
          <button className="adv-btn lg:mb-12 border border-dred"  > <a href="/property-list">Find Your Home</a></button>
           <button className="!border !border-white !bg-transparent adv-btn  hover:!bg-white hover:!text-black lg:mb-12 ms-4"  > <a href="mailto:support@gmail.com">Contact Us</a></button>

          {/* Tabs */}
          <div className="adv-tabs flex gap-8 mt-12 lg:mt-14 lg:ms-[25px]">
            {["Sale", "Lease", "All"].map((tab, i) => (
              <span
                key={i}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedType("");
                }}
                className={`adv-tab cursor-pointer ${activeTab === tab ? "active" : ""}`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Search Bar */}
          <div className="adv-searchbar flex items-center justify-between gap-2 mt-6">
             <div className="flex  flex-1 gap-3 items-center lg:items-start px-4">
              <Search className="text-dred w-4 h-4 md:w-5 md:h-5 mt-0  md:mt-0.5 shrink-0" />
              <div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search Properties"
                  className="adv-field-input placeholder:lg:text-[15px] placeholder:text-[#737373] py-2 md:py-0"
                />
              </div>
            </div>

            <div className="flex  flex-1 gap-3 items-center lg:items-start px-4">
              <MapPin className="text-dred w-4 h-4 md:w-5 md:h-5  md:mt-1.5 shrink-0" />
              <div>
                <CustomSelect
                  options={locationList}
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
                <CustomSelect
                  options={propertyTypeList}
                  value={selectedType}
                  onChange={(selected) => setSelectedType(selected ? selected.value : "")}
                  className="custom-select placeholder:lg:text-[16px]"
                  placeholder="Choose Property Type"
                />
              </div>
            </div>

            <div className="adv-divider"></div>

            <button className="adv-search-btn " onClick={handleSearch}>
              <p className="adv-search-label ms-2">Search</p>
              <ArrowRight className="w-5 h-5 search-ico " />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
