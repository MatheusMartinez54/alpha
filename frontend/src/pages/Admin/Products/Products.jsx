import { useMemo, useState } from 'react';
import { MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import ProductModal from '../../../components/Admin/ProductModal/ProductModal.jsx';
import StatusBadge from '../../../components/Admin/StatusBadge/StatusBadge.jsx';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import { mockCategories, mockProducts } from '../../../data/adminMocks.js';

function AdminProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(term);
      const matchesCategory = product.categoryName?.toLowerCase().includes(term);
      return matchesName || matchesCategory;
    });
  }, [products, search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleCreateProduct = (formValues) => {
    const nextProduct = {
      id: `prod-${Date.now()}`,
      name: formValues.name,
      description: formValues.description,
      price: Number(formValues.price),
      promotionalPrice: formValues.promotionalPrice ? Number(formValues.promotionalPrice) : Number(formValues.price),
      categoryId: formValues.categoryId,
      categoryName: mockCategories.find((category) => category.id === formValues.categoryId)?.name || 'Sem categoria',
      image: formValues.image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      stock: 0,
      active: Boolean(formValues.active),
    };

    setProducts((current) => [nextProduct, ...current]);
    handleCloseModal();
  };

  const handleEditProduct = (formValues) => {
    const normalized = {
      ...editingProduct,
      ...formValues,
      price: Number(formValues.price),
      promotionalPrice: formValues.promotionalPrice ? Number(formValues.promotionalPrice) : Number(formValues.price),
      categoryName: mockCategories.find((category) => category.id === formValues.categoryId)?.name || editingProduct.categoryName,
      image: formValues.image || editingProduct.image,
      active: Boolean(formValues.active),
      stock: Number(formValues.stock ?? editingProduct.stock),
    };

    setProducts((current) => current.map((product) => (product.id === editingProduct.id ? normalized : product)));
    handleCloseModal();
  };

  const handleToggleStatus = (productId) => {
    setProducts((current) => current.map((product) => (product.id === productId ? { ...product, active: !product.active } : product)));
  };

  const handleStockUpdate = (productId, value) => {
    setProducts((current) => current.map((product) => (product.id === productId ? { ...product, stock: Number(value) } : product)));
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os produtos da sua loja</p>
        </div>

        <button type="button" className="button" onClick={openCreateModal}>
          <Plus size={16} />
          Cadastrar produto
        </button>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} />
          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto" />
        </label>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState title="Nenhum produto encontrado." description="Tente outro termo de busca ou cadastre um novo produto." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-table__image">
                      <img src={product.image} alt={product.name} />
                    </div>
                  </td>
                  <td>
                    <div className="admin-table__product">
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.categoryName}</td>
                  <td>
                    <div className="admin-table__price">
                      <span>R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`stock-pill ${product.stock === 0 ? 'stock-pill--empty' : product.stock <= 5 ? 'stock-pill--low' : ''}`}>
                      {product.stock} un.
                    </span>
                  </td>
                  <td>
                    <StatusBadge active={product.active} />
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-table__action admin-table__action--secondary" onClick={() => openEditModal(product)}>
                        Editar
                      </button>
                      <button type="button" className="admin-table__action admin-table__action--ghost" onClick={() => handleToggleStatus(product.id)}>
                        {product.active ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductModal
        open={isModalOpen}
        mode={editingProduct ? 'edit' : 'create'}
        categories={mockCategories}
        initialValues={
          editingProduct || {
            name: '',
            description: '',
            categoryId: '',
            price: '',
            promotionalPrice: '',
            image: '',
            active: true,
            stock: 0,
          }
        }
        onClose={handleCloseModal}
        onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}
        onStockUpdate={(value) => editingProduct && handleStockUpdate(editingProduct.id, value)}
      />
    </div>
  );
}

export default AdminProductsPage;
