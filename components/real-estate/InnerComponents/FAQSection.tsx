"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqs = [
  {
    question: "How can I post my house for sale?",
    answer:
      "You can easily list your property by contacting our team or filling out the property listing form on our website.",
  },
  {
    question: "What is your realtor sale commission?",
    answer:
      "Our commission structure depends on the property type and location. Contact us for detailed pricing information.",
  },
  {
    question: "Which type of house do you take for promoting?",
    answer:
      "We promote apartments, villas, independent houses, gated communities, and commercial properties.",
  },
  {
    question: "What’s the average time to sell a house?",
    answer:
      "The selling timeline depends on market conditions, pricing, and location, but most properties sell within a few weeks.",
  },
];

export default function FAQSection() {
  return (
    <section className="section-pad">
      <div className="section-wid pb-5">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.4fr]">
          
          {/* Left Content */}
          <div>
            <h2 className="section-ti">
              Have questions?
            </h2>

            <p className="section-cap mt-4 max-w-md">
              Lorem ipsum dolor sit amet consectetur pretium consectetur nulla
              est in dui ornare nulla quis diam consequat habitant nam viverra
              netus.
            </p>

           
            <Link
              href={"mailto:info@boomrealtys.com"}
              className="inline-flex items-center gap-2 bg-dred hover:bg-red-800 text-white font-semibold mt-5 px-8 py-2 rounded-full transition-colors duration-200 shadow-md"
            >
             
              Contact us
            </Link>
          </div>

          {/* FAQ */}
          <Accordion
            type="single"
            collapsible
            className="w-full border-b border-gray-200"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-7 text-left section-in-ti font-medium hover:no-underline">
                  <div className="flex w-full items-center justify-between gap-6">
                    <span>{faq.question}</span>

                    {/* <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </div> */}
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-6 pr-14 text-base text-gray-500">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}