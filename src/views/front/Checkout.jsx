import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [productsInCart, setProductsInCart] = useState([]);
  const [product, setProduct] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({mode: 'onChange'});
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const productModalRef = useRef(null);

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
      setProductsInCart(res.data.data)
    } catch (error) {
      console.error('取得購物車資訊失敗：', error.response)
    }
  };

  const delSingleCarts = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`)
      console.log('刪除購物車項目成功', res)
      getCart();
    } catch (error) {
      console.log('刪除購物車項目失敗', error.response)
    }
  };

  const addCart = async (id, num = 1) => {
    setLoadingCartId(id)
    try {
      const data = {
        product_id: id,
        qty: num,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      console.log(res)
      getCart();
    } catch (error) {
      console.error('加入購物車失敗：', error.response)
    } finally {
      setLoadingCartId(null);
    }
  }

  const delCarts = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`)
      console.log('清空購物車成功', res)
      getCart();
    } catch (error) {
      console.log('清空購物車失敗', error.response)
    }
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products)
      } catch (error) {
        console.error('取得產品列表失敗：', error.response);
      }
    };
    getProducts();
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
        setProductsInCart(res.data.data)
      } catch (error) {
        console.error('取得購物車資訊失敗：', error.response)
      }
    };
    getCart();

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    })
    document
    .querySelector("#productModal")
    .addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, [])

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;
  
      const data = {
        product_id: productId,
        qty,
      };
      await axios.put(url, { data });
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const data = {
        user: formData,
        message: formData.message
      }
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, { data })
      console.log('送出訂單成功：', res.data)
      getCart()
      reset({
        email: '',
        name: '',
        tel: '',
      })
    } catch (error) {
      console.log(error.response)
    }
  };

  const getProduct = async (id) => {
    setLoadingProductId(id)
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`)
      setProduct(res.data.product)
    } catch (error) {
      console.error('取得產品詳細資訊錯誤：', error.response)
    } finally {
      setLoadingProductId(null);
    }
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  
  
  return (
    <div className="container">
      <h2>結帳畫面</h2>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        { products.map((product) => 
          <tr key={product.id}>
            <td style={{ width: "200px" }}>
              <div
                style={{
                  height: "100px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${product.imageUrl})`,
                }}
              ></div>
            </td>
            <td>{product.title}</td>
            <td>
              <del className="h6">原價：{product.origin_price}</del>
              <div className="h5">特價：{product.price}</div>
            </td>
            <td>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => getProduct(product.id)}
                  disabled={ loadingProductId === product.id}
                >
                  { loadingProductId === product.id ? (
                    <TailSpin
                    color= 'grey'
                    width= {54}
                    height= {16}
                    />
                  ) : (
                    '查看更多'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => addCart(product.id)}
                  disabled={loadingCartId === product.id}
                >
                  { loadingCartId === product.id ? (
                    <TailSpin
                    color= 'grey'
                    width= {67}
                    height= {16}
                    />
                  ) : (
                    '加到購物車'
                  )}
                </button>
              </div>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => delCarts()}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {
            productsInCart?.carts?.map((cartItem) => (
              <tr key={cartItem.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => delSingleCarts(cartItem.id)}
                  >
                    刪除
                  </button>
                </td>
                <th scope="row">
                  {cartItem.product.title}
                </th>
                <td>
                  <div className="input-group input-group-sm mb-3">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      value={cartItem.qty}
                      onChange={(e) => updateCart(cartItem.id, cartItem.product_id, Number(e.target.value))}
                    />
                    <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                    </span>
                  </div>
                </td>
                <td className="text-end">
                  {cartItem.final_total}
                </td>
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{productsInCart.final_total}</td>
          </tr>
        </tfoot>
      </table>
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              defaultValue="test@gamil.com"
              {...register('email', {
                require: '請輸入email',
                pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email 格式不正確",
                  },
              })}
            />
            {errors.email && (<p className="text-danger">{errors.email.message}</p>)}
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              defaultValue="LEO"
              {...register('name', { 
                required: '請輸入收件者姓名',
                minLength: {
                  value: 2,
                  message: '最少輸入 2 個字'
                }
              })}
            />
            { errors.name && (<p className="text-danger">{errors.name.message}</p>) }
          </div>
          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              defaultValue="0912345678"
              {...register('tel', {
                require: '請輸入手機號碼',
                pattern: {
                  value: /^(?:\+886|0)9\d{8}$/,
                  message: "手機格式不正確",
                },
              })}
            />
            { errors.tel && (<p className="text-danger">{errors.tel.message}</p>) }
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              defaultValue="臺北市信義區信義路5段7號"
              {...register('address', {
                  required: "請輸入收件人地址",
              })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register('message')}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <SingleProductModal product={product} addCart={addCart} closeModal={closeModal}/>
    </div>
  );
};

export default Checkout;