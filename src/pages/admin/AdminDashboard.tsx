// pages/admin/AdminDashboard.tsx
import { Button } from "@/components/common";

const AdminDashboard = () => {
  return (
    <main className="py-5 bg-light-subtle">
      <div className="container">
        <h1 className="fw-bold text-center mb-4">Panel de Administración</h1>

        <div className="row g-4">
          {/* Gestión de Productos */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-basket text-primary" style={{ fontSize: "3rem" }} />
                <h2 className="h5 mt-3">Gestión de Productos</h2>
                <p className="small text-muted">
                  Encontrarás todos los productos disponibles en la tienda.
                </p>
                <Button as="link" to="/admin/products" variant="mint" block>
                  Ir a Productos
                </Button>
              </div>
            </div>
          </div>

          {/* Gestión de Pedidos */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-receipt text-info" style={{ fontSize: "3rem" }} />
                <h2 className="h5 mt-3">Gestión de Pedidos</h2>
                <p className="small text-muted">
                  Consulta y gestiona los pedidos de tus clientes.
                </p>
                <Button as= "link" to="/admin/orders" variant="mint" block>
                  Ir a Pedidos
                </Button>
              </div>
            </div>
          </div>

          {/* Gestión de Usuarios */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-people text-success" style={{ fontSize: "3rem" }} />
                <h2 className="h5 mt-3">Gestión de Usuarios</h2>
                <p className="small text-muted">
                  Administra clientes, vendedores y administradores.
                </p>
                <Button as= "link" to="/admin/users" variant="mint" block>
                  Ir a Usuarios
                </Button>
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-chat-dots text-danger" style={{ fontSize: "3rem" }} />
                <h2 className="h5 mt-3">Comentarios</h2>
                <p className="small text-muted">
                  Revisa y responde comentarios enviados por clientes.
                </p>
                <Button as= "link" to="/admin/comments" variant="mint" block>
                  Ver Comentarios
                </Button>
              </div>
            </div>
          </div>

          {/* Reportes */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-bar-chart text-warning" style={{ fontSize: "3rem" }} />
                <h2 className="h5 mt-3">Reportes</h2>
                <p className="small text-muted">
                  Visualiza estadísticas de ventas y stock crítico.
                </p>
                <Button as= "link" to="/admin/reports" variant="mint" block>
                  Ver Reportes
                </Button>
              </div>
            </div>
          </div>

          {/* Blogs */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-journal-text text-dark" style={{ fontSize: "3rem" }} />
                <h2 className="h5 mt-3">Gestión de Blogs</h2>
                <p className="small text-muted">
                  Revisa y aprueba los blogs creados por usuarios.
                </p>
                <Button as= "link" to="/admin/blogs" variant="mint" block>
                  Ir a Blogs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
