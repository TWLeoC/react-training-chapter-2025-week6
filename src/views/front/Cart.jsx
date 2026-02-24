import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [productsInCart, setProductsInCart] = useState([])
  
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
    const getCart = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
        setProductsInCart(res.data.data)
      } catch (error) {
        console.error('取得購物車資訊失敗：', error.response)
      }
    }
    getCart()
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
  
  return (
    <div className="container">
      <h2>購物車列表</h2>
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
                      defaultValue={cartItem.qty}
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
    </div>
  );
};

export default Cart;