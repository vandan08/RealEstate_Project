import React from 'react';

export default function About() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto font-serif'>
      <h1 className='text-4xl font-bold mb-6 text-skyline-blue'>
        Welcome to Skyline Estate
      </h1>
      <p className='mb-8 text-lg text-gray-800'>
        At Skyline Estate, we believe in transforming dreams into reality. We are not just a real estate agency; we are your partners in finding the perfect home, making wise investments, and realizing the full potential of your property.
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        <div>
          <img
            src='/t1.jpg'
            alt='Properties at Skyline Estate'
            className='rounded-lg shadow-lg mb-6 w-full h-full'
          />
        </div>
        <div>
          <h2 className='text-3xl font-bold mb-4 text-skyline-blue'>
            Our Commitment
          </h2>
          <p className='mb-6 text-lg text-gray-800'>
            Skyline Estate is committed to providing you with exceptional real estate services. Our experienced team of agents is dedicated to understanding your unique needs and goals, ensuring a seamless and rewarding experience.
          </p>
          <div>
            <h2 className='text-3xl font-bold mb-4 text-skyline-blue'>
              Why Choose Skyline Estate?
            </h2>
            <ul className='list-disc mb-6 text-lg text-gray-800 pl-6 font-serif'>
              <li>Expert Advice: Our team offers expert advice to guide you through every step of your real estate journey.</li>
              <li>Personalized Service: We understand that every client is unique, and we tailor our services to meet your specific requirements.</li>
              <li>Local Market Knowledge: With a deep understanding of the local market, we help you make informed decisions.</li>
            </ul>
            <p className='mb-8 text-lg text-gray-800 font-serif'>
              Whether you are buying, selling, or renting a property, Skyline Estate is here to make your real estate goals a reality. Join us on this exciting journey, and let's create your story together.
            </p>
          </div>
        </div>
      </div>
      <div className='bg-skyline-blue p-4 rounded-lg mb-8 text-red-500'>
        <p className='text-lg font-bold mb-2'>Important Notice for Users:</p>
        <p className='text-sm'>
          Skyline Estate is committed to safeguarding your data and privacy. As an end-user of our website, you are responsible for the information you share. Rest assured, no external authorities will interfere with your data. Your privacy matters to us.
        </p>
      </div>
    </div>
  );
}
