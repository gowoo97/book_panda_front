import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BookReview from "./BookReview";
import PostBookReview from "./PostBookReview";
import Notification from "../Notification";
import styles from "../../styles/BookSalesDetail.module.css";

const BookSalesDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [newstock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({
    ...state,
  });
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(JSON.stringify(queryParams));
  const count = async () => {
    try {
      const response = await axios.get("/api/getBookSales", {
        params: { id: queryParams.id },
        withCredentials: true,
      });
      console.log("Count data:", response.data);
      //setQueryParams(response.data);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  useEffect(() => {
    count(); // 페이지 로드 시 count 함수 호출
  }, []); // queryParams.id가 변경될 때마다 count 함수 호출

  const addToCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const response = await axios.post("http://localhost:8080/api/cart/items", null, {
        params: { id: queryParams.id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setShowNotification(true);
    } catch (error) {
      console.error("주문 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const requestData = {
        bookId: queryParams.id,
        orderDate: new Date(), // 현재 날짜로 설정
      };
      const response = await axios.post(`http://localhost:8080/api/order`, requestData, {
        params: { id: queryParams.id },
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(response.data.id);
      navigate(`/order?orderId=${response.data.id}`);
    } catch (error) {
      console.error("주문 오류: ", queryParams.id, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.sales}>
      {isLoading && <div>로딩중</div>}

      {!isLoading && (
        <div className={styles.detailsContainer}>
          <div className={styles.bookInfo}>
            <div className={styles.imageContainer}>
              <img src={queryParams.image} alt={queryParams.title} className={styles.bookImage} />
            </div>
            <div className={styles.bookDetails}>
              <h3 className={styles.title}>{queryParams.title}</h3>
              <p className={styles.price}>가격: {queryParams.discount}원</p>
              <p className={`${queryParams.salesInfoDto.stock === "0" ? styles.zero : styles.stock}`}>
                재고: {queryParams.salesInfoDto.stock}권
              </p>
              <p className={styles.stock}>저자: {queryParams.author}</p>
              <div className={styles.buttons}>
                <button onClick={addToCart} disabled={loading}>
                  {loading ? "추가 중..." : "장바구니 담기"}
                </button>
                <button onClick={createOrder} disabled={loading}>
                  {loading ? "추가 중..." : "바로 구매"}
                </button>
              </div>
            </div>
          </div>
          <p className={styles.description}>{queryParams.description}</p>
          <div>
            <BookReview bookSales={queryParams} />
            <PostBookReview bookSalesInfo={queryParams} />
          </div>
        </div>
      )}

      {showNotification && (
        <Notification
          message="장바구니에 추가되었습니다."
          onClose={() => setShowNotification(false)}
          onNavigate={() => {
            setShowNotification(false);
            navigate("/cart");
          }}
        />
      )}
    </div>
  );
};

export default BookSalesDetail;
