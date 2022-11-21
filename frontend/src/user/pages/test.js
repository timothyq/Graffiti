import React, { useContext, useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/hook-form";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import "./Auth.css";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginMode((prevMode) => !prevMode);
    };

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
        } else {
            try {
                setIsLoading(true);
                const response = await fetch(
                    process.env.REACT_APP_BACKEND_URL + "/users/signup",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: formState.inputs.name.value,
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value,
                        }),
                    }
                );

                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setIsLoading(false);
                auth.login();
            } catch (err) {
                setIsLoading(false);
                setError(
                    err.message || "Something went wrong, please try again."
                );
            }
        }
    };

    const errorHandler = () => {
        setError(null);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}

                <div className="shell">
                    <div className="top">
                        <span className={isLoginMode? "off" : "offtest"}>SIGN IN</span>
                        <div class="button" onClick={switchModeHandler}>
                            <div
                                className={isLoginMode ? "ball" : "balltest"}
                            ></div>
                        </div>
                        <span className={isLoginMode? "ontest": "on"}>SIGN UP</span>
                    </div>

                    <div className={isLoginMode ? "bottom" : "bottomtest"}>
                        <div className="signIn">
                            <form onSubmit={authSubmitHandler}>
                                <Input
                                    element="input"
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    validators={[VALIDATOR_EMAIL()]}
                                    errorText="Please enter a valid email address."
                                    onInput={inputHandler}
                                />
                                <Input
                                    element="input"
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    validators={[VALIDATOR_MINLENGTH(5)]}
                                    errorText="Please enter a valid password, at least 5 characters."
                                    onInput={inputHandler}
                                />
                                <button>GO</button>
                            </form>
                        </div>

                        <div>
                            <form onSubmit={authSubmitHandler}>
                                <Input
                                    element="input"
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    validators={[VALIDATOR_REQUIRE]}
                                    errorText="Please enter a name."
                                    onInput={inputHandler}
                                />
                                <Input
                                    element="input"
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    validators={[VALIDATOR_EMAIL()]}
                                    errorText="Please enter a valid email address."
                                    onInput={inputHandler}
                                />
                                <Input
                                    element="input"
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    validators={[VALIDATOR_MINLENGTH(5)]}
                                    errorText="Please enter a valid password, at least 5 characters."
                                    onInput={inputHandler}
                                />
                                <button>GO</button>
                                <Button
                                    type="submit"
                                    disabled={!formState.isValid}
                                >
                                    {isLoginMode ? "LOGIN" : "SIGNUP"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </Card>
        </React.Fragment>
    );
};

export default Auth;
