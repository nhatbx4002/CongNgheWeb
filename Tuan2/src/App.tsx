

import { useState } from "react";
import { SearchForm } from "./components/SearchForm";
import {AddUser} from "./components/AddUser"
import {ResultTable} from "./components/ResultTable"
export function App() {
  const [kw, setKeyword] = useState("");
  const [newUser,setNewUser] = useState(null);

  return (
    <div>
      <SearchForm onChangeValue={setKeyword}/>
      <AddUser onAdd={setNewUser}/>
      <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)}/>
    </div>
  )
}