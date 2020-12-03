import React, { useState } from "react";
import { Row, Col, Form, Button, Image, Container } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
    query login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            username
            email
            createdAt
            token
        }
    }
`;

export default function Login(props) {
    const [variables, setVariables] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const dispatch = useAuthDispatch();

    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
        onCompleted(data) {
            dispatch({ type: "LOGIN", payload: data.login });
            window.location.href = "/";
        },
    });

    const submitLoginForm = (e) => {
        e.preventDefault();

        loginUser({ variables });
    };

    return (
        <Row className="bg-white justify-content-center h-80 login-row">
            <Col sm={9} md={6} lg={6} className="bg-secondary">
                <div className="col-lg-8 mx-auto px-5 py-5 mt-4">
                    <div className="text-center pb-4">
                        <h1>Login</h1>
                        <small>Try username "demo" with password "demo"</small>
                    </div>

                    <Form onSubmit={submitLoginForm}>
                        <Form.Group>
                            <Form.Label
                                className={errors.username && "text-danger"}
                            >
                                {errors.username ?? "Username"}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={variables.username}
                                className={errors.username && "is-invalid"}
                                onChange={(e) =>
                                    setVariables({
                                        ...variables,
                                        username: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label
                                className={errors.password && "text-danger"}
                            >
                                {errors.password ?? "Password"}
                            </Form.Label>
                            <Form.Control
                                type="password"
                                value={variables.password}
                                className={errors.password && "is-invalid"}
                                onChange={(e) =>
                                    setVariables({
                                        ...variables,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button
                                className="m-3"
                                variant="success"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "loading.." : "Login"}
                            </Button>
                            <br />
                            <small>
                                Don't have an account?{" "}
                                <Link to="/register">Register</Link>
                            </small>
                        </div>
                    </Form>
                </div>
            </Col>
            <Col sm={3} md={6} lg={6}>
                <Image src="images/unlock.svg" fluid className="p-5" />
            </Col>
        </Row>
    );
}
