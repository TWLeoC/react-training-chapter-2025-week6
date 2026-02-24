import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const getProduct = async (id) => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`)
        setProduct(res.data.product)
      } catch (error) {
        console.error('取得產品詳細資訊錯誤：', error.response)
      }
    }
    getProduct(id)
  }, [id])

  const addCart = async (id, num = 1) => {
    try {
      const data = {
        product_id: id,
        qty: num,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, { data });
      console.log(res)
    } catch (error) {
      console.error('加入購物車失敗：', error.response)
    }
  }
  
  return (
    !product ? (<h2>查無此產品</h2>) : 
      (<div className="container">
          <div className="card" key={product.id} style={{width: "400px"}}>
            <img src={product.imageUrl} className="card-img-top" alt={product.title} style={{height: "300px"}} />
            <div className="card-body">
              <h5 className="card-title">{product.title}
                <span className="badge bg-primary ms-2">{product.category}</span>
              </h5>
              <p className="card-text">{product.content}</p>
              <p className="card-text">商品內容：{product.description}</p>
              <div className="d-flex">
                <p className="card-text text-secondary">
                  <del>{`原價：${product.origin_price}`}</del>
                </p>
                &nbsp;元 / {`特價：${product.price}`} 元
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addCart(product.id)}
              >
                加入購物車
              </button>
            </div>
          </div>
      </div>)
  );
};

export default SingleProduct;