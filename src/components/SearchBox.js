import React from "react";

const SearchBox = (props) =>{
    const {searchValue,setSearchValue}=props
    return(
        <div className='col col-sm-4'>
            <input 
                className="form-control"
                placeholder="enter movie name"
                type="text"
                value={searchValue}
                onChange={(event)=>setSearchValue(event.target.value)}
            />
        </div>
    )
}

export default SearchBox