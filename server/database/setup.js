import mongoose from "mongoose";

// * Establish Connection URL
export default function (mongoURI) {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on("error", () => {
        throw new Error(`Shutting down application: ${mongoURI}`);
    });

    mongoose.set('useFindAndModify', false);
}
