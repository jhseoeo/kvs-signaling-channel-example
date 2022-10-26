import React, { useState } from 'react'
import Header from "../header"

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


    return (
        <div>
            <Header/>
            <div className="text-center m-5-auto">
                <h2>회원가입</h2>
                <form action="/">

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
                        <button id="sub_btn" type="submit" disabled={!(input.id && input.nickname && input.password && input.confirmPassword && !error.confirmPassword)}>Register</button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register;