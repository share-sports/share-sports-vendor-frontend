// src/components/ui/Dialog.js
import React from 'react';

export function Dialog({ children, isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="dialog" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({ title, description }) {
    return (
        <div className="dialog-header">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export function DialogContent({ children }) {
    return <div className="dialog-content">{children}</div>;
}

export function DialogFooter({ children }) {
    return <div className="dialog-footer">{children}</div>;
}
