import React from 'react';
import Parse from 'parse/dist/parse.min.js';
import spinner from '../spinner.svg'
import spntxt from '../spintxt.svg'

function Profile(props) {

  const root = document.documentElement;
  const dialog = document.getElementById("dialog-options");


  const handleUpdate = (e) => {
    if (e.target.id === 'red') {
      props.statusRedColor(e.target.value);
      return root.style.setProperty('--red', props.redHue)
    };
    if (e.target.id === 'green') {
      props.statusGreenColor(e.target.value);
      return root.style.setProperty('--green', props.greenHue)
    };
    if (e.target.id === 'blue') {
      props.statusBlueColor(e.target.value);
      return root.style.setProperty('--blue', props.blueHue)
    };
  }

  const forceHueUpdate = async () => {
    if (!dialog) return

    let Options = new Parse.Object('Options');
    Options.set("objectId", props.optionsId);
    Options.set("red", parseFloat(props.redHue));
    Options.set("green", parseFloat(props.greenHue));
    Options.set("blue", parseFloat(props.blueHue));
    try {
      dialog.showModal();
      await Options.save();
      dialog.close();
    } catch (error) {
      dialog.close();
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    };
  }

  const handleNameChange = async () => {
    if (!dialog) return
    let Options = new Parse.Object('Options');
    Options.set("objectId", props.optionsId);
    Options.set("name", props.name);
    try {
      dialog.showModal();
      await Options.save();
      dialog.close();
    } catch (error) {
      dialog.close();
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    };
  }

  const handleThemeChange = async () => {
    if (!dialog) return
    let Options = new Parse.Object('Options');
    Options.set("objectId", props.optionsId);
    Options.set("theme", props.themeValue);
    try {
      dialog.showModal();
      await Options.save();
      dialog.close();
    } catch (error) {
      dialog.close();
      // Error can be caused by lack of Internet connection
      alert(`Error! ${error.message}`);
      return false;
    };
  }


  return (
    <div className="Profilo">
      <div className='menu-option'>
        <div className='change-color'>
          <h3>Cambia il nome visualizzato:</h3>
          <input placeholder='Username' name='user' type='text' value={props.name} onChange={(e) => props.statusName(e.target.value)} maxLength="20" autoComplete="new-off" required></input>
          <button className='button-nav' value="update" onClick={handleNameChange}><span>Aggiorna</span></button>
        </div>
        <hr />
        <div className='change-color'>
          <h3>Cambia il colore dello sfondo:</h3>
          <label>Rosso {props.redHue}</label><input onChange={(e) => handleUpdate(e)} type="range" name='red' id='red' min="0" max="255" defaultValue={props.redHue} step="1" />
          <label>Verde {props.greenHue}</label><input onChange={(e) => handleUpdate(e)} type="range" name='green' id="green" min="0" max="255" value={props.greenHue} step="1" />
          <label>Blu {props.blueHue}</label><input onChange={(e) => handleUpdate(e)} type="range" name='blue' id="blue" min="0" max="255" value={props.blueHue} step="1" />
          <p>Clicca aggiorna per rendere il cambiamento effettivo</p>
          <button className='button-nav' value="update" onClick={forceHueUpdate}><span>Aggiorna</span></button>
        </div>
        <hr />
        <div className='change-color'>
          <h3>Cambia il tema dello sfondo:</h3>
          <label><input type='radio' name='Theme-Changer' onClick={() => props.statusTheme(1)} defaultChecked="checked" value="1"></input>Tema 01 {props.themeValue === 1 ? ("(Corrente)") : null}</label>
          <label><input type='radio' name='Theme-Changer' onClick={() => props.statusTheme(2)} value="2"></input>Tema 02 {props.themeValue === 2 ? ("(Corrente)") : null}</label>
          <label><input type='radio' name='Theme-Changer' onClick={() => props.statusTheme(3)} value="3"></input>Tema 03 {props.themeValue === 3 ? ("(Corrente)") : null}</label>
          <p>Clicca aggiorna per rendere il cambiamento effettivo</p>
          <button className='button-nav' value="update" onClick={handleThemeChange}><span>Aggiorna</span></button>
        </div>
        <hr />
      </div>



      <dialog id='dialog-options'><img src={spinner} className='spinner' alt='loading-spinner' />
        <img src={spntxt} className='spinner-text' alt='loading-spinner-text' /><div className='loading'>Caricamento...</div></dialog>
    </div>
  );
}

export default Profile;