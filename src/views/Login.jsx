import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const API_BASE = import.meta.env.VITE_BASE_URL;

const Login = ({
    getProducts,
    setIsAuth
}) => {
    // const [formData, setFromData] = useState({
    //     username: '',
    //     password: '',
    //   });
    
    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm({
      mode: 'onChange',
      defaultValues: {
        username: 'leotest@gmail.com',
        password: '',
      }
    })
    
    const onSubmit = async (formData) => {
        try {
        // e.preventDefault();
        console.log('登入確認中...');
        // console.log(formData)
        const res = await axios.post(`${API_BASE}/v2/admin/signin`, formData);
        console.log(res)
        // const { token, expired } = res.data;
        // document.cookie = `hexToken=${token};expired=${new Date(expired)};`;
        // axios.defaults.headers.common['Authorization'] = token;

        // getProducts();
        // setIsAuth(true);
        } catch (error) {
        // setIsAuth(false);
        console.error('登入錯誤：', error.response);
        }
    };  

    
    return (
    <>
      <div className="container login">
          <h1>請先登入</h1>
          <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-2">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="username@gmail.com"
                // value={FormData.username}
                // onChange={handleFormChange}
                {...register('username', {
                  require: '請輸入 Email',
                  pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email 格式不正確",
                    },
                })}
              />
              {errors.email && (<p className="text-danger">{errors.email.message}</p>)}
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                // value={FormData.password}
                // onChange={handleFormChange}
                {...register('password', {
                  require: '請輸入 Password',
                  minLength: {
                    value: 6,
                    message: '最少需要 6 個字元'
                  }
                })}
              />
              {errors.password && (<p className="text-danger">{errors.password.message}</p>)}
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