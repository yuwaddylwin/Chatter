
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: {
            type: [
                {
                    // The user ID from the database
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            ],
            required: true,

            // Validate that the two users are different people
            validate: {
                validator(participants) {
                    return (
                        // Check that there are exactly two users
                        participants.length === 2 &&

                        // Check that the two users have different IDs
                        String(participants[0]) !== String(participants[1])
                    );
                },
                message: "A direct conversation needs two different users",
            },
        },

        directKey: {
            type: String,
            required: true,
            immutable: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create a unique index for each conversation pair
conversationSchema.index(
    { directKey: 1 },
    { unique: true }
);

// Create an index to find conversations by participants
conversationSchema.index({ participants: 1 });

// Create a model called Conversation using this schema. (pass 2 arguments)
const Conversation = mongoose.model(
    "Conversation",
    conversationSchema
);

export default Conversation;
