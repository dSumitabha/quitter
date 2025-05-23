'use client'
import React from 'react';

const Register = ({ handleChange, formData, handleSubmit }) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="username" className="sr-only">Username</label>
          <input id="username" name="username" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-700 dark:focus:ring-blue-300 focus:border-blue-600 dark:focus:border-blue-400 focus:z-10 sm:text-sm" placeholder="Username" value={formData.username} onChange={handleChange}/>
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input id="email" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-700 dark:focus:ring-blue-300 focus:border-blue-600 dark:focus:border-blue-400 focus:z-10 sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleChange}/>
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-700 dark:focus:ring-blue-300 focus:border-blue-600 dark:focus:border-blue-400 focus:z-10 sm:text-sm" placeholder="Password" value={formData.password} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-700 dark:focus:ring-blue-300 focus:border-blue-600 dark:focus:border-blue-400 focus:z-10 sm:text-sm" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}/>
        </div>
      </div>

      <div>
        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Register</button>
      </div>
    </form>
  );
};

export default Register;
