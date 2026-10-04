import {useState} from "react";
const SignIn = () => {
   const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);
        
        //make a POST request to the backend API for signing in , make new data object
       //with the email and password from the form, and send it as JSON in the request body.
       //  Then handle the response accordingly.
        const form = e.currentTarget
        const fields = new FormData(form);

        const email = fields.get('email');
        const password = fields.get('password');
        
        try{
            const response = await fetch("http://localhost:8000/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || "Sign in failed");
            }
            console.log("Sign in successful:", data);
            setIsSuccess(true);
            setMessage("Sign in successful!");
            console.log(data); // Log the response data for debugging
            form.reset(); // Reset the form fields after successful sign in
        } catch (error) {
            console.error("Error signing in:", error);
            setMessage("Sign in failed. Please try again.");
            form.reset();
        }
    };

    return (
        <main className="register-page">
            <section className="register-shell" aria-labelledby="signin-title">
                <aside className="register-story">
                    <a className="register-brand" href="/" aria-label="Chatter home">
                        <span className="brand-mark" aria-hidden="true">c</span>
                        chatter<span className="brand-dot">.</span>
                    </a>
                    <div className="story-copy">
                        <span className="eyebrow">GOOD TO HAVE YOU BACK</span>
                        <h1>A familiar hello.<br />A new<br /><span>conversation.</span></h1>
                        <p>Your people, your thoughts, your everyday moments. Pick up right where you left off.</p>
                    </div>
                    <div className="conversation-art" aria-hidden="true">
                        <div className="chat-bubble bubble-light">Hey, welcome back! <span>✦</span></div>
                        <div className="chat-bubble bubble-primary">Let’s catch up.</div>
                        <div className="typing-bubble"><i /><i /><i /></div>
                    </div>
                    <span className="story-footer">A place for your kind of people.</span>
                </aside>
                <div className="register-form-panel">
                    <div className="form-intro">
                        <span className="eyebrow">BACK TO THE CONVERSATION</span>
                        <h2 id="signin-title">Welcome<br />back.</h2>
                        <p>Sign in and make yourself at home.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="register-field">
                            <label htmlFor="signin-email">Email address</label>
                            <input type="email" id="signin-email" name="email" placeholder="you@example.com" />
                        </div>
                        <div className="register-field">
                            <label htmlFor="signin-password">Password</label>
                            <input type="password" id="signin-password" name="password" placeholder="Enter your password" />
                        </div>
                        <button type="submit" className="register-submit">Sign In <span aria-hidden="true">↗</span></button>
                        {message && <p className={`auth-message ${isSuccess ? "auth-message-success" : "auth-message-error"}`} role="status">{message}</p>}
                    </form>
                    <div className="form-footer"><span aria-hidden="true">✳</span> There’s always more to talk about.</div>
                </div>
            </section>
        </main>
    )
}

export default SignIn;
