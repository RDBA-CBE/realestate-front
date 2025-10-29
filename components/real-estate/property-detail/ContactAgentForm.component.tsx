"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomPhoneInput from "@/components/common-components/phoneInput";
import {
  capitalizeFLetter,
  Failure,
  formatPhoneNumber,
  Success,
  useSetState,
} from "@/utils/function.utils";
import Models from "@/imports/models.import";
import TextArea from "@/components/common-components/textArea";
import { X } from "lucide-react";

interface ContactAgentFormProps {
  data: any;
  token: any;
  onClose;
}

export default function ContactAgentForm({
  data,
  token,
  onClose,
}: ContactAgentFormProps) {
  const [state, setState] = useSetState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    contactAgreement: false,
    btnLoading: false,
    inquiry: "",
  });

  console.log("state.inquiry", state.inquiry);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setState({ btnLoading: true });
      const body = {
        assigned_to: data?.developer?.id,
        first_name: state.first_name,
        last_name: state.last_name,
        phone: state.phone,
        email: state.email,
        interested_property: data?.id,
        lead_source: "website",
        status: "new",
        requirements: state.inquiry ? state.inquiry : "New Requirements",
      };

      console.log("body", body);

      const res = await Models.lead.create(body);
      Success("Enquiry sent ! ");
      setState({
        btnLoading: false,
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        inquiry: "",
      });
    } catch (error) {
      if (error?.email?.length > 0) {
        Failure(error?.email[0]);
      }
      setState({ btnLoading: false });

      console.log("✌️error --->", error);
    }
  };

  const withTokenSubmit = async () => {
    try {
      setState({ btnLoading: true });

      const userId = localStorage.getItem("userId");

      const response: any = await Models.user.details(userId);
      const body = {
        assigned_to: data?.developer?.id,
        first_name: response?.first_name,
        last_name: response?.last_name,
        phone: response.phone,
        email: response.email,
        interested_property: data?.id,
        lead_source: "website",
        status: "new",
        requirements: state.inquiry ? state.inquiry : "New Requirements",
      };

      const res = await Models.lead.create(body);

      setState({
        btnLoading: false,
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        inquiry: "",
      });
      Success("Enquiry sent ! ");
    } catch (error) {
      if (error?.email?.length > 0) {
        Failure(error?.email[0]);
      }
      setState({ btnLoading: false });

      console.log("✌️error --->", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState({
      [name]: value,
    });
  };

  return (
    <Card className={`rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto  !bg-gray ${onClose ? "w-[500px]" : "me-0"}`}>
       {onClose && (
        <div className="w-100 text-right">
           <button
            onClick={onClose}
            className=" px-5 pt-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
         
        )}
      <CardContent className={`p-6 space-y-6 ${onClose ? "pt-0" : ""}`}>
       
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <div className="flex-shrink-0">
            <Image
              src="/assets/images/real-estate/dummy.png"
              alt="Cinco Realtors"
              width={60}
              height={60}
              className="rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-lg">
              {`${capitalizeFLetter(data?.developer?.first_name)} ${
                data?.developer?.last_name
              } `}
            </h3>
            <p className="text-gray-600 text-sm">
              {capitalizeFLetter(data?.developer?.user_type)}
            </p>
            <p className="text-gray-800 font-medium mt-1">
              {formatPhoneNumber(data?.developer?.phone)}
            </p>
          </div>
        </div>

        {token ? (
          <>
            <TextArea
              title="Inquiry"
              placeholder="Write Your Inquiry"
              value={state.inquiry}
              onChange={(e) => setState({ inquiry: e.target.value })}
              className="border-gray-300 rounded-lg py-2"
            />

            <Button
              type="button"
              disabled={state.btnLoading}
              onClick={() => withTokenSubmit()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {state.btnLoading ? "Submitting..." : "Enquire"}
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="">
            <p className="text-gray-600 text-sm text-center">
              Please share your contact
            </p>

            <div className="space-y-3">
              <Input
                name="first_name"
                title="First Name"
                value={state.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="border-gray-300 rounded-lg py-2"
                required
                error={state.errors?.first_name}
              />
              <Input
                name="last_name"
                title="Last Name"
                value={state.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="border-gray-300 rounded-lg py-2"
                required
                error={state.errors?.last_name}
              />

              <div className="flex gap-2">
                <CustomPhoneInput
                  value={state.phone}
                  onChange={(value) => setState({ phone: value })}
                  title="Phone Number"
                  name="phone"
                  required
                  error={state.errors?.phone}
                />
              </div>

              <Input
                title="Email"
                type="email"
                name="email"
                value={state.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border-gray-300 rounded-lg py-2"
                required
                error={state.errors?.email}
              />

              <TextArea
                title="Inquiry"
                placeholder="Write Your Inquiry"
                value={state.inquiry}
                onChange={(e) => setState({ inquiry: e.target.value })}
                className="border-gray-300 rounded-lg py-2"
              />
            </div>

            {/* Checkboxes */}

            {/* Button */}
            <Button
              type="submit"
              disabled={state.btnLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {state.btnLoading ? "Submitting..." : "Enquire"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
