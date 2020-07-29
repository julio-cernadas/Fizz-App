//* -------------------------------------------------------------------------- */
//*                           COMMONS ACTIONS FOR DB                           */
//* -------------------------------------------------------------------------- */
// EQUIVALENT EXAMPLE:
// await User.findByIdAndUpdate(followId, { $push: { followers: userId } },
//     {new: true}).select("-hashed_password -salt")
//     .populate('following', '_id name')
//     .populate('followers', '_id name')
//     .exec()
const updateFollowersArray = async (User, userId, refId, action) => {
    const updateData = {};
    updateData["$" + action] = { following: userId };
    let user = await User.findByIdAndUpdate(refId, updateData, { new: true })
        .select("-hashed_password -salt")
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .exec();
    return user;
};


export default {
    updateFollowersArray,
};


