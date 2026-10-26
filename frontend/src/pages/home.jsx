import { useState } from "react";
import { useLocation } from "react-router-dom";
import ConversationList from "../components/ConversationList.jsx";
import SearchUsers from "../components/SearchUsers.jsx";

const Home = () => {
  const location = useLocation();
  const user = location.state?.user; // Access the user data passed from the SignIn page

  // THESE ARE THE CODES FOR THE CONVERSATION
  //Think of refreshKey as a number that tells the conversation list when to refresh.
  const [refreshKey, setRefreshKey] = useState(0);
  const [conversationError, setConversationError] = useState("");

  // This defines a function that runs when you select another user.
  const handleSelectUser = async (otherUserId) => {
    setConversationError("");

    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please sign in to start a conversation.");
      }

      const response = await fetch("http://localhost:8000/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not start the conversation.");
      }

      // The POST either creates a conversation or returns the existing one.
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setConversationError(error.message || "Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl rounded-bl-sm bg-indigo-500 text-white">c</span>
          <span>chatter<span className="text-indigo-500">.</span></span>
        </div>
        <header className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-500">Your community</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back{user?.username ? `, ${user.username}` : ""}!
            <span className="ml-2 inline-block" aria-hidden="true">👋</span>
          </h1>
          <p className="mt-3 leading-relaxed text-slate-500">A familiar face. A new conversation. Find your people.</p>
        </header>

        <section aria-labelledby="conversations-title" className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 id="conversations-title" className="mb-5 text-xl font-semibold tracking-tight text-slate-900">
            Your conversations
          </h2>
          <ConversationList
            currentUserId={user?.id || user?._id}
            refreshKey={refreshKey}
            onSelectConversation={(conversation) => {
              console.log("Selected conversation:", conversation._id);
            }}
          />
        </section>

        <section aria-labelledby="discover-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 border-b border-slate-100 pb-6">
            <h2 id="discover-title" className="text-xl font-semibold tracking-tight text-slate-900">Discover people</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Find people in your community.</p>
          </div>
          <SearchUsers onSelectUser={handleSelectUser} />
          {conversationError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {conversationError}
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;
