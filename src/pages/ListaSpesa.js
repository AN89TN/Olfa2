import React, { useState } from 'react';
import Parse from 'parse/dist/parse.min.js';

function ListaDellaSpesa(props) {

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

    const handleCheckboxList = async (id, status) => {
        try {
            openDialog("dialog-spinner");
            let updateObject = new Parse.Object('Lists');
            updateObject.set('objectId', id);
            updateObject.set('isChecked', !status);
            await updateObject.save();
            handleQueryList(props.currentListId);
            closeDialog("dialog-spinner");
        } catch (error) {
            alert(`Error! ${error.message}`);
            closeDialog("dialog-spinner");
            return false;
        }
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

    const handleCurrentList = async () => {
        if (!currentListInput) return alert(`Error! Something went wrong.`);
        if (currentListInput.trim() === "") return alert(`Error! Something went wrong.`);
        try {
            openDialog("dialog-spinner");
            let newItem = new Parse.Object('Lists');
            newItem.set('idToConnect', props.currentListId);
            newItem.set('messaggio', currentListInput);
            newItem.set('isChecked', false);
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

    return (
        <div className='Lista-spesa'>
            {props.queryCurrentListResult.length === 0 ?
                <h1>Scrivi Qualcosa...</h1>
                :
                <div>
                    <div className='text-list-spesa'>
                    Cose da prendere...
                    </div>
                    <ul>
                        {props.queryCurrentListResult.map(data => {
                            if (data.get("isChecked") === false) return (
                                <div key={data.id}>

                                    <li>
                                        <input type='checkbox' onChange={() => handleCheckboxList(data.id, data.get("isChecked"))} checked={data.get("isChecked")} />
                                        {data.get("messaggio")}</li>

                                </div>
                            )
                            else return false
                        })}
                    </ul>
                    <div className='text-list-spesa'>
                    Cose prese...
                    </div>
                    <ul>
                        {props.queryCurrentListResult ?
                            <>
                                {props.queryCurrentListResult.map(data => {
                                    if (data.get("isChecked") !== false) return (
                                        <div key={data.id}>
                                            <li>
                                            <input type='checkbox' onChange={() => handleCheckboxList(data.id, data.get("isChecked"))} checked={data.get("isChecked")} />
                                            {data.get("messaggio")}
                                            <button className='button-nav' onClick={() => handleCurrentDelete(data.id)}><span>❌</span></button>
                                            </li>
                                        </div>
                                    )
                                    else return false
                                })}
                            </>
                            :
                            <div>
                                Ancora nulla di preso...
                            </div>
                        }
                    </ul>
                </div>
            }
            <div className='submit-input-combo'>
                <input placeholder='Aggiungi voce' type='text' value={currentListInput} onChange={(e) => setCurrentListInput(e.target.value)} maxLength="30" autoComplete="new-off" required></input>
                <button onClick={() => handleCurrentList()}>➤</button>
            </div>
            <p>Lista della spesa</p>
            <button className='button-nav' onClick={() => handleDelete(props.currentListId)}><span>Cancella Lista</span></button>
        </div>
    );
}

export default ListaDellaSpesa;