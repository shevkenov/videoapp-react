// @ts-nocheck
import React from "react";
import { useHistory } from "react-router";
import Wrapper from "../styles/Search";
import { SearchIcon } from "./Icons";

function Search() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const history = useHistory();

  const handleSearch = (event) => {
    event.preventDefault();

    history.push(`/results/${searchQuery}`);
  }

  return (
    <Wrapper>
      <form onSubmit={handleSearch}>
        <input id="search" type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button aria-label="Search videos and channels" type="submit">
          <SearchIcon />
        </button>
      </form>
    </Wrapper>
  );
}

export default Search;
