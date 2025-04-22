"use client";

import { JSX, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Merchant {
  name: string;
  email: string;
  phone: string;
  shopName: string;
  shopAddress: string;
  region: string;
  shopImageUrl: string;
  businessType: string;
  description: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  verified: boolean;
  date?: string;
}

export default function MerchantDashboard() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      const token = Cookies.get("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
      try {
        const res = await fetch("/api/merchant/getMerchant", {
          method: "GET",
          headers: { "Content-Type": "application/json", token },
        });

        if (!res.ok) {
          if (res.status === 401) {
            Cookies.remove("token");
            window.location.href = "/merchant/login";
            return;
          }
          throw new Error("Failed to fetch merchant");
        }

        const data = await res.json();
        setMerchant(data);
      } catch (err) {
        console.error("Error fetching merchant:", err);
      }
    };

    fetchMerchant();
  }, []);

  if (!merchant) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading merchant data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">
              {merchant.shopName}
            </h1>
            <p className="text-gray-600">{merchant.description}</p>
          </div>
          {merchant.shopImageUrl && (
            <img
              src={merchant.shopImageUrl}
              alt={merchant.shopName}
              className="w-40 h-40 object-cover rounded-xl shadow border"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Info label="Owner Name" value={merchant.name} />
          <Info label="Email" value={merchant.email} />
          <Info label="Phone" value={merchant.phone} />
          <Info label="Region" value={merchant.region} />
          <Info label="Shop Address" value={merchant.shopAddress} />
          <Info label="Business Type" value={merchant.businessType} />
          <Info
            label="Joined On"
            value={
              merchant.date
                ? new Date(merchant.date).toLocaleDateString()
                : "N/A"
            }
          />
          <Info
            label="Verified"
            value={
              merchant.verified ? "✅ Verified" : "⏳ Pending Verification"
            }
            color={merchant.verified ? "text-green-600" : "text-yellow-600"}
          />
          {merchant.website && (
            <Info
              label="Website"
              value={
                <a
                  href={merchant.website}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Visit Site
                </a>
              }
            />
          )}
        </div>

        {merchant.socialMedia && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
              Social Media
            </h2>
            <div className="flex gap-4 flex-wrap">
              {merchant.socialMedia.facebook && (
                <a
                  href={merchant.socialMedia.facebook}
                  target="_blank"
                  className="text-blue-700 hover:underline"
                >
                  Facebook
                </a>
              )}
              {merchant.socialMedia.instagram && (
                <a
                  href={merchant.socialMedia.instagram}
                  target="_blank"
                  className="text-pink-600 hover:underline"
                >
                  Instagram
                </a>
              )}
              {merchant.socialMedia.twitter && (
                <a
                  href={merchant.socialMedia.twitter}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Info({
  label,
  value,
  color = "text-gray-800",
}: {
  label: string;
  value: string | JSX.Element;
  color?: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-base font-medium break-words ${color}`}>{value}</p>
    </div>
  );
}
