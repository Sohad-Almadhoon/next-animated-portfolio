"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com"; // Import EmailJS

const ContactPage: React.FC = () => {
  const text = "Say Hello";

  // State to manage form inputs
  const [message, setMessage] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    const templateParams = {
      message,
      address,
    };

    emailjs
      .send(
        "service_mvngau3",
        "template_crw3cxd",
        templateParams,
        "Z-5riUDR8b7dnt8cG"
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          // Optionally reset the form or show a success message
          setMessage("");
          setAddress("");
        },
        (error) => {
          console.log("Failed to send email:", error);
        }
      );
  };

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}>
      <div className="h-full flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
        <div className="h-1/2 lg:h-full lg:w-1/2 flex items-center justify-center text-6xl">
          <div>
            {text.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}>
                {letter}
              </motion.span>
            ))}
            😊
          </div>
        </div>
        <form
          className="h-1/2 lg:h-5/6 mt-12 lg:w-1/2 bg-red-50 rounded-xl text-xl flex flex-col gap-8 justify-center p-12"
          onSubmit={handleSubmit} // Add onSubmit handler
        >
          <span>Dear Sohad Dev,</span>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Manage textarea input
            className="bg-transparent border-b-2 border-b-black outline-none resize-none"
            required
          />
          <span>My all address is:</span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)} // Manage input value
            className="bg-transparent border-b-2 border-b-black outline-none"
            required
          />
          <span>Regards</span>
          <button
            type="submit"
            className="bg-purple-200 rounded font-semibold text-gray-600 p-4">
            Send
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
