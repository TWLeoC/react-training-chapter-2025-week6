import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import './assets/style.css';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';
import Login from './views/Login';
import Products from './views/Products';

const API_BASE = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: '',
  title: '',
  category: '',
  origin_price: '',
  price: '',
  unit: '',
  description: '',
  content: '',
  is_enabled: false,
  imageUrl: '',
  imagesUrl: [],
};

function App() {
  // 表單狀態
  
  // 登入狀態管理
  const [isAuth, setIsAuth] = useState(false);
  // 產品列表
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState('');

  const productModalRef = useRef(null);


  const handleModalInputChange = e => {
    const { name, value, checked, type } = e.target;
    setTemplateProduct(preData => ({
      ...preData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTemplateProduct(pre => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;
      return { ...pre, imagesUrl: newImage };
    });
  };

  const handleAddImage = () => {
    setTemplateProduct(pre => {
      const newImage = [...pre.imagesUrl, ''];
      return { ...pre, imagesUrl: newImage };
    });
  };

  const handleRemoveImage = () => {
    setTemplateProduct(pre => {
      const newImage = [...pre.imagesUrl];
      newImage.pop();
      return { ...pre, imagesUrl: newImage };
    });
  };

  const handleDeleteProduct = async id => {
    try {
      const res = await axios.delete(`${API_BASE}/v2/api/${API_PATH}/admin/product/${id}`);
      alert('刪除產品成功', res);
      getProducts();
      closeModal();
    } catch (error) {
      alert('刪除產品異常', error.response);
    }
  };

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(`${API_BASE}/v2/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
      console.log('取得品列表成功');
    } catch (error) {
      console.error('取得產品列表異常:', error.response);
    }
  };

  

  const updateProduct = async id => {
    let url = `${API_BASE}/v2/api/${API_PATH}/admin/product`;
    let method = 'post';

    if (modalType === 'edit') {
      url = `${API_BASE}/v2/api/${API_PATH}/admin/product/${id}`;
      method = 'put';
    }

    const product = {
      data: {
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
        imagesUrl: [...templateProduct.imagesUrl.filter(url => url !== '')],
      },
    };

    try {
      const res = await axios[method](url, product);
      console.log(res);
      getProducts();
      closeModal();
    } catch (error) {
      console.error(error.response);
    }
  };

  const uploadImage = async(e) => {
    const file = e.target.files?.[0]
    if (!file) {
      return alert('請選擇要上傳的圖片')
    }
    try {
      const formData = new FormData()
      formData.append('file-to-upload', file)
      const res = await axios.post(`${API_BASE}/v2/api/${API_PATH}/admin/upload`, formData)
      setTemplateProduct((pre) => ({
        ...pre,
        imageUrl: res.data.imageUrl
      }))
    } catch (error) {
      console.error(error.response)
    }
  }

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('hexToken='))
      ?.split('=')[1];
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }

    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false,
    });

    document.querySelector('#productModal').addEventListener('hide.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/v2/api/user/check`);
        console.log(res.data);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.error(error);
      }
    };

    checkLogin();
  }, []);

  const openModal = (type, product) => {
    setModalType(type);
    setTemplateProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    });
    productModalRef.current.show();
  };

  const closeModal = () => {
    setTemplateProduct(INITIAL_TEMPLATE_DATA);
    productModalRef.current.hide();
  };

  return (
    <>
      {!isAuth ? (
        <Login getProducts={getProducts} setIsAuth={setIsAuth} />
      ) : (
        <div className="container"> 
          <Products openModal={openModal} products={products} INITIAL_TEMPLATE_DATA={INITIAL_TEMPLATE_DATA}/>
          <Pagination pagination={pagination} onChangePage={getProducts}/>
        </div>
      )}
      <ProductModal
        handleAddImage={handleAddImage}
        handleDeleteProduct={handleDeleteProduct}
        handleModalImageChange={handleModalImageChange}
        handleModalInputChange={handleModalInputChange}
        handleRemoveImage={handleRemoveImage}
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
        updateProduct={updateProduct}
        uploadImage={uploadImage}
      />
    </>
  );
}

export default App;
