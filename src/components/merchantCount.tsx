"use client";

import { useEffect, useState } from "react";

const MerchantCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchantCount = async () => {
      try {
        const res = await fetch("/api/totalMerchants");
        const data = await res.json();
        setCount(data.totalMerchants);
      } catch (err) {
        console.error("Failed to fetch merchant count:", err);
        setCount(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMerchantCount();
  }, []);

  return (
    <div className="mt-10 text-lg text-gray-700">
      {" "}
      Total Registered Merchants: {" "}
      <span className="text-purple-700 font-bold text-xl">
        {" "}
        {loading ? "Loading..." : count ?? "N/A"}{" "}
      </span>{" "}
    </div>
  );
};

export default MerchantCount;
