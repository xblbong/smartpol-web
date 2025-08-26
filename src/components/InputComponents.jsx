import React from 'react';
import { Form, Input } from 'antd';

const InputComponents = ({ label, name, placeholder, rules, prefix, type = 'text', isPassword = false }) => {
  const InputComponent = isPassword ? Input.Password : Input;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <Form.Item name={name} rules={rules} noStyle>
        <InputComponent
          id={name}
          prefix={prefix}
          placeholder={placeholder}
          type={type}
          // Styling menggunakan Tailwind CSS
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          style={{ height: '40px' }} // Menyamakan tinggi input
        />
      </Form.Item>
    </div>
  );
};

export default InputComponents;