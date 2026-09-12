import { useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Power, Search } from 'lucide-react';
import CategoryModal from '../../../components/Admin/CategoryModal/CategoryModal.jsx';
import CategoryProductsModal from '../../../components/Admin/CategoryProductsModal/CategoryProductsModal.jsx';
import StatusBadge from '../../../components/Admin/StatusBadge/StatusBadge.jsx';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import { useStore } from '../../../context/StoreContext.jsx';
import '../../../styles/admin-catalog.css';

function CategoriesPage() {
  const { categories, setCategories, products, setProducts } = useStore();
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
    <div className="admin-page-content admin-catalog">
      <div className="admin-page-header">
        <div>
          <h1>Categorias</h1>
          <p>Organize os produtos da sua loja</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            aria-label="Buscar categoria"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar categoria"
          />
        </label>
        <button type="button" className="button" onClick={openCreateModal}>
          <Plus size={16} aria-hidden="true" />
          Nova categoria
        </button>
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState title="Nenhuma categoria encontrada." description="Tente outra busca ou cadastre uma nova categoria." />
      ) : (
        <div className="admin-table-wrapper" role="region" aria-label="Listagem de categorias" tabIndex={0}>
          <table className="admin-table admin-table--categories">
            <caption className="admin-catalog__sr-only">Categorias da loja</caption>
            <colgroup>
              <col />
              <col className="admin-table__col-count" />
              <col className="admin-table__col-status" />
              <col className="admin-table__col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Categoria</th>
                <th scope="col">Produtos</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => {
                const categoryProducts = getCategoryProducts(category.id);

                return (
                  <tr key={category.id}>
                    <th scope="row">
                      <strong className="admin-table__truncate" title={category.name}>
                        {category.name}
                      </strong>
                    </th>
                    <td>
                      <span className="admin-table__count">
                        {categoryProducts.length} {categoryProducts.length === 1 ? 'produto' : 'produtos'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge active={category.active} />
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          type="button"
                          className="admin-table__action"
                          aria-label={`Editar ${category.name}`}
                          title="Editar"
                          onClick={() => openEditModal(category)}
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="admin-table__action"
                          aria-label={`Ver produtos de ${category.name}`}
                          title="Ver produtos"
                          onClick={() => openProductsModal(category)}
                        >
                          <Eye size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="admin-table__action"
                          aria-label={`${category.active ? 'Desativar' : 'Ativar'} ${category.name}`}
                          title={category.active ? 'Desativar' : 'Ativar'}
                          onClick={() => handleToggleCategory(category.id)}
                        >
                          <Power size={16} aria-hidden="true" />
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
