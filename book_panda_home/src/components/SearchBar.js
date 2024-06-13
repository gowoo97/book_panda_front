import { React, useEffect, useState } from "react";
import styles from "../styles/SearchBar.module.css";
import axios from "axios";

function SearchBar() {
  const [autocompleteItem, setAutocompleteItem] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [toggle, setToggle] = useState(false);

  const keywordHandler = (e) => {
    setKeyword(e.target.value);
    setToggle(true);
  };

  const clickClose = (e) => {
    setToggle(false);
  };

  useEffect(() => {
    axios
      .get("/api/bookSales/title?keyword=" + keyword)
      .then((res) => {
        setAutocompleteItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [keyword]);

  return (
    <div className={styles.container}>
      <h1>책판다</h1>
      <div className={styles.searchBar}>
        <select>
          <option>통합검색</option>
          <option>국내도서</option>
          <option>외국도서</option>
        </select>
        <input type="text" onChange={keywordHandler}></input>
        <button type="submit">검색</button>
      </div>
      <div className={toggle ? `${styles.autocompleteVisible}` : `${styles.autocompleteHidden}`}>
        <div className={styles.itemContainer}>
          {autocompleteItem.map((bookTitle, i) => (
            <div key={i} className={styles.autocompleteItem}>
              {bookTitle.title}
            </div>
          ))}
          <button onClick={clickClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
