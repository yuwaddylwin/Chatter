import User from "../models/user.js";

const SearchUsers = async (req, res) => {
    // Get the search query from the request query parameters 
    //    /api/users/search?q=Yuwaddy
    const {q} = req.query;

    if (typeof q !== "string" || !q.trim()){
        return res.status(400).json({
            message: "Search query is required.",   
        })
    }

    const searchTerm = q.trim();

    if (searchTerm.length > 20){
        return res.status(400).json({
            message: "Search query must be 20 characters or fewer"
        })
    }

    const escapedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    try{
        const users = await User.find({
            _id: {$ne: req.userId},
            username: {
                $regex: escapedSearchTerm,
                $options: "i"
            }
        })
        // this tell  which fields to return from MongoDB
        .select("_id username profilePic")
        // Sort the results ascending order
        .sort({username: 1, _id: 1})
        // limit the results
        .limit(20)
        // .lean() tells mongoose to return plain JS objects instead
        .lean();

    //return the result to the frontend 
    return res.status(200).json({users});
    
    }catch(error){
        console.error("Searching users failed:", error);

        return res.status(500).json({
            message: "Error searching users"
        })
    }
}

export {SearchUsers};