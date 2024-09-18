//@ts-nocheck
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const items = [
  {
    id: 1,
    color: "from-red-300 to-blue-300",
    title: "Tik tik",
    desc: "Tiktik is a high-performance TikTok clone built with Next.js, TypeScript, and TailwindCSS, featuring Google authentication and state management with Zustand. It handles video data with Axios and real-time content using Sanity.io, optimized for speed and scalability.",
    img: "/portfolio/1.png",
    link: "https://tiktik-clone-vxan.vercel.app/",
  },
  {
    id: 2,
    color: "from-blue-300 to-violet-300",
    title: "Promptopia",
    desc: "Promptopia is an AI-powered platform where users create and share ready-made prompt cards for various AI applications. It promotes collaboration by offering searchable prompts for developers, writers, and creatives. With a simple interface, Promptopia streamlines workflows and enhances productivity.",
    img: "/portfolio/3.png",
    link: "https://promptopia-k93z.onrender.com/",
  },
  {
    id: 3,
    color: "from-violet-300 to-purple-300",
    title: "Carepulse",
    desc: "CarePulse is an innovative healthcare clinic providing accessible medical services through a user-friendly platform. Patients can easily book appointments, while staff manage requests via a streamlined dashboard for a seamless experience.",
    img: "/portfolio/7.png",
    link: "https://carepulse-q36eux08s-sohadalmadhoons-projects.vercel.app/",
  },
  {
    id: 4,
    color: "from-purple-300 to-red-300",
    title: "Proshop",
    desc: `Proshop is an e-commerce platform built with Express.js, Mongoose, and MongoDB, offering secure authentication with JWT and password hashing with Bcryptjs. The front end uses React, React-Redux, and React-Bootstrap for a dynamic interface, while PayPal integration ensures seamless payment processing.`,
    img: "/portfolio/6.png",
    link: "https://proshop-s6ok.onrender.com/",
  },
];

const PortfolioPage = () => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}>
      <div className="h-[600vh] relative" ref={ref}>
        <div className=" h-[calc(100vh-6rem)] flex items-center justify-center text-8xl text-center">
          My Works
        </div>
        <div className="sticky top-0 flex h-screen gap-4 items-center overflow-hidden">
          <motion.div style={{ x }} className="flex">
            <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-red-300" />
            {items.map((item) => (
              <div
                className={`h-screen w-screen flex p-12 items-center justify-center bg-gradient-to-r ${item.color}`}
                key={item.id}>
                <div className="flex flex-col gap-2 text-slate-600 p-12 m-4">
                  <h1 className="text-xl font-bold md:text-4xl lg:text-4xl ">
                    {item.title}
                  </h1>
                  <div className="relative w-80 h-52 md:w-96 md:h-64 lg:w-[500px] lg:h-[350px] xl:w-[600px] xl:h-[420px]">
                    <Image src={item.img} alt="" fill />
                  </div>
                  <p className="w-full md:w-96 lg:w-[500px] lg:text-lg xl:w-[600px]">
                    {item.desc}
                  </p>
                  <Link href={item.link} className="flex justify-end">
                    <button className="p-2 text-sm md:p-4 md:text-md lg:px-4 lg:text-lg bg-white text-gray-600 font-semibold m-4 rounded">
                      See Demo
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="w-screen h-screen flex flex-col gap-16 items-center justify-center text-center">
        <h1 className="text-8xl">Do you have a project?</h1>
        <div className="relative">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            viewBox="0 0 300 300"
            className="w-64 h-64 md:w-[500px] md:h-[500px] ">
            <defs>
              <path
                id="circlePath"
                d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "
              />
            </defs>
            <text fill="#000">
              <textPath xlinkHref="#circlePath" className="text-xl">
                Full stack Developer (Mern Stack Dev.)
              </textPath>
            </text>
          </motion.svg>
          <Link
            href="/contact"
            className="w-16 h-16 md:w-28 md:h-28 absolute top-0 left-0 right-0 bottom-0 m-auto bg-black text-white rounded-full flex items-center justify-center">
            Hire Me
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioPage;
