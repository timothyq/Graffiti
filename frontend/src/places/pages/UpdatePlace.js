import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/hook-form";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./PlaceForm.css";

const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Two Embarcadera Center",
        description: "WeWork building!",
        imageUrl:
            "https://res.cloudinary.com/wework/image/upload/c_scale,w_800/v1/Defaults_DO_NOT_DELETE/Meeting/bookable-placeholder-05.jpg",
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
        imageUrl:
            "https://res.cloudinary.com/wework/image/upload/c_scale,w_800/v1/Defaults_DO_NOT_DELETE/Meeting/bookable-placeholder-05.jpg",
        address: "One Embarcadero Center, San Francisco, CA 94111",
        location: {
            lat: 37.7947923,
            lng: -122.4005988,
        },
        creator: "u2",
    },
];

const UpdatePlace = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

    useEffect(() => {
        if (identifiedPlace) {
            setFormData(
                {
                    title: {
                        value: identifiedPlace.title,
                        isValid: true,
                    },
                    description: {
                        value: identifiedPlace.description,
                        isValid: true,
                    },
                },
                true
            );
        }

        setIsLoading(false);
    }, [setFormData, identifiedPlace, isLoading]);

    const placeUpdateSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    if (!identifiedPlace) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (at least 5 characters)."
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
                Update Place
            </Button>
        </form>
    );
};

export default UpdatePlace;
