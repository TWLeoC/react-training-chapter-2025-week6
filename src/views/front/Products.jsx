import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products)
      } catch (error) {
        console.error('取得產品列表失敗：', error.response);
      }
    }
    getProducts()
  }, [])

  const handleSingleProductView = async (id) => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="container">
      <div className="row mb-3">
        {products.map((product) => 
          <div className="card col-4" key={product.id}>
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
              {/* <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSingleProductView(product.id)}
              >
                查看更多
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;