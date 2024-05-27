import { useState } from "react";

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

export default LoginForm;
