import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 2rem;
`;

const DeleteButton = styled.button`
  background-color: #e63946;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 220px;

  &:hover {
    background-color: #c53030;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const DeleteAllDataButtons = () => {
  const [loadingKey, setLoadingKey] = useState(null);

  const handleDeleteWallet = async () => {
    setLoadingKey('wallet');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/Matka`);
      alert('Data deleted Matka successfully.');
    } catch (err) {
      alert('Failed to delete wallet data.');
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDeleteTransactions = async () => {
    setLoadingKey('transactions');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/allcricket`);
      alert('Transaction data deleted successfully.');
    } catch (err) {
      alert('Failed to delete transactions.');
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDeleteBalance = async () => {
    setLoadingKey('balance');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/mines`);
      alert('Balance data deleted successfully.');
    } catch (err) {
      alert('Failed to delete balance.');
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDeleteAccounts = async () => {
    setLoadingKey('accounts');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/accounts`);
      alert('Linked accounts deleted successfully.');
    } catch (err) {
      alert('Failed to delete accounts.');
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDeletePreferences = async () => {
    setLoadingKey('preferences');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/aarpaarparchi`);
      alert('Delete aarpaar parchi  successfully.');
    } catch (err) {
      alert('Failed to delete preferences.');
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDeleteAll = async () => {
    setLoadingKey('all');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/tittli`);
      alert('All data deleted successfully.');
    } catch (err) {
      alert('Failed to delete all data.');
    } finally {
      setLoadingKey(null);
    }
  };


  const handleDeleteBhar = async () => {
    setLoadingKey('bhar');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/andhr`);
      alert('All data deleted successfully.');
    } catch (err) {
      alert('Failed to delete all data.');
    } finally {
      setLoadingKey(null);
    }
  };
  

  const handleDeleteDepoWidhraw = async () => {
    setLoadingKey('dp');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/delete/dphistory`);
      alert('All data deleted successfully.');
    } catch (err) {
      alert('Failed to delete all data.');
    } finally {
      setLoadingKey(null);
    }
  };
  

  return (
    <Container>
      <DeleteButton onClick={handleDeleteWallet} disabled={loadingKey === 'wallet'}>
        Delete All Matka History
      </DeleteButton>
      <DeleteButton onClick={handleDeleteTransactions} disabled={loadingKey === 'transactions'}>
        Delete All Cricket History
      </DeleteButton>
      <DeleteButton onClick={handleDeleteBalance} disabled={loadingKey === 'balance'}>
        Delete All Mines History
      </DeleteButton>
      <DeleteButton onClick={handleDeleteAccounts} disabled={loadingKey === 'accounts'}>
        Delete All Avaitor
      </DeleteButton>
      <DeleteButton onClick={handleDeletePreferences} disabled={loadingKey === 'preferences'}>
        Delete All Aaar Paar Parchi
      </DeleteButton>
      <DeleteButton onClick={handleDeleteAll} disabled={loadingKey === 'all'}>
        Delete Titli patta
      </DeleteButton>
      <DeleteButton onClick={handleDeleteBhar} disabled={loadingKey === 'bhar'}>
        Delete Andhar Bhar
      </DeleteButton>
      <DeleteButton onClick={handleDeleteDepoWidhraw} disabled={loadingKey === 'dp'}>
        Delete All Deposite and Widhraw History
      </DeleteButton>
    </Container>
  );
};

export default DeleteAllDataButtons;
