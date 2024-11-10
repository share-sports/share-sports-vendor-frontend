// src/components/ui/Input.js
import React from 'react';

export default function Input({ id, name, type = "text", defaultValue, required }) {
    return (
        <input
            id={id}
            name={name}
            type={type}
            defaultValue={defaultValue}
            required={required}
            className="input-field"
        />
    );
}
