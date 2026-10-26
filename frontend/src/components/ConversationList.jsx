import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

// onSelectConversation, refreshKey are props
function ConversationList({ onSelectConversation, refreshKey, currentUserId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // to cancel the request if you leave the page before we get the data
    const controller = new AbortController();

    async function loadConversation() {
      // code to get the convesations

      //start loading and clear previous errors
      setLoading(true);
      setError("");

      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please sign in to view conversations.");
        }

        const response = await fetch(`${API_URL}/conversations`, {
          headers: {
            //This code sends the token; it does not verify it. Verification happens on the backend.
            Authorization: `Bearer ${token}`,
          },
          //make this request but if my controller asks to cancel , stop it
          signal: controller.signal,
        });

        //convert the response to JSON
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.messsage || "Could not load conversations");
        }

        //if not controller abort, show the data
        if (!controller.signal.aborted) {
          setConversations(data.conversations ?? []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message || "Something went wrong!");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadConversation();
    return () => controller.abort();
  }, [refreshKey]);

  if (loading) return <p role="status">Loading conversations…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (conversations.length === 0) {
    return <p>You don’t have any conversations yet. Search for someone to start one.</p>;
  }

  return (
    <ul className="grid list-none gap-3 p-0">
      {conversations.map((conversation) => {
        // The current user is one participant. Show the other person.
        const otherUser = conversation.participants?.find(
          (participant) => participant._id !== currentUserId
        );

        // If currentUserId isn't included in the response, we’ll fix this
        // selection using the signed-in user's ID in the next step below.
        const name = otherUser?.username || "Conversation";

        return (
          <li key={conversation._id}>
            <button
              type="button"
              onClick={() => onSelectConversation?.(conversation)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="font-semibold text-slate-900">{name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default ConversationList;
