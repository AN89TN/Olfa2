import React, { useState } from 'react';
import Parse from 'parse/dist/parse.min.js';

function ListaTabellaDiMarcia(props) {

    const [currentListInput, setCurrentListInput] = useState("");

    const openDialog = (tag) => {
        const dialog = document.getElementById(tag);
        if (!dialog) return
        dialog.showModal()
    }

    const closeDialog = (tag) => {
        const dialog = document.getElementById(tag);
        dialog.close()
    }

    const handleCurrentDelete = async (id) => {
        try {
            openDialog("dialog-spinner");
            let newDelete = new Parse.Object('Lists');
            newDelete.set('objectId', id);
            await newDelete.destroy();
            handleQueryList(props.currentListId);
            closeDialog("dialog-spinner");
        } catch (error) {
            alert(`Error! ${error.message}`);
            closeDialog("dialog-spinner");
            return false;
        }
    }

    const handleCurrentMainList = async () => {
        if (!currentListInput) return alert(`Error! Something went wrong.`);
        if (currentListInput.trim() === "") return alert(`Error! Something went wrong.`);
        try {
            openDialog("dialog-spinner");
            let newItem = new Parse.Object('Lists');
            newItem.set('idToConnect', props.currentListId);
            newItem.set('messaggio', currentListInput);
            newItem.set('hasSubList', false);
            await newItem.save();
            handleQueryList(props.currentListId)
            closeDialog("dialog-spinner");
            setCurrentListInput("");
        } catch (error) {
            alert(`Error! ${error.message}`);
            closeDialog("dialog-spinner");
            return false;
        }
    }

    const handleQueryList = async (id) => {
        try {
            let parseQuery = new Parse.Query('Lists');
            parseQuery.equalTo('idToConnect', id);
            let queryResults = await parseQuery.find();
            props.setQueryCurrentListResult(queryResults);
        } catch (error) {
            alert(`Error! ${error.message}`);
            closeDialog("dialog-spinner");
            return false;
        }

        return openDialog("dialog-list");

    }

    const handleDelete = async (id) => {
        try {
            openDialog("dialog-spinner");
            let newDelete = new Parse.Object('Lists');
            newDelete.set('objectId', id);
            await newDelete.destroy();
            let searchId = new Parse.Query('Lists');
            searchId.equalTo('idToConnect', id);
            let idResults = await searchId.find();
            idResults.map(async data => {
                let idToDelete = data.id;
                let newDelete = new Parse.Object('Lists');
                newDelete.set('objectId', idToDelete);
                await newDelete.destroy();
            })
            let parseQuery = new Parse.Query('Lists');
            parseQuery.equalTo('username', props.userActive);
            let queryResults = await parseQuery.find();
            props.setQueryResult(queryResults);
            closeDialog("dialog-spinner");
            closeDialog("dialog-list");
        } catch (error) {
            alert(`Error! ${error.message}`);
            closeDialog("dialog-spinner");
            return false;
        }
    }

    const handleCurrentSubList = async (id, Input) => {
        if (!Input) return alert(`Error! Something went wrong.`);
        if (Input.trim() === "") return alert(`Error! Something went wrong.`);
        try {
            openDialog("dialog-spinner");
            let updateObject = new Parse.Object('Lists');
            updateObject.set('objectId', id);
            updateObject.set('hasSubList', true);
            await updateObject.save();
            let newItem = new Parse.Object('Lists');
            newItem.set('idToConnect', props.currentListId);
            newItem.set('messaggio', Input);
            newItem.set('idToSubConnect', id);
            await newItem.save();
            handleQueryList(props.currentListId);
            closeDialog("dialog-spinner");
        } catch (error) {
            alert(`Error! ${error.message}`);
            closeDialog("dialog-spinner");
            return false;
        }
    }

    const handleCurrentSubListUpdate = async (id, data) => {
        let Options = new Parse.Object('Lists');
        Options.set("objectId", id);
        Options.set("messaggio", data);
        try {
            openDialog("dialog-spinner");
            await Options.save();
            handleQueryList(props.currentListId);
            closeDialog("dialog-spinner");
        } catch (error) {
            closeDialog("dialog-spinner");
            // Error can be caused by lack of Internet connection
            alert(`Error! ${error.message}`);
            return false;
        };
    }

    function Node(props) {

        const [currentSubListInput, setCurrentSubListInput] = useState("");
        const [dropDownSelect, setDropDownSelect] = useState("1");
        const [currentSubListUpdateInput, setCurrentSubListUpdateInput] = useState(props.data.get("messaggio"));

        let Subnode = null;

        if (props.data.get("hasSubList") === true) {
            Subnode = (
                props.queryCurrentListResult.map(data => {
                    if (props.data.id === data.get("idToSubConnect")) return (
                        <div key={data.id}>
                            <ul>
                                <Node
                                    queryCurrentListResult={props.queryCurrentListResult}
                                    data={data}
                                />
                            </ul>
                        </div>
                    ); else return false

                })
            )
        }

        return (


            <div >
                <div>
                    <li>

                        {props.data.get("messaggio")}

                        <div className='dropDown-TDM'>
                            <select onChange={(e) => setDropDownSelect(e.target.value)} name='dropDown' value={dropDownSelect}>
                                <option value="1">⋮</option>
                                <option value="2">Modifica</option>
                                <option value="3">Aggiungi</option>
                                <option value="4">Cancella</option>
                            </select>
                        </div>
                    </li>

                    {dropDownSelect === "1"
                        ? null
                        : dropDownSelect === "2"
                            ?
                            <div className='submit-input-combo'>
                                <input placeholder="Modifica lista" type='text' value={currentSubListUpdateInput} onChange={(e) => setCurrentSubListUpdateInput(e.target.value)} maxLength="30" autoComplete="new-off" required></input>
                                <button onClick={() => handleCurrentSubListUpdate(props.data.id, currentSubListUpdateInput)}>➤</button>
                            </div>
                            : dropDownSelect === "3" ?
                                <div className='submit-input-combo'>
                                    <input placeholder='Inserisci una sottolista' type='text' value={currentSubListInput} onChange={(e) => setCurrentSubListInput(e.target.value)} maxLength="30" autoComplete="new-off" required></input>
                                    <button onClick={() => handleCurrentSubList(props.data.id, currentSubListInput)}>➤</button>
                                </div>
                                : dropDownSelect === "4" ?
                                    <div><button className='button-nav' onClick={() => handleCurrentDelete(props.data.id)}><span>Cancella</span></button></div>
                                    : null
                    }
                </div>
                <div>
                    {Subnode}
                </div>
            </div>

        )
    }


    return (
        <div className='Lista-tabella'>
            {props.queryCurrentListResult.length === 0 ?
                <h1>Scrivi Qualcosa...</h1>
                :
                <div>
                    <ol>
                        {props.queryCurrentListResult.map(data => {
                            if (!data.get("idToSubConnect")) return (

                                <div key={data.id}>
                                    <Node
                                        queryCurrentListResult={props.queryCurrentListResult}
                                        data={data}
                                    />

                                </div>
                            ); else return false
                        })}
                    </ol>
                </div>
            }
            <div className='submit-input-combo'>
                <input placeholder='Scrivi un obbiettivo' type='text' value={currentListInput} onChange={(e) => setCurrentListInput(e.target.value)} maxLength="30" autoComplete="new-off" required></input>
                <button onClick={() => handleCurrentMainList()}>➤</button>
            </div>
            <p>Lista Tabella di marcia</p>
            <button className='button-nav' onClick={() => handleDelete(props.currentListId)}><span>Cancella Lista</span></button>
        </div>

    );
}

export default ListaTabellaDiMarcia;