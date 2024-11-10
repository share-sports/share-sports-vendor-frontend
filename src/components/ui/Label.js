// src/components/ui/Label.js
import React from 'react';

export default function Label({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} className="label">
            {children}
        </label>
    );
}
