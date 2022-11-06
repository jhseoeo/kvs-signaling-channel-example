import React, { useState } from 'react'
import Header from "../header"
import { setCookie } from '../../lib/cookie';
import Button from 'react-bootstrap/Button';
import ReactJsAlert from "reactjs-alert";


function Login(props) {

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    const callback = () => {
        window.location.href = "/login"
    }

    const [input, setInput] = useState({
        id: '',
        password: ''
    });

    const onInputChange = e => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const onClickFunc = async () => {
        const res = await fetch(process.env.REACT_APP_PROXY_HOST + "/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: input.id,
                password: input.password,
            })
        }).then(res => res.json());

        if (res.ok) {
            setCookie("access", "Bearer " + res.data.accessToken);
            setCookie("refresh", "Bearer " + res.data.refreshToken);
            window.location.href = "/modeSelector"
        } else {
            setTitle("로그인에 실패하였습니다.")
            setStatus(true)
            setType("error")
        }
    }

    return (
        <div>
            <Header/>
            <div  className="text-center m-5-auto">
                <h2>로그인</h2>
                <form>
                    <p>
                        <label>ID</label><br/>
                        <input type="text" name="id" onChange={onInputChange} required />
                    </p>
                    <p>
                        <label>Password</label>
                        <br/>
                        <input type="password" name="password" onChange={onInputChange} required />
                    </p>
                    <div style={{marginTop:"20pt"}}> 
                        <button type='button' id="sub_btn" onClick={onClickFunc}>Login</button>
                        <Button style={{
                            fontSize:"10pt"
                        }} variant="link" onClick={() => {window.location.href = "/register";}}>회원가입</Button>
                    </div>
                </form>
            </div>

            <ReactJsAlert
                    status={status}
                    type={type}
                    title={title}
                    button={"확인"}
                    autoCloseIn={99999999}
                    Close={callback}
                />
        </div>
    )
}

export default Login;
