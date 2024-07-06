import { useState } from "react";
import PropTypes from "prop-types";

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function onSubmit(event) {
        handleLogin(event, username, password)
            .then(() => {
                setUsername("");
                setPassword("");
            });
    }

    return (
        <form
            onSubmit={e => onSubmit(e)}
        >
            <div>
                username
                <input
                    name="Username"
                    type="text"
                    value={username}
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    name="Password"
                    type="password"
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )
};

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
