"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  date: string;
}

interface Merchant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  shopAddress: string;
  region: string;
  businessType: string;
  verified: boolean;
  date: string;
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [verifiedMerchants, setVerifiedMerchants] = useState<Merchant[]>([]);
  const [unverifiedMerchants, setUnverifiedMerchants] = useState<Merchant[]>(
    []
  );

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/"; // Redirect to login if no token
      return;
    }

    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        const data = await res.json();
        setAdmin(data);
      } catch (err) {
        console.error("Failed to fetch admin", err);
      }
    };

    const fetchMerchants = async () => {
      try {
        const res = await fetch("/api/admin/getAllMerchants", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        const data = await res.json();
        const verified = data.filter((m: Merchant) => m.verified);
        const unverified = data.filter((m: Merchant) => !m.verified);

        setVerifiedMerchants(verified);
        setUnverifiedMerchants(unverified);
      } catch (err) {
        console.error("Failed to fetch merchants", err);
      }
    };

    fetchAdminData();
    fetchMerchants();
  }, []);

  const handleToggleVerification = async (id: string, verified: boolean) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/"; // Redirect to login if no token
      return;
    }
    try {
      const res = await fetch(`/api/admin/verifyMerchant`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ id, verified: !verified }),
      });

      if (res.ok) {
        setVerifiedMerchants((prev) =>
          verified
            ? prev.filter((m) => m._id !== id)
            : [...prev, ...unverifiedMerchants.filter((m) => m._id === id)]
        );

        setUnverifiedMerchants((prev) =>
          !verified
            ? prev.filter((m) => m._id !== id)
            : [...prev, ...verifiedMerchants.filter((m) => m._id === id)]
        );
      }
    } catch (err) {
      console.error("Verification toggle failed", err);
    }
  };

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto mb-12 space-y-10">
      {" "}
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        {" "}
        Admin Dashboard{" "}
      </h1>
      {admin && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Admin Details
          </h2>
          <p>
            <strong>Name:</strong> {admin.name}
          </p>
          <p>
            <strong>Email:</strong> {admin.email}
          </p>
          <p>
            <strong>Phone:</strong> {admin.phone}
          </p>
          <p>
            <strong>Region:</strong> {admin.region}
          </p>
          <p>
            <strong>Joined:</strong> {new Date(admin.date).toLocaleDateString()}
          </p>
        </div>
      )}
      {/* Unverified Merchants */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Unverified Merchants
        </h2>
        {unverifiedMerchants.length === 0 ? (
          <p className="text-gray-600">No unverified merchants.</p>
        ) : (
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Shop</th>
                <th className="p-2">Region</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {unverifiedMerchants.map((merchant) => (
                <tr key={merchant._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{merchant.name}</td>
                  <td className="p-2">{merchant.email}</td>
                  <td className="p-2">{merchant.shopName}</td>
                  <td className="p-2">{merchant.region}</td>
                  <td className="p-2">
                    {new Date(merchant.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() =>
                        handleToggleVerification(merchant._id, false)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Verified Merchants */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Verified Merchants
        </h2>
        {verifiedMerchants.length === 0 ? (
          <p className="text-gray-600">No verified merchants.</p>
        ) : (
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Shop</th>
                <th className="p-2">Region</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifiedMerchants.map((merchant) => (
                <tr key={merchant._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{merchant.name}</td>
                  <td className="p-2">{merchant.email}</td>
                  <td className="p-2">{merchant.shopName}</td>
                  <td className="p-2">{merchant.region}</td>
                  <td className="p-2">
                    {new Date(merchant.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        handleToggleVerification(merchant._id, true)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
