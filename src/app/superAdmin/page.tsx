"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Merchant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  shopName: string;
  verified: boolean;
  date: string;
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  date: string;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"merchants" | "admins">("merchants");
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    region: "",
  });

  
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    const fetchData = async () => {
      const url = activeTab === "merchants" ? "/api/superAdmin/getAllMerchants" : "/api/superAdmin/getAllAdmins";

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      const data = await res.json();
      if (activeTab === "merchants") setMerchants(data);
      else setAdmins(data);
    };

    fetchData();
  }, [activeTab]);

  const toggleVerifyMerchant = async (id: string, verified: boolean) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const res = await fetch("/api/superAdmin/toggleVerify", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ id, verified: !verified }),
    });

    if (res.ok) {
      setMerchants((prev) =>
        prev.map((m) => (m._id === id ? { ...m, verified: !verified } : m))
      );
    }
  };

  const deleteAdmin = async (id: string) => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const res = await fetch("/api/superAdmin/deleteAdmin", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    }
  };

  const createAdmin = async () => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const res = await fetch("/api/superAdmin/createAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(newAdmin),
    });

    if (res.ok) {
      const created = await res.json();
      setAdmins((prev) => [...prev, created]);
      setNewAdmin({ name: "", email: "", phone: "", password: "", region: "" });
    }
  };

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Super Admin Dashboard
      </h1>

      <div className="flex space-x-4 justify-center mb-6">
        <button
          onClick={() => setActiveTab("merchants")}
          className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
            activeTab === "merchants"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Merchants
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
            activeTab === "admins"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Admins
        </button>
      </div>

      {activeTab === "merchants" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Verified Merchants */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-green-600">Verified Merchants</h2>
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Shop</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Region</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {merchants
                  .filter((m) => m.verified)
                  .map((m) => (
                    <tr key={m._id} className="border-t">
                      <td className="p-2">{m.shopName}</td>
                      <td className="p-2">{m.email}</td>
                      <td className="p-2">{m.region}</td>
                      <td className="p-2">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="p-2">
                        <button
                          onClick={() => toggleVerifyMerchant(m._id, true)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Block
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Unverified Merchants */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-yellow-600">Unverified Merchants</h2>
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Shop</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Region</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {merchants
                  .filter((m) => !m.verified)
                  .map((m) => (
                    <tr key={m._id} className="border-t">
                      <td className="p-2">{m.shopName}</td>
                      <td className="p-2">{m.email}</td>
                      <td className="p-2">{m.region}</td>
                      <td className="p-2">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="p-2">
                        <button
                          onClick={() => toggleVerifyMerchant(m._id, false)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Admins</h2>
          <table className="table-auto w-full text-left border-collapse bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Region</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{admin.name}</td>
                  <td className="p-2">{admin.email}</td>
                  <td className="p-2">{admin.phone}</td>
                  <td className="p-2">{admin.region}</td>
                  <td className="p-2">
                    {new Date(admin.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteAdmin(admin._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-semibold">Create New Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["name", "email", "phone", "password", "region"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={(newAdmin as any)[field]}
                onChange={(e) =>
                  setNewAdmin((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="border px-3 py-2 rounded"
              />
            ))}
            <button
              onClick={createAdmin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Create Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
