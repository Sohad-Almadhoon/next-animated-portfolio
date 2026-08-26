"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "emailjs-com";

const TEXT = "Say Hello";

type Status = "idle" | "sending" | "sent" | "error";

const ContactPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .send(
        "service_mvngau3",
        "template_crw3cxd",
        { message, address },
        "Z-5riUDR8b7dnt8cG"
      )
      .then(
        () => {
          setStatus("sent");
          setMessage("");
          setAddress("");
        },
        () => setStatus("error")
      );
  };

  return (
    <motion.div
      className="h-full overflow-y-auto"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}>
      <div className="flex min-h-full flex-col gap-8 px-4 py-8 sm:px-8 md:px-12 lg:flex-row lg:items-center lg:gap-16 lg:px-20 lg:py-0 xl:px-48">
        {/* HEADING */}
        <div className="flex w-full flex-col justify-center gap-6 lg:h-full lg:w-1/2">
          <h1 className="text-5xl font-semibold tracking-[-0.03em] md:text-7xl">
            {TEXT.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.25 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}>
                {letter}
              </motion.span>
            ))}
            <span className="ml-2">😊</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-md text-sm leading-relaxed text-white/55 md:text-base">
            Got a project, a role, or just a question? Drop a note and I&apos;ll
            get back to you.
          </motion.p>
        </div>

        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col justify-center gap-7 rounded-2xl bg-surface p-6 text-base ring-1 ring-white/10 sm:p-8 md:p-10 md:text-lg lg:h-5/6 lg:w-1/2"
          onSubmit={handleSubmit}>
          <span>Dear Sohad Dev,</span>

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="write your message..."
            className="resize-none border-b border-white/20 bg-transparent pb-2 outline-none transition placeholder:text-white/25 focus:border-accent"
            required
          />

          <span>My mail address is:</span>

          <input
            type="email"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="you@example.com"
            className="border-b border-white/20 bg-transparent pb-2 outline-none transition placeholder:text-white/25 focus:border-accent"
            required
          />

          <span>Regards</span>

          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-accent p-4 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60">
            {status === "sending" ? "Sending…" : "Send"}
          </motion.button>

          {/* the old version sent silently — this says what happened */}
          <AnimatePresence mode="wait">
            {status === "sent" && (
              <motion.p
                key="sent"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-accent">
                Thanks — your message is on its way.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-red-400">
                Something went wrong. Please try again.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
