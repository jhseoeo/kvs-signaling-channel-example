import React, { useState } from 'react'
import Header from "../header"
import Button from 'react-bootstrap/Button';


function Login(props) {

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

    const onClickFunc = () => {
        console.log(`ID ${input.id} Password ${input.password}`)
    }

    return (
        <div>
            <Header/>
            <div  className="text-center m-5-auto">
                <h2>로그인</h2>
                <form action="/">
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
                        <button  id="sub_btn" onClick={onClickFunc}>Login</button>
                        <Button style={{
                            fontSize:"10pt"
                        }} variant="link" onClick={() => {window.location.href = "/register";}}>회원가입</Button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default Login;
