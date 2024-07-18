import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

interface Product {
  id: number;
  nombre: string;
  imagenInventario: string | null;
  categoria: string;
  descripcion: string;
  precio: number;
  quantity: number;
}
interface OrderItemProps {
  image: string;
  title: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  // onAddQuantity: () => void;
  // onRemoveQuantity: () => void;
  // onAddExtras: (producto: Product) => void; // <-- Actualizar la firma de la función
  // onInfoClick: (producto: Product) => void; // <-- Actualizar la firma de la función
  product?: Product;
}


const OrderItemContainer = styled.div`
  display: flex;

  align-items: center;
  background-color: #EEF2FF;
  border-radius: 20px;
  padding: 5px; // Reducir el padding
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width:100%; 

  @media (max-width: 1024px) {
    text-align: center;
    max-width: 100%;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;

  @media (max-width: 1024px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const ActionButton = styled.button<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: darken(${({ bgColor }) => bgColor}, 10%);
  }
`;

const AddExtrasButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  left:80%;

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 1024px) {
  left: 60%;
  }
`;

const Quantity = styled.div`
  font-size: 24px;
  margin-left: 10px;
  margin-right: 10px;
`;

const InfoIcon = styled.div`
  background-color: #e0e0e0;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  margin-left: 96%;
  top: 10px;

  @media (max-width: 1024px) {
     margin-left: 95%;
  }
`;

const OrderItem: React.FC<OrderItemProps> = ({ image, title, onAdd, onRemove, product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity(quantity + 1);
    onAdd();
  };

  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      onRemove();
    }
  };

  return (
    <>
      <OrderItemContainer>
        <ItemImage src={image} alt={title} />
        <ItemDetails>
          <ItemTitle>{title}</ItemTitle>
        </ItemDetails>
        <ActionButton bgColor="#28a745" onClick={handleAdd}>+</ActionButton>
        <Quantity>{quantity}</Quantity>
        <ActionButton bgColor="#dc3545" onClick={handleRemove}>-</ActionButton>
      </OrderItemContainer>
    </>
  );
};

export default OrderItem;