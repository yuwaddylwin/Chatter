import { useEffect , useState} from "react";

const SearchUsers = ({onSelectUser}) => {
    // onSelectUser is a prop: a function the parent can supply when
    // you're ready to handle result clicks
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);


    //Input handler goes here
    const handleQueryChange = (e) => {
        // e.target.value -> reads the input's new text
        const nextQuery = e.target.value;
        const searchTerm = nextQuery.trim()

        setQuery(nextQuery)
        setUsers([]);
        setLoading(searchTerm.length >= 2);
        setError("");
        setHasSearched(false);
    }

    // Search effect goes here
    useEffect(()=> {
        const searchTerm = query.trim();

        if(searchTerm.length < 2){
            // return doesn't stop, just exit the current effect
            return;
        }

        // prevent "john" -> "johny" request sudden finish
        const controller = new AbortController();

        // Define the function that performs the search
        const searchUsers  = async () => {
            try{
                // Get the JWT so the frontend can authenticate with the backend.
                const token = sessionStorage.getItem("token");

                if(!token){
                    throw new Error("Please sign in before searching for users.");
                }
                
                // this one create like q=john
                const params = new URLSearchParams({q: searchTerm})

                // send the request to the backend 
                const response = await fetch(
                    `http://localhost:8000/api/users/search?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        signal: controller.signal,
                    }
                );
                const data = await response.json();

                if(!response.ok) {
                    throw new Error(data.message || "Could not search users");

                }

                if(!controller.signal.aborted){
                    setUsers(data.users);
                    setHasSearched(true);
                }
                }catch(error){
                    if(!controller.signal.aborted){
                        setError(error.message || "Something went wrong");
                    }
                }finally{
                    if(!controller.signal.aborted){
                        setLoading(false);
                    }
                }
        };
        // Wait until typing pauses instead of sending a request for every keystroke.
        const timeoutId = setTimeout(searchUsers, 300);
        
        // before running the effect for a new query, react runs the previous cleanup
        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        }
    }, [query])



    // JSX goes here
    return (

  // label
  <section className="w-full" aria-label="Find users">
    <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="user-search-input">Search users</label>

   {/* for input section */}
    <input
      id="user-search-input"
      type="search"
      placeholder="Search by username..."
      value={query}
      onChange={handleQueryChange}
      maxLength={20}
      aria-describedby="user-search-status"
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
    />

    <div id="user-search-status" role="status" className="mt-3 text-sm text-slate-500">
      {query.trim().length < 2 && (
        <p>Enter at least two characters.</p>
      )}

      {/* && means the JSX on the right is displayed only when the condition is true. */}
      {loading && <p>Searching...</p>}

      {!loading && error && (
        <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>
      )}

      {!loading && !error && hasSearched && users.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center">No users found. Try another username.</p>
      )}
    </div>

    {!loading && !error && users.length > 0 && (
      <ul className="mt-6 grid list-none gap-3 p-0">
        {users.map((user) => {
          const displayName = user.displayName?.trim() || user.username;

          const profileContent = (
            <>
              {user.profilePic ? (
                <img
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                  src={user.profilePic}
                  alt=""
                  width={48}
                  height={48}
                />
              ) : (
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-50 text-lg font-semibold text-indigo-600"
                  aria-hidden="true"
                >
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}

              <span className="grid min-w-0 gap-1">
                <strong className="truncate font-semibold text-slate-900">{displayName}</strong>
                <span className="truncate text-sm text-slate-500">@{user.username}</span>
              </span>
            </>
          );

          return (
            <li key={user._id}>
              {onSelectUser ? (
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={() => onSelectUser(user._id)}
                >
                  {profileContent}
                </button>
              ) : (
                <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left">{profileContent}</div>
              )}
            </li>
          );
        })}
      </ul>
    )}
  </section>
);
};

export default SearchUsers;
