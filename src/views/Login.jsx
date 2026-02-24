import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BASE_URL;

const Login = ({
    getProducts,
    setIsAuth
}) => {
    const [formData, setFromData] = useState({
        username: '',
        password: '',
      });
    
    const handleSubmit = async e => {
        try {
        e.preventDefault();
        console.log('登入確認中...');
        const res = await axios.post(`${API_BASE}/v2/admin/signin`, formData);
        const { token, expired } = res.data;
        document.cookie = `hexToken=${token};expired=${new Date(expired)};`;
        axios.defaults.headers.common['Authorization'] = token;

        getProducts();
        setIsAuth(true);
        } catch (error) {
        setIsAuth(false);
        console.error('登入錯誤：', error.response);
        }
    };  

    const handleFormChange = e => {
        const { name, value } = e.target;
        setFromData(preData => ({
          ...preData,
          [name]: value,
        }));
      };
    
    return (
    <>
      <div className="container login">
          <h1>請先登入</h1>
          <form className="form-floating" onSubmit={handleSubmit}>
            <div className="form-floating mb-2">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="username@gmail.com"
                value={FormData.username}
                onChange={handleFormChange}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={FormData.password}
                onChange={handleFormChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-success w-100 mt-3">
              Login
            </button>
          </form>
      </div>
    </>
  );
};

export default Login;