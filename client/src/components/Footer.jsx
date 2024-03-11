import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-200 py-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-4">
        <h1 className='font-bold text-lg sm:text-xl flex-wrap'>
            <span className='text-slate-500'>Skyline</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
          <p className="text-gray-500 text-sm">Your Perfect Home Awaits</p>
        </div>
        <div className="flex items-center gap-6 mb-4">
          <a href="/" className="text-slate-700 hover:underline">
            Home
          </a>
          <a href="/about" className="text-slate-700 hover:underline">
            About
          </a>
          <a href="/search" className="text-slate-700 hover:underline">
            Properties
          </a>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-slate-700 hover:text-blue-600 transition duration-300" />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-slate-700 hover:text-blue-400 transition duration-300" />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-slate-700 hover:text-pink-500 transition duration-300" />
          </a>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          © {new Date().getFullYear()} Skyline Estate. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
