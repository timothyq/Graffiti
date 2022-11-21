import React, { useEffect, useState} from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/hook-http";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import Title from "../components/Title";
import ImageGrid from "../components/ImageGrid";



const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;
    //To send AJAX request in React(asks for uploaded images)
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/api/users/places", {
            method: "POST",
            body: JSON.stringify({ email: userId }),
            //headers tell backend that body is json style
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                console.log(res);
                return res.json();
            })
            .then(
                (result) => {
                    setPlaces(result.places);
                },
                (error) => {
                    console.log("UserPlaces can not get images!");
                    console.log(error);
                }
            );
    }, [userId]);

    return (
        <div>
            <Title />
            <ImageGrid places={places} />
        </div>
    );
};

export default UserPlaces;
