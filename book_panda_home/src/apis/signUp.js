import api from "../api";

export const signUp = async (email, pw, name, address, detailedAddress, postCode, phoneNumber) => {
  const result = await api.post("/users/sign-up", {
    userEmail: email,
    userPassword: pw,
    name: name,
    address: address || "", // 주소와 전화번호를 선택적으로 보내도록 처리
    detailedAddress: detailedAddress || "",
    postCode: postCode || "",
    phoneNumber: phoneNumber || "",
  });
  return result.data;
};
