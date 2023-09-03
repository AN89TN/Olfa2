import React, { useState, useEffect } from 'react';
import Logo from '../Olfa2.svg';
import Profile from './Profile';
import spinner from '../spinner.svg';
import spntxt from '../spintxt.svg';
import Parse from 'parse/dist/parse.min.js';
import ListaDellaSpesa from "./ListaSpesa";
import ListaBase from "./ListaBase";
import ListaTabellaDiMarcia from "./ListaTabellaDiMarcia";


function ContentPage(props) {

  const [displayProfile, setDisplayProfile] = useState(false);
  const [listName, setlistName] = useState("");
  const [listNote, setlistNote] = useState("");
  const [listType, setlistType] = useState("Base");
  const [queryResult, setQueryResult] = useState([]);
  const [ricerca, setRicerca] = useState('');
  const [currentListId, setCurrentListId] = useState("");
  const [currentListName, setCurrentListName] = useState("");
  const [currentListType, setCurrentListType] = useState("");
  const [queryCurrentListResult, setQueryCurrentListResult] = useState([]);

  const statusQueryResult = (query) => {
    setQueryResult(query);
  }

  const statusQueryCurrentListResult = (query) => {
    setQueryCurrentListResult(query);
  }


  useEffect(() => {
    const retriveListsFromUser = async function () {
      try {
        openDialog("dialog-spinner");
        let parseQuery = new Parse.Query('Lists');
        parseQuery.equalTo('username', props.userActive);
        let queryResults = await parseQuery.find();
        setQueryResult(queryResults);
        closeDialog("dialog-spinner");
      } catch (error) {
        alert(`Error! ${error.message}`);
        closeDialog("dialog-spinner");
        return false;
      }
    }
    retriveListsFromUser();
  }, [props.userActive]);


  const doUserLogOut = async function () {
    try {
      openDialog("dialog-spinner");
      await Parse.User.logOut();
      localStorage.removeItem("OpUser1");
      localStorage.removeItem("OpPass1");
      const loggedUser = await Parse.User.current();
      props.statusUser(loggedUser);
      props.statusPage(1);
      closeDialog("dialog-spinner");
      return
    } catch (error) {
      alert(`Error! ${error.message}`);
      closeDialog("dialog-spinner");
      return false;
    }
  };

  const openDialog = (tag) => {
    const dialog = document.getElementById(tag);
    if (!dialog) return
    dialog.showModal()
  }

  const closeDialog = (tag) => {
    const dialog = document.getElementById(tag);
    dialog.close()
  }

  const handleSubmitNewList = async () => {
    if (!listName || !listNote) return alert(`Error! Something went wrong.`);
    if (listName.trim() === "" || listNote.trim() === "") return alert(`Error! Something went wrong.`);
    try {
      let Lists = new Parse.Object('Lists');
      Lists.set("username", props.userActive);
      Lists.set("listName", listName);
      Lists.set("listType", listType);
      Lists.set("listNote", listNote);
      openDialog("dialog-spinner");
      await Lists.save();
      let parseQuery = new Parse.Query('Lists');
      parseQuery.equalTo('username', props.userActive);
      let queryResults = await parseQuery.find();
      setQueryResult(queryResults);
      closeDialog("dialog-spinner");
      closeDialog("dialog-new-list");
    } catch (error) {
      alert(`Error! ${error.message}`);
      closeDialog("dialog-spinner");
      return false;
    }
  }

  const cercaLista = async () => {
    try {
      openDialog("dialog-spinner");
      const parseQuery1 = new Parse.Query('Lists'),
        parseQuery2 = new Parse.Query('Lists'),
        parseQuery3 = new Parse.Query('Lists');
      parseQuery1.matches('listName', ricerca, "i");
      parseQuery2.matches('listNote', ricerca, "i");
      parseQuery3.equalTo('username', props.userActive);
      let parseQuery = new Parse.Query.or(
        Parse.Query.and(parseQuery3, parseQuery1),
        Parse.Query.and(parseQuery3, parseQuery2));
      let risultati = await parseQuery.find();
      setQueryResult(risultati);
      closeDialog("dialog-spinner");
    } catch (erro0r) {
      // Error can be caused by lack of Internet connection
      alert(`Error $'{error.message}`);
      closeDialog("dialog-spinner");
      return false;
    }
  };

  const handleList = (id, listName, listType) => {
    setCurrentListId(id);
    setCurrentListName(listName);
    setCurrentListType(listType);
    return handleQueryList(id);
  }

  const handleQueryList = async (id) => {
    openDialog("dialog-spinner");
    try {
      let parseQuery = new Parse.Query('Lists');
      parseQuery.equalTo('idToConnect', id);
      let queryResults = await parseQuery.find();
      setQueryCurrentListResult(queryResults);
      closeDialog("dialog-spinner");
    } catch (error) {
      alert(`Error! ${error.message}`);
      closeDialog("dialog-spinner");
      return false;
    }

    return openDialog("dialog-list");

  }

  return (
    <main>
      <div className='Nav-bar'>

        <div className='Nav-logo' onClick={ () => props.statusPage(1)} ><img src={Logo} alt="logo" /></div>
        <div className='Nav-home'><button className='button-nav' value="Menu" onClick={() => openDialog("dialog-new-list")}><span>Crea</span></button></div>
        <div className='Nav-profile'><button className='button-nav' value="Profilo" onClick={() => setDisplayProfile(!displayProfile)}><span>{!displayProfile ? "Profilo" : "Liste"}</span></button></div>
        <div className='Nav-logout'><button className='button-nav' value="Logout" onClick={doUserLogOut}><span>Logout</span></button></div>

      </div>
      {displayProfile ?
        <Profile
          statusRedColor={props.statusRedColor}
          statusGreenColor={props.statusGreenColor}
          statusBlueColor={props.statusBlueColor}
          redHue={props.redHue}
          greenHue={props.greenHue}
          blueHue={props.blueHue}
          optionsId={props.optionsId}
          name={props.name}
          statusName={props.statusName}
          statusTheme={props.statusTheme}
          themeValue={props.themeValue}
        />
        :
        <>
          <div className="searchBox">
            <input className="searchInput" type="text" name="" placeholder="Cerca" value={ricerca} onChange={event => setRicerca(event.target.value)} maxLength="20" autoComplete="new-off"></input>
            <button className="searchButton" onClick={cercaLista}>
              <i className="material-icons">
                <svg aria-hidden="true" className="svg-search" width="18" height="18" viewBox="0 0 18 18"><path d="m18 16.5-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5ZM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0Z"></path></svg>
              </i>
            </button>
          </div>
          {queryResult.length === 0 ?
            <div>
              <div className='spacer-contentpage'></div>
              <h2><p>Benvenuto {props.name}.</p></h2>
              <h3><p>Per una nuova lista premere Crea.</p></h3>
            </div>
            :
            <div className='spacer-test'>
              {queryResult.map(data => (
                <button key={data.id} className='Button-special-land' onClick={() => handleList(data.id, data.get("listName"), data.get("listType"))}>
                  <div className='list-table-container'>
                    <label>Nome:</label><div className='list-table-row'>{data.get("listName")}</div>
                    <label>Tipologia:</label><div className='list-table-row'>{data.get("listType")}</div>
                    <label>Note:</label><div className='list-table-row'>{data.get("listNote")}</div>
                  </div>
                </button>
              ))}
            </div>
          }
        </>
      }


      <dialog id='dialog-new-list' className='dialog-new-list'>
        <div>

          <form className='Login-forms' onSubmit={e => e.preventDefault(e)} >
            <label>Nome Lista:</label><input placeholder='Nome della  Lista' type='text' value={listName} onChange={(e) => setlistName(e.target.value)} maxLength="20" autoComplete="new-off" required></input>
            <label htmlFor='lists'>Tipologia Lista:</label>
            <select onChange={(e) => setlistType(e.target.value)} name='lists' id='lists' value={listType}>
              <option value="Base">Base</option>
              <option value="Lista della spesa">Lista della spesa</option>
              <option value="Tabella di marcia">Tabella di marcia</option>
            </select>
            <label>Note:</label><input placeholder='Aggiungi delle note' type='text' value={listNote} onChange={(e) => setlistNote(e.target.value)} maxLength="100" autoComplete="new-off" required></input>
            <div className='spacer'>
              <button className='button-nav' type='submit' onClick={handleSubmitNewList}><span>Crea</span></button>
            </div>
          </form>
          <button className='button-nav' value="exit" onClick={() => closeDialog("dialog-new-list")}><span>Chiudi</span></button>
        </div>
      </dialog>

      <dialog id='dialog-spinner' className='dialog-spinner' >
        <img src={spinner} className='spinner' alt='loading-spinner' />
        <img src={spntxt} className='spinner-text' alt='loading-spinner-text' /><div className='loading'>Caricamento...</div>
      </dialog>

      <dialog id='dialog-list' className='dialog-list'>
        <div>
          <div className='location-botton-exit'>
          <button className='button-nav' value="exit" onClick={() => closeDialog("dialog-list")}><span>Chiudi</span></button>
          </div>
          Nome della Lista: {currentListName}

          {
            (() => {
              if (currentListType === 'Base') {
                return (
                  <ListaBase
                    queryCurrentListResult={queryCurrentListResult}
                    currentListId={currentListId}
                    setQueryCurrentListResult={statusQueryCurrentListResult}
                    setQueryResult={statusQueryResult}
                    userActive={props.userActive}
                  />
                )
              } else if (currentListType === 'Lista della spesa') {
                return (
                  <ListaDellaSpesa
                    queryCurrentListResult={queryCurrentListResult}
                    currentListId={currentListId}
                    setQueryCurrentListResult={statusQueryCurrentListResult}
                    setQueryResult={statusQueryResult}
                    userActive={props.userActive}
                  />
                )
              } else if (currentListType === 'Tabella di marcia') {
                return (
                  <ListaTabellaDiMarcia
                    queryCurrentListResult={queryCurrentListResult}
                    currentListId={currentListId}
                    setQueryCurrentListResult={statusQueryCurrentListResult}
                    setQueryResult={statusQueryResult}
                    userActive={props.userActive}
                  />
                )
              }
            })() // <=== () se tolto componente non funziona... motivo sconosciuto.
          }
        </div>
      </dialog>

    </main>
  );
}

export default ContentPage;