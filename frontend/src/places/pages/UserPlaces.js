import React from "react";
import { useParams } from "react-router-dom";
import Title from "../components/Title";
import ImageGrid from "../components/ImageGrid";

const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Two Embarcadera Center",
        description: "WeWork building!",
        url: "https://res.cloudinary.com/wework/image/upload/c_scale,w_800/v1/Defaults_DO_NOT_DELETE/Meeting/bookable-placeholder-05.jpg",
        address: "Two Embarcadero Center, San Francisco, CA 94111",
        location: {
            lat: 37.7947923,
            lng: -122.4005988,
        },
        creator: "u1",
    },
    {
        id: "p2",
        title: "One Embarcadera Center",
        description: "Shopping !",
        url: "https://res.cloudinary.com/wework/image/upload/c_scale,w_800/v1/Defaults_DO_NOT_DELETE/Meeting/bookable-placeholder-05.jpg",
        address: "One Embarcadero Center, San Francisco, CA 94111",
        location: {
            lat: 37.7947923,
            lng: -122.4005988,
        },
        creator: "u1",
    },
    {
        id: "p3",
        title: "Two Embarcadera Center",
        description: "WeWork building!",
        url: "https://res.cloudinary.com/wework/image/upload/c_scale,w_800/v1/Defaults_DO_NOT_DELETE/Meeting/bookable-placeholder-05.jpg",
        address: "Two Embarcadero Center, San Francisco, CA 94111",
        location: {
            lat: 37.7947923,
            lng: -122.4005988,
        },
        creator: "u1",
    },
];

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(
        (place) => place.creator === userId
    );
    return (
        <div>
            <Title />
            <ImageGrid places={loadedPlaces} />
        </div>
    );
};

export default UserPlaces;
