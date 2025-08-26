import React from 'react';

const Contact = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Contact</h1>
            <form className="space-y-4">
                <input className="input" placeholder="Your name" />
                <input className="input" placeholder="Your email" type="email" />
                <textarea className="input" rows="5" placeholder="Message" />
                <button className="btn btn-primary">Send</button>
            </form>
        </div>
    );
};

export default Contact;


