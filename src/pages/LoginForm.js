import React, { useState } from 'react';
import buttonBottom from '../Olfa2bottom.svg';
import buttonTop from '../Olfa2top.svg';
import spinner from '../spinner.svg';
import spntxt from '../spintxt.svg';
import Parse from 'parse/dist/parse.min.js';

function LoginForm(props) {

  const [isCheckedLog, setIsCheckedLog] = useState(false);
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [loginForm, setLoginForm] = useState({
    "user": "",
    "pass": ""
  });
  const [signinForm, setSigninForm] = useState({
    "user": "",
    "pass": "",
    "pass2": ""
  });


  const onChangeHandlerLog = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const onChangeHandlerSign = (e) => {
    const { name, value } = e.target;
    setSigninForm((prevState) => ({ ...prevState, [name]: value }));
  };


  const handleClickLog = async () => {
    const dialog = document.querySelector("dialog");
    const usernameValue = loginForm.user;
    const passwordValue = loginForm.pass;
    let top = document.getElementById("topButton");
    let bottom = document.getElementById("bottomButton");
    top.classList.toggle("fade");
    bottom.classList.toggle("fade");

    if (loginForm.user !== "" && loginForm.pass !== "")
      try {
        let parseQuery = new Parse.Query('Options');
        parseQuery.equalTo('username', usernameValue);
        dialog.showModal();
        const loggedUser = await Parse.User.logIn(usernameValue, passwordValue);
        let queryResults = await parseQuery.find();
        for (let result of queryResults) {
          props.statusRedColor(result.get('red'));
          props.statusGreenColor(result.get('green'));
          props.statusBlueColor(result.get('blue'));
          props.statusOptions(result.id);
          props.statusName(result.get('name'));
          props.statusTheme(result.get('theme'));
        }
        props.statusUser(loggedUser);
        dialog.close();
        if (isCheckedLog !== false) {
          localStorage.setItem("OpUser1", usernameValue);
          localStorage.setItem("OpPass1", passwordValue);
        }
        return setTimeout(props.statusPage(3), 1000);
      } catch (error) {
        dialog.close();
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Error! ${error.message}`)
        top.classList.toggle("fade");
        bottom.classList.toggle("fade");
        return false
      }
    top.classList.toggle("fade")
    bottom.classList.toggle("fade");
    return

  }

  const handleClickSign = async () => {
    const dialog = document.querySelector("dialog");
    const usernameValue = signinForm.user;
    const passwordValue = signinForm.pass;
    let top = document.getElementById("topButton2");
    let bottom = document.getElementById("bottomButton2");
    top.classList.toggle("fade");
    bottom.classList.toggle("fade");
    if (signinForm.user.trim() === "") return alert("Error! Username not Allowed.")
    if (signinForm.user !== "" && signinForm.pass !== "" && signinForm.pass2 !== "")
      try {
        let Options = new Parse.Object('Options');
        Options.set('username', usernameValue);
        Options.set('name', usernameValue);
        Options.set('red', 67);
        Options.set('green', 67);
        Options.set('blue', 67);
        Options.set('theme', 1);
        props.statusName(usernameValue);
        dialog.showModal();
        const loggedUser = await Parse.User.signUp(usernameValue, passwordValue);
        await Options.save();
        props.statusUser(loggedUser);
        dialog.close();
        if (isCheckedSign !== false) {
          localStorage.setItem("OpUser1", usernameValue);
          localStorage.setItem("OpPass1", passwordValue);
        }
        return setTimeout(props.statusPage(3), 1000);
      } catch (error) {
        dialog.close();
        // signUp can fail if any parameter is blank or failed an uniqueness check on the server
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Error! ${error}`);
        top.classList.toggle("fade");
        bottom.classList.toggle("fade");
        return false;
      }

    top.classList.toggle("fade");
    bottom.classList.toggle("fade");
    return

  }

  return (

    <div className="App-header">
      <h1>Registrati o Accedi:</h1>

      <div className='Form-box'>
        <div className='log-in-box'>
          <h3>Login</h3>

          <form className='Login-forms' onSubmit={e => e.preventDefault(e)} >
            <label>Account:</label><input placeholder='Username' name='user' type='text' value={loginForm.user} onChange={(e) => onChangeHandlerLog(e)} maxLength="20" autoComplete="new-off" required></input>
            <label>Password:</label><input placeholder='Password' name='pass' type='password' value={loginForm.pass} onChange={(e) => onChangeHandlerLog(e)} maxLength="20" autoComplete="new-off" required></input>

            <label><p className='Botton-text'>Ricordare account su questo dispositivo?</p><input type='checkbox' checked={isCheckedLog} onChange={() => setIsCheckedLog(!isCheckedLog)} ></input></label>

            <button className='Button-special-micro' onClick={handleClickLog} type='submit' alt="login-button" >
              <p className='Botton-text' >Accedi</p>
              <img src={buttonTop} className="App-button-top-micro" id='topButton' alt="button" />
              <img src={buttonBottom} className="App-button-bottom-micro" id='bottomButton' alt="button" />

            </button>

          </form>
        </div>

        <div className='sign-in-box'>
          <h3>Signin</h3>

          <form className='Login-forms' onSubmit={e => e.preventDefault(e)} >
            <label>Nome Account:</label><input placeholder='Username' name='user' type='text' value={signinForm.user} onChange={(e) => onChangeHandlerSign(e)} maxLength="20" autoComplete="new-off" required></input>
            <label>Password:</label><input placeholder='Password' name='pass' type='password' value={signinForm.pass} onChange={(e) => onChangeHandlerSign(e)} maxLength="20" autoComplete="new-off" required></input>
            <label>Ripeti la Password:</label><input placeholder='Ripeti la password' name='pass2' type='password' value={signinForm.pass2} onChange={(e) => onChangeHandlerSign(e)} maxLength="20" autoComplete="new-off" required></input>

            <label><p className='Botton-text'>Ricordare account su questo dispositivo?</p><input type='checkbox' checked={isCheckedSign} onChange={() => setIsCheckedSign(!isCheckedSign)} ></input></label>

            <button className='Button-special-micro' onClick={handleClickSign} type='submit' alt="signin-button" >
              <p className='Botton-text' >Registrati</p>
              <img src={buttonTop} className="App-button-top-micro" id='topButton2' alt="button" />
              <img src={buttonBottom} className="App-button-bottom-micro" id='bottomButton2' alt="button" />

            </button>
          </form>
        </div>
        <dialog><img src={spinner} className='spinner' alt='loading-spinner' />
          <img src={spntxt} className='spinner-text' alt='loading-spinner-text' /><div className='loading'>Caricamento...</div></dialog>
      </div>
    </div>
  );
}

export default LoginForm;