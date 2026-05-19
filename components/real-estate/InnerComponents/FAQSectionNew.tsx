"use client";

import React from "react";
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
      "You can easily list your property by contacting our team or filling out the property listing form on our website. You can easily list your property by contacting our team or filling out the property listing form on our website.",
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
    question: "What's the average time to sell a house?",
    answer:
      "The selling timeline depends on market conditions, pricing, and location, but most properties sell within a few weeks.",
  },
];

export default function FAQSectionNew() {
  return (
    <section className="section-pad bg-white overflow-hidden">
      <div className="section-wid pb-5">
        <div className="grid lg:grid-cols-2 gap-0  overflow-hidden  ">

         

          {/* Right — FAQ content */}
          <div className="bg-white  flex flex-col justify-between">

            <div>
            
              <h3 className="section-ti mb-5">Frequently Asked Questions</h3>

              <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-gray-100"
                  >
                    <AccordionTrigger className="py-5 text-left section-in-ti hover:text-[#9b0f09] hover:no-underline transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-[16px]">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-5">
              <p className="text-sm text-gray-500 mb-3">Still have questions?</p>
              <Link
                href="mailto:support@gmail.com"
                className="inline-flex items-center gap-2 bg-[#9b0f09] hover:bg-[#7d0c07] text-white text-sm font-semibold px-7 py-3 rounded-full transition-colors duration-200 shadow-md"
              >
                Contact Us
              </Link>
            </div>

          </div>


           {/* Left — Image panel */}
          <div className="relative min-h-[420px] lg:min-h-full rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=900&fit=crop"
              alt="FAQ"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a09]/80 via-[#9b0f09]/50 to-black/60 rounded-2xl" />

            {/* Text over image */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 lg:p-12">
              <p className="text-white text-xs  uppercase tracking-widest mb-3">
                Got Questions?
              </p>
              <h2 className="!text-white section-ti leading-tight mb-4">
                We Have All The Answers
              </h2>
              <p className="!text-white section-cap leading-relaxed max-w-xs">
                Everything you need to know about buying, selling, and renting properties with us.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={"/propert-list"} className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition hover:bg-gray-100">
                  Browse all properties
                </Link>

                {/* <button className="rounded-full border border-white bg-transparent px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black">
                  Start exploring
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
