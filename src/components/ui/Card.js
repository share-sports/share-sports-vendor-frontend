// src/components/ui/Card.js
import React from 'react';

export function Card({ children }) {
    return <div className="card">{children}</div>;
}

export function CardHeader({ title, description }) {
    return (
        <div className="card-header">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

export function CardContent({ children }) {
    return <div className="card-content">{children}</div>;
}
