'use client';

import { motion } from 'framer-motion'; import { FaStore, FaUserShield, FaGlobe } from 'react-icons/fa';

export default function About() { return ( <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-white text-gray-800"> <div className="max-w-5xl mx-auto"> <motion.h1 className="text-4xl font-extrabold text-center mb-6" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} > 🛒 About the Merchant Portal </motion.h1>

    <motion.p 
      className="text-center max-w-3xl mx-auto mb-10 text-lg leading-relaxed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      This platform is a role-based merchant verification and management system. It enables merchants to register their shops, admins to verify merchants regionally, and super admins to control the entire ecosystem from a global view. Secure, scalable, and streamlined for real-world use cases.
    </motion.p>

    {/* Project Roles */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {[
        {
          icon: <FaStore className="text-3xl text-indigo-600" />,
          title: "Merchant",
          desc: "Registers with their shop info and waits for approval by their regional admin."
        },
        {
          icon: <FaUserShield className="text-3xl text-green-600" />,
          title: "Admin",
          desc: "Manages merchants within their assigned region — verifies or blocks registrations."
        },
        {
          icon: <FaGlobe className="text-3xl text-red-500" />,
          title: "Super Admin",
          desc: "Oversees all admins and merchants. Can promote or remove admins and manage the global merchant ecosystem."
        }
      ].map((role, index) => (
        <motion.div 
          key={index}
          className="bg-white shadow-md p-6 rounded-2xl hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="mb-4">{role.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
          <p className="text-gray-600">{role.desc}</p>
        </motion.div>
      ))}
    </div>

    {/* Technologies */}
    <motion.h2 
      className="text-2xl font-bold mb-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      🛠️ Technologies Used
    </motion.h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
      {[
        { tech: 'HTML/CSS', desc: 'Fundamental structure and layout for responsive design.' },
        { tech: 'Tailwind CSS', desc: 'Rapid styling with utility-first classes.' },
        { tech: 'React & Next.js', desc: 'Modern frontend with API routing and SSR.' },
        { tech: 'MongoDB', desc: 'NoSQL database storing merchants and admins.' },
        { tech: 'Mongoose', desc: 'Schema-driven modeling for MongoDB.' },
        { tech: 'JWT', desc: 'Secure authentication via token and cookies.' },
        { tech: 'Framer Motion', desc: 'Smooth UI transitions and animations.' },
        { tech: 'Zod', desc: 'Reliable input validation for forms and API schemas.' },
        { tech: 'Vercel', desc: 'Effortless deployment for frontend and APIs.' },
        { tech: 'Git & GitHub', desc: 'Version control and collaboration tools.' }
      ].map((item, index) => (
        <motion.div
          key={index}
          className="p-4 bg-gray-100 rounded-xl hover:shadow-md transition"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <h4 className="text-lg font-semibold">{item.tech}</h4>
          <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
        </motion.div>
      ))}
    </div>

    {/* Summary Section */}
    <motion.div 
      className="mt-16 bg-indigo-50 p-8 rounded-xl text-center shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-2xl font-bold mb-4">🚀 Real-World Utility</h3>
      <p className="max-w-3xl mx-auto text-gray-700">
        Designed for marketplaces, service directories, and business networks, this system ensures verified merchants operate under regional oversight. It’s a scalable and secure way to onboard and manage vendors with trust and transparency.
      </p>
    </motion.div>
  </div>
</div>
); }