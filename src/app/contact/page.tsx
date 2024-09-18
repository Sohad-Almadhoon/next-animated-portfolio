"use client";
import React from "react";
import { motion } from "framer-motion";

const ContactPage = () => {
  const text = "Say Hello";

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
        <form className="h-1/2 lg:h-5/6 mt-12 lg:w-1/2 bg-red-50 rounded-xl text-xl flex flex-col gap-8 justify-center p-12">
          <span>Dear Sohad Dev,</span>
          <textarea
            rows={6}
            className=" bg-transparent border-b-2 border-b-black outline-none resize-none"
          />
          <span>My all address is:</span>
          <input
            type="text"
            className=" bg-transparent border-b-2 border-b-black outline-none"
          />
          <span>Regards</span>
          <button className="bg-purple-200 rounded font-semibold text-gray-600 p-4">Send</button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
