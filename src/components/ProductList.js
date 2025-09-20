import React, { useState, useEffect } from 'react';
import axios from '../axios';

const ProductList = () => {
  // State for product list
  const [products, setProducts] = useState([]);

  // State for new product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: ''
  });

  // State for editing product
  const [editProduct, setEditProduct] = useState(null);

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      alert('Failed to fetch products');
    }
  };

  // Handle creating a new product
  const handleCreate = async () => {
    // Basic validation
    if (!newProduct.name || !newProduct.price) {
      alert('Name and Price are required');
      return;
    }

    try {
      const res = await axios.post('/products', {
        ...newProduct,
        price: parseFloat(newProduct.price),
      });

      // Update UI with new product
      setProducts([...products, res.data]);

      // Reset new product form
      setNewProduct({ name: '', price: '', description: '' });
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product');
    }
  };

  // Handle starting edit mode for a product
  const startEdit = (product) => {
    setEditProduct({ ...product });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle saving edited product
  const handleUpdate = async () => {
    if (!editProduct.name || !editProduct.price) {
      alert('Name and Price are required');
      return;
    }

    try {
      const res = await axios.put(`/products/${editProduct.id}`, {
        ...editProduct,
        price: parseFloat(editProduct.price),
      });

      // Update product list UI
      setProducts(products.map(p => (p.id === editProduct.id ? res.data : p)));

      // Exit edit mode
      setEditProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product');
    }
  };

  // Handle cancel editing
  const cancelEdit = () => {
    setEditProduct(null);
  };

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Product CRUD App</h1>

      {/* Create New Product */}
      <h2>Create New Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newProduct.description}
        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
      />
      <button onClick={handleCreate}>Add Product</button>

      <hr />

      {/* Product List */}
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {products.map(product => (
            <li key={product.id} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
              {editProduct && editProduct.id === product.id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleEditChange}
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                  />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{product.name}</strong> - ${product.price.toFixed(2)}
                  <p>{product.description}</p>
                  <button onClick={() => startEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
