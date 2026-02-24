import { Link, Outlet } from "react-router";
function FrontendLayout() {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                <Link className="nav-link" to="products">Products</Link>
                <Link className="nav-link" to="cart">Cart</Link>
                <Link className="nav-link disabled" aria-disabled="true">願望清單</Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="mt-5 text-center">
        <p>© 2025 TWLeoC's website</p>
      </footer>
    </>
  );
};

export default FrontendLayout;