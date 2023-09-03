import React, { useState, useEffect } from 'react';
import buttonBottom from '../Olfa2bottom.svg';
import buttonTop from '../Olfa2top.svg';
import spinner from '../spinner.svg'
import spntxt from '../spintxt.svg'
import Parse from 'parse/dist/parse.min.js';
import LoginForm from './LoginForm';
import ContentPage from "./ContentPage";

function LandingPage() {

  const [currentUser, setCurrentUser] = useState();
  const [isLogged, setIsLogged] = useState(1);
  const [redHue, setRedHue] = useState(67);
  const [greenHue, setGreenHue] = useState(67);
  const [blueHue, setBlueHue] = useState(67);
  const [optionsId, setOptionsId] = useState();
  const [name, setName] = useState();
  const [themeValue, setThemeValue] = useState(1);
  const root = document.documentElement;


  useEffect(() => {
    const doUserLogIn = async function () {
      const usernameValue = localStorage.getItem("OpUser1");
      const passwordValue = localStorage.getItem("OpPass1");
      const dialog = document.querySelector("dialog");

      if (usernameValue === null) return
      try {
        let parseQuery = new Parse.Query('Options');
        parseQuery.equalTo('username', usernameValue);
        dialog.showModal();
        let queryResults = await parseQuery.find();
        const loggedInUser = await Parse.User.logIn(usernameValue, passwordValue);
        dialog.close();
        for (let result of queryResults) {
          setRedHue(result.get('red'));
          setGreenHue(result.get('green'));
          setBlueHue(result.get('blue'));
          setName(result.get("name"));
          setOptionsId(result.id);
          setName(result.get('name'));
          setThemeValue(result.get('theme'));
        }
        return changeCurrentUser(loggedInUser);

      } catch (error) {
        dialog.close();
        return changeCurrentUser(null)
      }
    };

    doUserLogIn();
  }, []);

  useEffect(() => {
    root.style.setProperty('--red', redHue);
    root.style.setProperty('--green', greenHue);
    root.style.setProperty('--blue', blueHue);

  }, [redHue, greenHue, blueHue, root.style]);


// In dev. change path to "url(../xxxx.svg)"

  useEffect(() => {
    if (themeValue === 3) {
      root.style.setProperty('--background', "url(/static/media/Piuma-model-dmd.svg)");
    }
    if (themeValue === 2) {
      root.style.setProperty('--background', "url(/static/media/Scheletro-motive-final.svg)");
    }
    if (themeValue === 1) {
      root.style.setProperty('--background', "url(/static/media/motivo2-2.svg)");
    }
  }, [themeValue,root.style]);

  const changeCurrentTheme = (nTheme) => {
    setThemeValue(nTheme);
  }

  const changeCurrentUser = (user) => {
    setCurrentUser(user);
  }

  const changeStatusPage = (n) => {
    setIsLogged(n);
  }

  const changeStatusOptions = (id) => {
    setOptionsId(id);
  }

  const changeStatusName = (name) => {
    setName(name);
  }

  const handleRedColorChange = (color) => {
    setRedHue(color)
  };

  const handleGreenColorChange = (color) => {
    setGreenHue(color)
  };

  const handleBlueColorChange = (color) => {
    setBlueHue(color)
  };


  const doUserLogOut = async function () {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const loggedUser = await Parse.User.current();
      changeCurrentUser(loggedUser);
      localStorage.removeItem("OpUser1");
      localStorage.removeItem("OpPass1");
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  const handleClickAppButton = () => {
    let top = document.getElementById("topButton");
    let bottom = document.getElementById("bottomButton");
    let back = document.getElementById("appHeader");
    top.classList.toggle("fade");
    bottom.classList.toggle("fade");
    back.classList.toggle("fade");
    if (!currentUser) return setTimeout(() => { changeStatusPage(2) }, 600);
    if (currentUser) return setTimeout(() => { changeStatusPage(3) }, 600);
    return
  };

  return (
    <header className="App-header" id='appHeader' >
      {isLogged === 1 ?
        <>
          <div className='Header-text'>
            <h1>One List For All 2</h1>
          </div>
          

          <button className='Button-special-land' onClick={handleClickAppButton} >
            <h3 className='Botton-text-land' ><p>ACCEDI</p></h3>
            <img src={buttonTop} className="App-button-top-land" id='topButton' alt="button" />
            <img src={buttonBottom} className="App-button-bottom-land" id='bottomButton' alt="button" />

          </button>
          {currentUser != null ?
            <div className='Botton-text-land2'>
              <p>
                STATUS: ACCOUNT VERIFICATO
              </p>
              <button className='button-nav' value="Logout" onClick={doUserLogOut}><span>Logout</span></button>
            </div>
            :
            <div className='Botton-text-land2'>
              <p>
                STATUS: ACCOUNT NON VERIFICATO
              </p>
            </div>
          }
          <dialog><img src={spinner} className='spinner' alt='loading-spinner' />
            <img src={spntxt} className='spinner-text' alt='loading-spinner-text' /><div className='loading'>Caricamento...</div></dialog>
        </>
        :
        null}

      {isLogged === 1 ?
        null
        :
        isLogged === 2 ?
          <LoginForm
            statusPage={changeStatusPage}
            statusRedColor={handleRedColorChange}
            statusGreenColor={handleGreenColorChange}
            statusBlueColor={handleBlueColorChange}
            statusOptions={changeStatusOptions}
            statusName={changeStatusName}
            statusTheme={changeCurrentTheme}
            statusUser={changeCurrentUser}
          />
          :
          isLogged === 3 ?
            <ContentPage
              statusPage={changeStatusPage}
              statusUser={changeCurrentUser}
              statusRedColor={handleRedColorChange}
              statusGreenColor={handleGreenColorChange}
              statusBlueColor={handleBlueColorChange}
              statusTheme={changeCurrentTheme}
              themeValue={themeValue}
              redHue={redHue}
              greenHue={greenHue}
              blueHue={blueHue}
              optionsId={optionsId}
              name={name}
              statusName={changeStatusName}
              userActive={currentUser.get("username")}
            />
            : null
      }


    </header>
  );
}

export default LandingPage;