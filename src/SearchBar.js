import React from "react";

function SearchBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
}) {
  return (
    <div className="filter-container">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="creationDate">Sot By Creation Date</option>
        <option value="status">Sort by Status</option>
      </select>

      <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
        <option value="all">Show all</option>
        <option value="active">Show Active</option>
        <option value="finished">Show Finished</option>
        <option value="trashed">Show Trashed</option>
      </select>

      <input
        type="text"
        placeholder="Search To-Dos"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
