import React from "react";
import UserList from "../components/UserList";

const Users = () => {
    const USERS = [
        {
            id: "u1",
            name: "test1",
            image: "https://pic4.zhimg.com/80/v2-8e8bba07b79f771e9538299c05800207_1440w.webp",
            places: 3,
        },
    ];

    return <UserList items={USERS} />;
};

export default Users;
