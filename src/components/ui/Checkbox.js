// src/components/ui/Checkbox.js
import React from 'react';

export default function Checkbox({ id, name, defaultChecked }) {
    return (
        <input
            id={id}
            name={name}
            type="checkbox"
            defaultChecked={defaultChecked}
            className="checkbox"
        />
    );
}
