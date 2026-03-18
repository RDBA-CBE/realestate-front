"use client";

import { useState } from "react";
import { TextInput } from "./textInput";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BannerSectionNew() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    params.append("type", activeTab);
    router.push(`/property-list?${params.toString()}`);
  };

  return (
    <section className="property-hero">
      <div className="bann-container max-w-7xl xl:container 2xl:max-w-screen-2xl">
        
        {/* LEFT */}
        <div className="hero-left">
          <h1 className="hero-title">
            EASY WAY TO FIND A <br />
            PERFECT PROPERTY
          </h1>

          <p className="hero-desc">
            We provide a complete service for the sale,
            purchase or rental of real estate.
          </p>

          {/* Tabs */}
          <div className="hero-tabs">
            <button
              className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
              onClick={() => setActiveTab("All")}
            >
              All
            </button>
            <button
              className={`tab-btn ${activeTab === "Sale" ? "active" : ""}`}
              onClick={() => setActiveTab("Sale")}
            >
              Sale
            </button>
            <button
              className={`tab-btn ${activeTab === "Lease" ? "active" : ""}`}
              onClick={() => setActiveTab("Lease")}
            >
              Lease
            </button>
          </div>

          {/* Search */}
          <form
           onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="hero-search">
            <TextInput 
            placeholder="Search by property name,location,pincode,state,city ..."
            className="hero-search-input "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <input
              type="text"
              placeholder="Enter keyword here ..."
              
            /> */}

            {/* <select className="search-select">
              <option>Select Location</option>
              <option>Chennai</option>
              <option>Bangalore</option>
            </select>*/}

            <button  type="submit" className="search-btn">
              <Search size={18} />
               Search
            </button> 
          </form>
        </div>

        {/* RIGHT - SINGLE IMAGE */}
        <div className="hero-right">
          <img
            src="/assets/images/real-estate/banner-side.png"
            alt="property"
            className="hero-main-image"
          />
        </div>
      </div>

      
    </section>
  );
}