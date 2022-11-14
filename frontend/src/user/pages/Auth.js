import React, { useState, useContext } from "react";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/hook-form";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: "",
                valid: false,
            },
            password: {
                value: "",
                valid: false,
            },
        },
        false
    );

    const switchModelHandler = () => {
        if (!isLoginMode) {
            setFormData(
                { ...formState.inputs, name: undefined },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                { ...formState.inputs, name: { value: "", isValid: false } },
                false
            );
        }
        setIsLoginMode((preMode) => !preMode);
    };
    const authSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
        auth.login()
    };

    return (
        <Card className="authentication">
            <h2>Login</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && (
                    <Input
                        element="input"
                        id="name"
                        type="name"
                        label="Username"
                        validators={[VALIDATOR_REQUIRE]}
                        errroText="Please enter a non-empty name."
                        onInput={inputHandler}
                    ></Input>
                )}
                <Input
                    element="input"
                    id="email"
                    type="email"
                    label="Email"
                    validators={[VALIDATOR_EMAIL()]}
                    errroText="Please enter a valid email address."
                    onInput={inputHandler}
                ></Input>
                <Input
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errroText="Please enter a valid password, at least 5 characters."
                    onInput={inputHandler}
                ></Input>
                <Button type="submit" disabled={!formState.isValid}>
                    {isLoginMode ? "Login" : "Sign up"}
                </Button>
            </form>
            <Button inverse onClick={switchModelHandler}>
                SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
            </Button>
        </Card>
    );
};

export default Auth;
