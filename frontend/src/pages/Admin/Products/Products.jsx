import { useMemo, useState } from 'react';
import { Pencil, Plus, Power, Search } from 'lucide-react';
import ProductModal from '../../../components/Admin/ProductModal/ProductModal.jsx';
import ProductThumbnail from '../../../components/Admin/ProductThumbnail/ProductThumbnail.jsx';
import StatusBadge from '../../../components/Admin/StatusBadge/StatusBadge.jsx';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import { mockCategories, mockProducts } from '../../../data/adminMocks.js';
import '../../../styles/admin-catalog.css';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

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
    <div className="admin-page-content admin-catalog">
      <div className="admin-page-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os produtos da sua loja</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input type="search" aria-label="Buscar produto" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto" />
        </label>
        <button type="button" className="button" onClick={openCreateModal}>
          <Plus size={16} aria-hidden="true" />
          Cadastrar produto
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState title="Nenhum produto encontrado." description="Tente outro termo de busca ou cadastre um novo produto." />
      ) : (
        <div className="admin-table-wrapper" role="region" aria-label="Listagem de produtos" tabIndex={0}>
          <table className="admin-table admin-table--products">
            <caption className="admin-catalog__sr-only">Produtos da loja</caption>
            <colgroup>
              <col className="admin-table__col-image" />
              <col />
              <col className="admin-table__col-category" />
              <col className="admin-table__col-price" />
              <col className="admin-table__col-stock" />
              <col className="admin-table__col-status" />
              <col className="admin-table__col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Imagem</th>
                <th scope="col">Produto</th>
                <th scope="col">Categoria</th>
                <th scope="col">Preço</th>
                <th scope="col" className="admin-table__stock">Estoque</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <ProductThumbnail src={product.image} alt={product.name} />
                  </td>
                  <th scope="row">
                    <div className="admin-table__product">
                      <strong title={product.name}>{product.name}</strong>
                      {product.description && <small title={product.description}>{product.description}</small>}
                    </div>
                  </th>
                  <td>
                    <span className="admin-table__truncate admin-table__category" title={product.categoryName}>{product.categoryName}</span>
                  </td>
                  <td className="admin-table__number">
                    <span className="admin-table__truncate" title={currency.format(Number(product.price))}>{currency.format(Number(product.price))}</span>
                  </td>
                  <td className="admin-table__stock">
                    <span className={`stock-pill ${product.stock === 0 ? 'stock-pill--empty' : product.stock <= 5 ? 'stock-pill--low' : ''}`}>
                      {product.stock} un.
                    </span>
                  </td>
                  <td>
                    <StatusBadge active={product.active} />
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-table__action" aria-label={`Editar ${product.name}`} title="Editar" onClick={() => openEditModal(product)}>
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                      <button type="button" className="admin-table__action" aria-label={`${product.active ? 'Desativar' : 'Ativar'} ${product.name}`} title={product.active ? 'Desativar' : 'Ativar'} onClick={() => handleToggleStatus(product.id)}>
                        <Power size={16} aria-hidden="true" />
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
