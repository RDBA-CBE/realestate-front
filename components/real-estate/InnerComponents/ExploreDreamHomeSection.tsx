import Link from "next/link";
import React from "react";

export default function ExploreDreamHomeSection() {
  return (
    <section className="section-pad bg-white">
      <div className="section-wid py-5">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop"
            alt="Dream Home"
            className="h-[300px] w-full object-cover md:h-[420px]"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/45" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-2xl text-center text-white">
              <h2 className="section-ti !text-white">
                Explore your dream home today
              </h2>

              <p className="section-cap mt-4 !text-white">
                Lorem ipsum dolor sit amet consectetur vitae commodo nunc donec
                scelerisque nulla arcu lacus risus eu nulla enim ultrices
                cursus in augue urna vitae curabitur.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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