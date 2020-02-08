import React, { Component } from 'react';
import Checkbox from '../components/Checkbox';
import Form from '../components/Form';
import Button from '../components/Button';
import { checkDuplicate } from '../apis/AuthApis';
import Msg from '../components/Msg';
import { axiosSignup } from '../apis/AuthApis';
import { connect } from 'react-redux';
import { login } from '../modules/auth';

class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            emailMsg: '',
            emailValidation: false,
            password1: '',
            password2: '',
            passwordMsg: '',
            passwordValidation: false,
            nickName: '',
            nickNameMsg: '',
            nickNameValidation: false,
            TOS: false,
        }
    }


    emailRegex = function (email) {
        const re = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        return re.test(email)
    }

    passwordRegex = function (password) {
        const re = /^[a-zA-Z0-9]{8,16}$/;
        return re.test(password)
    }

    handleEmailChange = async (e) => {
        await this.setState({
            ...this.state,
            email: e.target.value
        })
        if (!this.emailRegex(this.state.email)) {
            await this.setState({
                ...this.state,
                emailValidation: false,
                emailMsg: "올바른 이메일 형식이 아닙니다"
            })
        } else {
            const isDuplicated = await checkDuplicate("email", this.state.email);
            // const isDuplicated = true;
            if (isDuplicated) {
                this.setState({
                    ...this.state,
                    emailValidation: false,
                    emailMsg: "중복된 이메일입니다"
                })
            } else {
                this.setState({
                    ...this.state,
                    emailValidation: true,
                    emailMsg: "사용 가능한 이메일입니다"
                })
            }
        }
    }

    handlePassword1Change = async (e) => {
        await this.setState({
            ...this.state,
            password1: e.target.value
        })
        if (!this.passwordRegex(this.state.password1)) {
            await this.setState({
                ...this.state,
                passwordMsg: '비밀번호는 영문과 숫자로 구성된 8-16'
            })
        } else {
            await this.setState({
                ...this.state,
                passwordMsg: ''
            })
        }
    }

    handlePassword2Change = async (e) => {
        await this.setState({
            password2: e.target.value
        })
        if ((this.state.password1.length <= this.state.password2.length)
            && (this.state.password1 !== this.state.password2)) {
            await this.setState({
                ...this.state,
                passwordMsg: "비밀번호가 일치하지 않습니다"
            })
        } else {
            await this.setState({
                ...this.state,
                passwordMsg: ''
            })
        }
    }

    handleNickChange = async (e) => {
        await this.setState({
            ...this.state,
            nickName: e.target.value
        })
        if (!this.state.nickName) {
            await this.setState({
                ...this.state,
                nickNameValidation: false,
                nickNameMsg: ''
            })
        }
        const isDuplicated = await checkDuplicate("nickName", this.state.nickName);
        console.log(isDuplicated);
        // const isDuplicated = true;
        if (isDuplicated) {
            this.setState({
                ...this.state,
                nickNameValidation: false,
                nickNameMsg: "중복된 닉네임입니다"
            })
        } else {
            this.setState({
                ...this.state,
                nickNameValidation: true,
                nickNameMsg: ""
            })
        }
    }

    handleTosChange = async (e) => {
        await this.setState({
            ...this.state,
            TOS: !this.state.TOS
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }

    requestSignup = async () => {
        if (this.state.emailValidation
            && this.state.passwordValidation
            && this.state.nickNameValidation) {
            const user = await axiosSignup({
                email: this.state.email,
                password1: this.state.password1,
                nickName: this.state.nickName
            })
            this.props.login(user)
            // router 이동!
            return
        }
        if (!this.state.emailValidation) {
            this.setState({ emailMsg: "이메일은 필수입니다" })
        }
        if (!this.state.passwordValidation) {
            this.setState({ passwordMsg: "비밀번호는 필수입니다" })
        }
        if (!this.state.nickNameValidation) {
            this.setState({ nickNameMsg: "닉네임은 필수입니다" })
        }
        console.log(this.state.nickName)
    }

    tmp = (e) => {
        console.log(e)
    }

    render() {
        return (
            <div className="signup">
                <Form
                    value={this.state.email}
                    type="text"
                    placeholder="email"
                    handleChange={this.handleEmailChange}
                />
                <Msg
                    className="emailMsg"
                    msg={this.state.emailMsg}
                />
                <br />
                <Form
                    value={this.state.password1}
                    type="password"
                    placeholder="password"
                    handleChange={this.handlePassword1Change}
                />

                <br />
                <Form
                    value={this.state.password2}
                    type="password"
                    placeholder="confirm password"
                    handleChange={this.handlePassword2Change}
                />
                <br />
                <Msg
                    className="passwordMsg"
                    msg={this.state.passwordMsg}
                />
                <br />
                <Form
                    value={this.state.nickName}
                    type="text"
                    placeholder="nickname"
                    handleChange={this.handleNickChange}
                />
                <Msg
                    className="nickNameMsg"
                    msg={this.state.nickNameMsg}
                />
                <br />
                <Checkbox
                    className="TOS"
                    label="약관에 동의하시겠습니까?"
                    f={this.handleTosChange}
                />
                <br />
                <Button
                    className="signupBtn"
                    content="회원가입"
                    f={this.requestSignup}
                />
                <br />
                <Button
                    className="cancelBtn"
                    content="취소"
                    f={this.goBack}
                />
            </div>)
    }
}

export default connect(
    null,
    dispatch => ({
        login: (user) => dispatch(login(user))
    })
)(Signup);