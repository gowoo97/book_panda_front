import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, CustomLink } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/auth.js';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [pw, setPW] = useState('');
  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePW = (e) => {
    setPW(e.target.value);
  };

  const onClick = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ userEmail: email, userPassword: pw });
      console.log('Login successful:', result);
      const accessToken = result.accessToken;
      localStorage.setItem('accessToken', accessToken);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Wrapper>
      <Form>
        <Title>로그인</Title>
        <Inputs>
          <Input placeholder="이메일" value={email} onChange={onChangeEmail} />
          <Input placeholder="비밀번호" type="password" value={pw} onChange={onChangePW} />
        </Inputs>
        <Button onClick={onClick}>로그인</Button>
        <div className="custom-links">
          <p className="the-custom-link">아직 회원가입을 안하셨나요? <CustomLink to="/signup">회원가입하기</CustomLink></p>
          <p className="the-custom-link">아직 비밀번호 찾기 구현을 안하셨나요? <CustomLink to="/signup">네!</CustomLink></p>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Signin;
