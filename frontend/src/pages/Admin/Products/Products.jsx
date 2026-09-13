import { useMemo, useState } from 'react';
import { Pencil, Plus, Power, Search } from 'lucide-react';
import AdminRecord, { AdminRecordAction } from '../../../components/Admin/AdminRecord/AdminRecord.jsx';
import ProductModal from '../../../components/Admin/ProductModal/ProductModal.jsx';
import ProductThumbnail from '../../../components/Admin/ProductThumbnail/ProductThumbnail.jsx';
import StatusBadge from '../../../components/Admin/StatusBadge/StatusBadge.jsx';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import { useStore } from '../../../context/StoreContext.jsx';
import { formatCurrency, normalizeSearch } from '../../../utils/format.js';
import '../../../styles/admin-catalog.css';

function AdminProductsPage() {
  const { products, setProducts, categories } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const catalogProducts = useMemo(() => {
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
    return products.map((product) => ({
      ...product,
      categoryName: categoryNames.get(product.categoryId) || product.categoryName || 'Sem categoria',
    }));
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    const term = normalizeSearch(search);

    if (!term) return catalogProducts;

    return catalogProducts.filter((product) => {
      const matchesName = normalizeSearch(product.name).includes(term);
      const matchesCategory = normalizeSearch(product.categoryName).includes(term);
      return matchesName || matchesCategory;
    });
  }, [catalogProducts, search]);

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
      categoryName: categories.find((category) => category.id === formValues.categoryId)?.name || 'Sem categoria',
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
      categoryName: categories.find((category) => category.id === formValues.categoryId)?.name || editingProduct.categoryName,
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
    if (!Number.isInteger(value) || value < 0) return;
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
          <input
            type="search"
            aria-label="Buscar produto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produto"
          />
        </label>
        <button type="button" className="button" onClick={openCreateModal}>
          <Plus size={16} aria-hidden="true" />
          Cadastrar produto
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState title="Nenhum produto encontrado." description="Tente outro termo de busca ou cadastre um novo produto." />
      ) : (
        <ul className="admin-record-list" aria-label="Listagem de produtos">
          {filteredProducts.map((product) => (
            <AdminRecord
              key={product.id}
              image={<ProductThumbnail src={product.image} alt={product.name} />}
              title={product.name}
              description={product.description}
              details={
                <>
                  <span className="admin-record__category">{product.categoryName}</span>
                  <span className="admin-record__price">{formatCurrency(product.price)}</span>
                  <span className={`stock-pill ${product.stock === 0 ? 'stock-pill--empty' : product.stock <= 5 ? 'stock-pill--low' : ''}`}>
                    {product.stock} un.
                  </span>
                  <StatusBadge active={product.active} />
                </>
              }
              actions={
                <>
                  <AdminRecordAction label={`Editar ${product.name}`} onClick={() => openEditModal(product)}>
                    <Pencil size={18} aria-hidden="true" />
                  </AdminRecordAction>
                  <AdminRecordAction
                    label={`${product.active ? 'Desativar' : 'Ativar'} ${product.name}`}
                    onClick={() => handleToggleStatus(product.id)}
                  >
                    <Power size={18} aria-hidden="true" />
                  </AdminRecordAction>
                </>
              }
            />
          ))}
        </ul>
      )}

      <ProductModal
        open={isModalOpen}
        mode={editingProduct ? 'edit' : 'create'}
        categories={categories}
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
