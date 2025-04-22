'use client';

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const merchantSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(5),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  shopName: z.string().min(3),
  shopImageUrl: z.string().url(),
  shopAddress: z.string().min(5),
  businessType: z.string().min(3),
  description: z.string().min(10),
  region: z.string().min(3),
  website: z.string().url().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
});

export default function MerchantRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shopName: "",
    shopImageUrl: "",
    shopAddress: "",
    businessType: "",
    description: "",
    region: "",
    website: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('socialMedia.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [key]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = merchantSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/merchant/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/merchant/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Error in merchant registration API");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Merchant Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "name", label: "Name" },
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Password", type: "password" },
            { name: "phone", label: "Phone" },
            { name: "shopName", label: "Shop Name" },
            { name: "shopImageUrl", label: "Shop Image URL" },
            { name: "shopAddress", label: "Shop Address" },
            { name: "businessType", label: "Business Type" },
            { name: "region", label: "Region" },
            { name: "website", label: "Website " },
            { name: "socialMedia.facebook", label: "Facebook " },
            { name: "socialMedia.instagram", label: "Instagram " },
            { name: "socialMedia.twitter", label: "Twitter " },
          ].map(({ name, label, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={
                  name.includes("socialMedia")
                    ? (formData.socialMedia as any)[name.split(".")[1]]
                    : (formData as any)[name]
                }
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder={`Enter ${label}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
              placeholder="Describe your shop briefly..."
              rows={4}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            {loading ? "Registering..." : "Create Merchant Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
