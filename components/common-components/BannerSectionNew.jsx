import { useState } from "react";
import { TextInput } from "./textInput";
import { Search } from "lucide-react";

export default function BannerSectionNew() {
  const [activeTab, setActiveTab] = useState("sell");

  return (
    <section className="property-hero">
      <div className="bann-container max-w-screen-2xl">
        
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
              className={`tab-btn ${activeTab === "sell" ? "active" : ""}`}
              onClick={() => setActiveTab("sell")}
            >
              Sell
            </button>
            <button
              className={`tab-btn ${activeTab === "buy" ? "active" : ""}`}
              onClick={() => setActiveTab("buy")}
            >
              Buy
            </button>
            <button
              className={`tab-btn ${activeTab === "rent" ? "active" : ""}`}
              onClick={() => setActiveTab("rent")}
            >
              Rent
            </button>
          </div>

          {/* Search */}
          <div className="hero-search">
            <TextInput 
            placeholder="What are you looking for?"
            className="hero-search-input "
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

            <button className="search-btn">
              <Search size={18} />
               Search
            </button> 
          </div>
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