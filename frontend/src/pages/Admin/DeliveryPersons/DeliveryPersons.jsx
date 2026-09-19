import { useState } from 'react';
import { Bike, Pencil, Plus, Trash2 } from 'lucide-react';
import EmptyState from '../../../components/Admin/EmptyState/EmptyState.jsx';
import Modal from '../../../components/Admin/Modal/Modal.jsx';
import { useStore } from '../../../context/StoreContext.jsx';
import '../../../styles/admin-catalog.css';

const emptyForm = {
  name: '',
  phone: '',
  motorcycle: '',
  cpf: '',
  rg: '',
};

function DeliveryPersonsPage() {
  const { deliveryPersons, setDeliveryPersons } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeliveryPerson, setEditingDeliveryPerson] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingDeliveryPerson) {
      setDeliveryPersons((current) => current.map((person) => (person.id === editingDeliveryPerson.id ? { ...form, id: person.id } : person)));
    } else {
      setDeliveryPersons((current) => [{ ...form, id: `ent-${Date.now()}` }, ...current]);
    }
    closeModal();
  };

  const openCreateModal = () => {
    setEditingDeliveryPerson(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (deliveryPerson) => {
    setEditingDeliveryPerson(deliveryPerson);
    setForm({ ...deliveryPerson });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingDeliveryPerson(null);
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  const handleRemove = (deliveryPersonId) => {
    setDeliveryPersons((current) => current.filter((deliveryPerson) => deliveryPerson.id !== deliveryPersonId));
  };

  return (
    <div className="admin-page-content admin-catalog">
      <div className="admin-page-header">
        <div>
          <h1>Entregadores</h1>
          <p>Cadastre os entregadores disponíveis para os pedidos.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <span className="admin-toolbar__summary">
          {deliveryPersons.length} {deliveryPersons.length === 1 ? 'entregador cadastrado' : 'entregadores cadastrados'}
        </span>
        <button type="button" className="button" onClick={openCreateModal}>
          <Plus size={16} aria-hidden="true" />
          Cadastrar entregador
        </button>
      </div>

      {deliveryPersons.length === 0 ? (
        <EmptyState title="Nenhum entregador cadastrado." description="Cadastre o primeiro entregador para aceitar pedidos de entrega." />
      ) : (
        <ul className="delivery-person-list" aria-label="Entregadores cadastrados">
          {deliveryPersons.map((deliveryPerson) => (
            <li className="delivery-person" key={deliveryPerson.id}>
              <div className="delivery-person__identity">
                <div className="delivery-person__icon">
                  <Bike size={20} aria-hidden="true" />
                </div>
                <div>
                  <h2>{deliveryPerson.name}</h2>
                  <span>{deliveryPerson.phone}</span>
                </div>
              </div>
              <dl>
                <div>
                  <dt>Moto</dt>
                  <dd>{deliveryPerson.motorcycle}</dd>
                </div>
                <div>
                  <dt>CPF</dt>
                  <dd>{deliveryPerson.cpf}</dd>
                </div>
                <div>
                  <dt>RG</dt>
                  <dd>{deliveryPerson.rg}</dd>
                </div>
              </dl>
              <div className="delivery-person__actions">
                <button
                  type="button"
                  className="admin-record__action"
                  aria-label={`Editar ${deliveryPerson.name}`}
                  title={`Editar ${deliveryPerson.name}`}
                  onClick={() => openEditModal(deliveryPerson)}
                >
                  <Pencil size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="admin-record__action"
                  aria-label={`Remover ${deliveryPerson.name}`}
                  title={`Remover ${deliveryPerson.name}`}
                  onClick={() => handleRemove(deliveryPerson.id)}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <Modal
          title={editingDeliveryPerson ? 'Editar entregador' : 'Cadastrar entregador'}
          onClose={closeModal}
          onSubmit={handleSubmit}
          footer={
            <>
              <button type="button" className="button secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className="button">
                {editingDeliveryPerson ? 'Salvar alterações' : 'Cadastrar entregador'}
              </button>
            </>
          }
        >
          <div className="delivery-person-form delivery-person-form--modal">
            <div className="delivery-person-form__header">
              <div>
                <h2>{editingDeliveryPerson ? 'Editar dados' : 'Dados do entregador'}</h2>
                <p>O cadastro ficará disponível para aceitar pedidos.</p>
              </div>
              <Bike size={24} aria-hidden="true" />
            </div>
            <div className="delivery-person-form__fields">
              <label>
                Nome completo
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Telefone
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              </label>
              <label>
                Moto
                <input name="motorcycle" value={form.motorcycle} onChange={handleChange} placeholder="Modelo e placa" required />
              </label>
              <label>
                CPF
                <input name="cpf" inputMode="numeric" value={form.cpf} onChange={handleChange} required />
              </label>
              <label>
                RG
                <input name="rg" value={form.rg} onChange={handleChange} required />
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DeliveryPersonsPage;
