import React from 'react'

const InputField = ({ label, placeholder, type = "text", name ,register,error}) => (
    <div className="space-y-2">
      <label className="text-gray-400 text-sm mr-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full bg-[#09172b] border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#C59D4A] transition-colors"
      />
      {error[name] && (
        <p className="text-red-500 text-xs">{error[name].message}</p>
      )}
    </div>
  );

export default InputField