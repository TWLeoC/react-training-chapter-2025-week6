const Products = ({
    openModal,
    products,
    INITIAL_TEMPLATE_DATA,
}) => {
  return (
    <>
      <h2>產品列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal('create', INITIAL_TEMPLATE_DATA)}
          >
            建立新的產品
          </button>
        </div>
      <table className="table">
        <thead>
          <tr>
            <th>分類</th>
            <th>產品名稱</th>
            <th>原價</th>
            <th>售價</th>
            <th>是否啟用</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          {/* 將 product 逐一渲染到畫面上 */}
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.category}</td>
              <td>{product.title}</td>
              <td>{product.origin_price}</td>
              <td>{product.price}</td>
              <td className={`${product.is_enabled ? "text-success" : "text-secondary"}`}>
                {product.is_enabled ? '啟用' : '未啟用'}
              </td>
              <td>
                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => openModal('edit', product)}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => openModal('delete', product)}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Products;