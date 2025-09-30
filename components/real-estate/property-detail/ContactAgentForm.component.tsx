"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ContactAgentFormProps {
  onSuccess?: () => void;
}

export default function ContactAgentForm({ onSuccess }: ContactAgentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    contactAgreement: false,
    loansInterest: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        contactAgreement: false,
        loansInterest: false
      });
      // Call onSuccess callback if provided
      onSuccess?.();
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <Card className="rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto">
      <CardContent className="p-6 space-y-6">
        {/* Agent Info with Image on Left */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          {/* Agent Image */}
          <div className="flex-shrink-0">
            <Image
              src="/assets/images/real-estate/dummy.png"
              alt="Cinco Realtors"
              width={60}
              height={60}
              className="rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          
          {/* Agent Details */}
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">Cinco Realtors</h3>
            <p className="text-gray-600 text-sm">Developer</p>
            <p className="text-gray-800 font-medium mt-1">+9184040....</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-600 text-sm text-center">
            Please share your contact
          </p>
          
          <div className="space-y-3">
            <Input 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name" 
              className="border-gray-300 rounded-lg py-2"
              required
            />
            
            {/* Phone Input with Country Code */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 border-r border-gray-300 bg-gray-50 rounded-l-lg">
                  <span className="text-gray-600 text-sm">+91</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                </div>
                <Input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone" 
                  className="pl-16 border-gray-300 rounded-lg py-2"
                  required
                />
              </div>
            </div>
            
            <Input 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email" 
              className="border-gray-300 rounded-lg py-2"
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="contact" 
                checked={formData.contactAgreement}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("contactAgreement", checked as boolean)
                }
                className="mt-0.5 border-gray-400 data-[state=checked]:bg-red-600" 
              />
              <label htmlFor="contact" className="text-sm text-gray-700 leading-tight">
                I agree to be contacted by Housing and agents via
                <br />
                <span className="text-gray-600">WhatsApp, SMS, phone, email etc</span>
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="loans" 
                checked={formData.loansInterest}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("loansInterest", checked as boolean)
                }
                className="mt-0.5 border-gray-400 data-[state=checked]:bg-red-600" 
              />
              <label htmlFor="loans" className="text-sm text-gray-700 leading-tight">
                I am interested in Home Loans
              </label>
            </div>
          </div>

          {/* Button */}
          <Button 
            type="submit"
            disabled={isSubmitting || !formData.contactAgreement}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Enquire"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}