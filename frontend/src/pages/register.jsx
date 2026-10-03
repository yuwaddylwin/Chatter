const Register = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const fields = new FormData(e.currentTarget);

        try{
            const response = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: fields.get('username'),
                    email: fields.get('email'),
                    password: fields.get('password')
                })
            })
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    return (
        <main className="register-page">
            <section className="register-shell" aria-labelledby="register-title">
                <aside className="register-story">
                    <a className="register-brand" href="/" aria-label="Chatter home">
                        <span className="brand-mark" aria-hidden="true">c</span>
                        chatter<span className="brand-dot">.</span>
                    </a>
                    <div className="story-copy">
                        <span className="eyebrow">GOOD CONVERSATIONS START HERE</span>
                        <h1>A little hello.<br />A whole new<br /><span>connection.</span></h1>
                        <p>A space to share your thoughts, find your people, and keep the conversation going.</p>
                    </div>
                    <div className="conversation-art" aria-hidden="true">
                        <div className="chat-bubble bubble-light">Hey, you made it! <span>✦</span></div>
                        <div className="chat-bubble bubble-primary">Let’s talk.</div>
                        <div className="typing-bubble"><i /><i /><i /></div>
                    </div>
                    <span className="story-footer">A place for your kind of people.</span>
                </aside>
                <div className="register-form-panel">
                    <div className="form-intro">
                        <span className="eyebrow">JOIN THE CONVERSATION</span>
                        <h2 id="register-title">Make yourself<br />at home.</h2>
                        <p>Create your account and say your first hello.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="register-field">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" placeholder="What should we call you?" autoComplete="username" required />
                        </div>
                        <div className="register-field">
                            <label htmlFor="email">Email address</label>
                            <input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                        </div>
                        <div className="register-field">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Create a password" autoComplete="new-password" required />
                        </div>
                        <button type="submit" className="register-submit">Create account <span aria-hidden="true">↗</span></button>
                    </form>
                    <div className="form-footer"><span aria-hidden="true">✳</span> Your next great conversation is one hello away.</div>
                </div>
            </section>
        </main>
    );
};

export default Register;
