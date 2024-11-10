// src/components/ui/Button.js
import React from 'react';

export default function Button({ children, onClick, variant = "primary", className = "" }) {
    return (
        <button
            onClick={onClick}
            className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
        >
            {children}
        </button>
    );
}
