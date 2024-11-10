// src/components/ui/Textarea.js
import React from 'react';

export default function Textarea({ id, name, defaultValue, required }) {
    return (
        <textarea
            id={id}
            name={name}
            defaultValue={defaultValue}
            required={required}
            className="textarea"
        />
    );
}
