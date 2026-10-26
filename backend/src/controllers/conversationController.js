import mongoose from "mongoose";
import Conversation from "../models/conversation.js";
import User from "../models/user.js";


// create a function to test if the Id is valid string or not
function isValidId(value){
    return (
        typeof value === "string" && 
        /^[a-fA-F0-9]{24}$/.test(value)
    );
}

// uppercase & lowercase can represent the same mongoDB ID

// console.log(userId);
// ObjectId("671a2b3c4d5e6f7890123456")
//console.log(userId.toHexString());
// "671a2b3c4d5e6f7890123456"
function normalizeId(value){
    return new mongoose.Types.ObjectId(value).toHexString();
}


function publicConversationQuery(query){
    return query
    .select("_id participants createdAt updatedAt")
    .populate("participants", "_id username profilePic");
}
// This publicConversationQuery function return conversation data with only the fields you want to expose, and replace participant IDs with selected user information.
// {
//   _id: "conversation123",
//   participants: ["userA_ID", "userB_ID"],
//   createdAt: "...",
//   updatedAt: "..."
// }
// {
//   participants: [
//     {
//       _id: "userA_ID",
//       username: "yu",
//       profilePic: "yu.jpg"
//     },
//     {
//       _id: "userB_ID",
//       username: "john",
//       profilePic: "john.jpg"
//     }
//   ]
// }



// Create or Retrieve handler for the conversation
const StartDirectConversation = async (req, res) => {
    // this request contains otherUserId
    const body = req.body;
    
    // checking the otherUserId sends from the frontend
    if (
        !body || 
        typeof body !== "object" ||
        Array.isArray(body) ||
        Object.keys(body).some((key) => key !== "otherUserId") ||
        !isValidId(body.otherUserId)
    ){
        return res.status(400).json({
            message: "Send only a valid otherUserId"
        })
    }


    const currentUserId = normalizeId(req.userId);
    const otherUserId = normalizeId(body.otherUserId);

    if(currentUserId === otherUserId){
        return res.status(400).json({
            message: "You cannot start a conversation with yourself."
        })
    }
    
    // check whether the other user exists
    try{
        const otherUserExists = await User.exists({
            _id: otherUserId,
        });

        if(!otherUserExists){
            return res.status(404).json({
                message: "User not found",
            })
        }


        // creating directKey with :
        const participants = [currentUserId, otherUserId].sort();
        const directKey = participants.join(":")

        // Conversation is from the mongoose model
        const existing = await publicConversationQuery(
            Conversation.findOne({directKey})
        );

        if(existing){
            return res.status(200).json({
                conversation: existing,
            })
        }

        // not signing a value cuz we don't know to create a new conversation or retrieve one that alrady exits
        let conversation;
        let created = false;

        try{
            conversation = await Conversation.create({
                // recall the earlier codes 
                participants,
                directKey,
            });
            created = true;
        }catch(error){
            // 11000 is for MongoDB duplicate-key error
            if(error.code !== 11000){
                throw error;
            }
        }

        const result = await publicConversationQuery(
            Conversation.findOne({
                directKey,
                participants: currentUserId,
            })
        );
        
        // 201 created true , 200 OK false alrady exist
        return res.status(created ? 201 : 200).json({
            conversation: result,
        });
    }catch(error){
        console.error("Starting conversation failed:", error);
        return res.status(500).json({
            message: "Could not start conversation",
        });
    }

// This sends a JSON response to the frontend
// {
//   "conversation": {
//     "_id": "conversation123",
//     "participants": ["userA", "userB"],
//     "directKey": "userA:userB"
//   }
// }
};


// Handler to Gets all the direct conversations
const ListMyConversations = async(req, res) => {
    try{
        const conversations = await publicConversationQuery(
            Conversation.find({
                // return documents whose participants array contains this user
                participants: req.userId,
                }).sort({
                    // sort by most recently updated first
                    updatedAt: -1,
                    _id: -1,
            })
        );

        return res.status(200).json({
            conversations,
        });
    }catch(error){
        console.error("Listing conversation failed:", error);

        return res.status(500).json({
            messsage: "Could not load conversations",
        });
    }
};

// For Accessing one conversation
const GetConversation = async(req, res)=> {
    const {conversationId} = req.params;

    if(!isValidId(conversationId)){
        return res.status(400).json({
            message: "Invalid conversation ID",
        })
    }

    try{
        const conversation = await publicConversationQuery(
            Conversation.findOne({
                _id: conversationId,
                participants: req.userId,
            })
        );

        if(!conversation){
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        return res.status(200).json({
            conversation,
        });
    }catch(error){
        console.error("Fetching conversation failed:", error);

        return res.status(500).json({
            message: "Could not load conversation",
        })
    }
}

export {StartDirectConversation,
     ListMyConversations, 
     GetConversation};
