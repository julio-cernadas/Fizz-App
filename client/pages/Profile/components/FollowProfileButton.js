import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";

import { unfollow, follow } from "./../../../services/api/users/api-user.js";

export default function FollowProfileButton(props) {
    const followClick = () => {
        props.onButtonClick(follow);
    };
    const unfollowClick = () => {
        props.onButtonClick(unfollow);
    };
    return (
        <div>
            {props.following ? (
                <Button variant="contained" color="secondary" onClick={unfollowClick}>
                    Unfollow
                </Button>
            ) : (
                <Button variant="contained" color="primary" onClick={followClick}>
                    Follow
                </Button>
            )}
        </div>
    );
}

//* Typing checking our passed props...
FollowProfileButton.propTypes = {
    following: PropTypes.bool.isRequired,
    onButtonClick: PropTypes.func.isRequired,
};
