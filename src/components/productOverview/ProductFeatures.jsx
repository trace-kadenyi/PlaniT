import { CheckCircle } from "lucide-react";

import { productFeatures } from "../../data/productData";
import { useState } from "react";

export default function ProductFeatures() {
  const [activeFeature, setActiveFeature] = useState("demo");

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
        <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Key Features
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9B2C62]/30 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productFeatures.map((feature) => (
          <div
            key={feature.id}
            className={`bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl p-6 shadow-sm border border-[#F3EDE9] dark:border-gray-700/50 hover:shadow-md transition-all duration-300 cursor-pointer ${
              activeFeature === feature.id
                ? "ring-2 ring-[#9B2C62] dark:ring-[#D97706]"
                : ""
            }`}
            onClick={() => setActiveFeature(feature.id)}
          >
            <div
              className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color}`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {feature.description}
            </p>
            <ul className="space-y-1">
              {feature.details.map((detail, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-sm text-gray-500 dark:text-gray-400"
                >
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-[#9B2C62] dark:text-[#D97706] flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
