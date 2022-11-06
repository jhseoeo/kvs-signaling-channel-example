import React, { useState } from 'react'
import Header from "../header"
import ReactJsAlert from "reactjs-alert";

function Register(props) {
    const [input, setInput] = useState({
        id: '',
        nickname: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState({
        // username: '',
        password: '',
        confirmPassword: ''
    });

    const onInputChange = e => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
        validateInput(e);
    }

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [quote, setQuote] = useState("");
    const [success, setSuccess] = useState(false);

    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };

            switch (name) {
                // case "username":
                //     if (!value) {
                //         stateObj[name] = "Please enter Username.";
                //     }
                //     break;

                // case "password":
                //     if (!value) {
                //         stateObj[name] = "Please enter Password.";
                //     } else if (input.confirmPassword && value !== input.confirmPassword) {
                //         stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
                //     } else {
                //         stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
                //     }
                //     break;

                case "confirmPassword":
                    // if (!value) {
                    //     stateObj[name] = "Please enter Confirm Password.";
                    // } 
                    if (input.password && value && value !== input.password) {
                        stateObj[name] = "비밀번호가 일치하지 않습니다";
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    }

    const callback = () => {
        if (success) {
            window.location.href="/login"
        } else {
            window.location.href="/register"
        }
    }

    const register = async () => {
        const res = await fetch(process.env.REACT_APP_PROXY_HOST + "/auth/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: input.id,
                password: input.password,
                nickname: input.nickname
            })
        }).then(res => res.json());

        if (res.ok) {
            setStatus(true);
            setType("success");
            setTitle("회원가입에 성공하였습니다.");
            setQuote("로그인 페이지로 이동합니다.");
            setSuccess(true)
        } else {
            setStatus(true);
            setType("error");
            setTitle("회원가입에 실패하였습니다");
            // setQuote(res.reason);
            setQuote("res.reason");
            setSuccess(false)
        }
    }


    return (
        <div>
            <Header/>
            <div className="text-center m-5-auto">
                <h2>회원가입</h2>
                <form>
                    <p>
                        <label>ID</label><br />
                        <input type="text" name="id" onChange={onInputChange} required />
                    </p>

                    <p>
                        <label>Nickname</label><br />
                        <input type="text" name="nickname" onChange={onInputChange} required />
                    </p>
                    <p>
                        <label>Password</label><br />
                        <input type="password" name="password" onChange={onInputChange} required />
                    </p>
                    <p>
                        <label>Confirm Password</label><br />
                        <input type="password" name="confirmPassword" onChange={onInputChange} required /><br />
                        {error.confirmPassword && <span className='err'  >{error.confirmPassword}</span>}
                    </p>


                    <p>
                        <button id="sub_btn" type="button" disabled={!(input.id && input.nickname && input.password && input.confirmPassword && !error.confirmPassword)} onClick={register}>Register</button>
                    </p>
                </form>

                <ReactJsAlert
                    status={status}
                    type={type}
                    title={title}
                    quotes={true}
                    quote={quote}
                    button={"확인"}
                    autoCloseIn={99999999}
                    Close={callback}
                />
            </div>

            
        </div>
    )
}

export default Register;