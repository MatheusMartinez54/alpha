import { useMemo, useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import CategoryModal from '../../../components/Admin/CategoryModal/CategoryModal.jsx';
import CategoryProductsModal from '../../../components/Admin/CategoryProductsModal/CategoryProductsModal.jsx';
import StatusBadge from '../../../components/Admin/StatusBadge/StatusBadge.jsx';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import { mockCategories, mockProducts } from '../../../data/adminMocks.js';

function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;

    return categories.filter((category) => category.name.toLowerCase().includes(term));
  }, [categories, search]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCreateCategory = (formValues) => {
    const nextCategory = {
      id: `cat-${Date.now()}`,
      name: formValues.name,
      active: Boolean(formValues.active),
    };

    setCategories((current) => [nextCategory, ...current]);
    handleCloseCategoryModal();
  };

  const handleEditCategory = (formValues) => {
    const normalized = {
      ...editingCategory,
      name: formValues.name,
      active: Boolean(formValues.active),
    };

    setCategories((current) => current.map((category) => (category.id === editingCategory.id ? normalized : category)));
    handleCloseCategoryModal();
  };

  const handleToggleCategory = (categoryId) => {
    setCategories((current) => current.map((category) => (category.id === categoryId ? { ...category, active: !category.active } : category)));
  };

  const getCategoryProducts = (categoryId) => products.filter((product) => product.categoryId === categoryId);

  const openProductsModal = (category) => {
    setSelectedCategory(category);
    setIsProductsModalOpen(true);
  };

  const handleAddProductsToCategory = (selectedIds) => {
    setProducts((current) =>
      current.map((product) =>
        selectedIds.includes(product.id) ? { ...product, categoryId: selectedCategory.id, categoryName: selectedCategory.name } : product,
      ),
    );
    setIsProductsModalOpen(false);
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Categorias</h1>
          <p>Organize os produtos da sua loja</p>
        </div>

        <button type="button" className="button" onClick={openCreateModal}>
          <Plus size={16} />
          Nova categoria
        </button>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} />
          <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar categoria" />
        </label>
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState title="Nenhuma categoria encontrada." description="Tente outra busca ou cadastre uma nova categoria." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => {
                const categoryProducts = getCategoryProducts(category.id);

                return (
                  <tr key={category.id}>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td>{categoryProducts.length} produtos</td>
                    <td>
                      <StatusBadge active={category.active} />
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button type="button" className="admin-table__action admin-table__action--secondary" onClick={() => openEditModal(category)}>
                          Editar
                        </button>
                        <button type="button" className="admin-table__action admin-table__action--ghost" onClick={() => openProductsModal(category)}>
                          <Eye size={14} />
                          Ver produtos
                        </button>
                        <button
                          type="button"
                          className="admin-table__action admin-table__action--ghost"
                          onClick={() => handleToggleCategory(category.id)}
                        >
                          {category.active ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CategoryModal
        open={isCategoryModalOpen}
        mode={editingCategory ? 'edit' : 'create'}
        initialValues={editingCategory || { name: '', active: true }}
        onClose={handleCloseCategoryModal}
        onSubmit={editingCategory ? handleEditCategory : handleCreateCategory}
      />

      <CategoryProductsModal
        open={isProductsModalOpen}
        category={selectedCategory}
        products={selectedCategory ? getCategoryProducts(selectedCategory.id) : []}
        availableProducts={products.filter((product) => !product.categoryId || product.categoryId === selectedCategory?.id)}
        onClose={() => setIsProductsModalOpen(false)}
        onAddProducts={handleAddProductsToCategory}
      />
    </div>
  );
}

export default CategoriesPage;
