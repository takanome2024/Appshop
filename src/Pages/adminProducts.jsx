import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../configs/firebase";
import { toast } from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    stocks: "",
    categories: "",
    desc: "",
    thumb: "",
    status:"ready"
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product
  const handleAdd = async () => {
    try {
      await addDoc(collection(db, "products"), {
        ...formData,
        price: Number(formData.price),
        stocks: Number(formData.stocks),
        createdAt: serverTimestamp()
      });
      toast.success("Product added");
      setFormData({ productName: "", price: "", stocks: "", categories: "", desc: "", thumb: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  // Update product
  const handleUpdate = async (id) => {
    try {
      await updateDoc(doc(db, "products", id), {
        ...formData,
        price: Number(formData.price),
        stocks: Number(formData.stocks),
        updatedAt: serverTimestamp()
      });
      toast.success("Product updated");
      setEditingId(null);
      setFormData({ productName: "", price: "", stocks: "", categories: "", desc: "", thumb: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const formatDate = (ts) => {
    if (!ts) return "-";
    const date = ts.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🛠 Admin Product Management</h2>

      {/* Form */}
      <div className="card bg-base-200 p-4 mb-8 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="productName" placeholder="Product Name"
            className="input input-bordered w-full"
            value={formData.productName} onChange={handleChange} />
          <input type="number" name="price" placeholder="Price"
            className="input input-bordered w-full"
            value={formData.price} onChange={handleChange} />
          <input type="number" name="stocks" placeholder="Stocks"
            className="input input-bordered w-full"
            value={formData.stocks} onChange={handleChange} />
          <input type="text" name="categories" placeholder="Category"
            className="input input-bordered w-full"
            value={formData.categories} onChange={handleChange} />
          <input type="text" name="thumb" placeholder="Image URL"
            className="input input-bordered w-full"
            value={formData.thumb} onChange={handleChange} />
          <textarea name="desc" placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={formData.desc} onChange={handleChange} />
        </div>
        <div className="mt-4">
          {editingId ? (
            <button className="btn btn-info mr-2" onClick={() => handleUpdate(editingId)}>💾 Update</button>
          ) : (
            <button className="btn btn-success mr-2" onClick={handleAdd}>➕ Add Product</button>
          )}
          {editingId && (
            <button className="btn btn-warning" onClick={() => {
              setEditingId(null);
              setFormData({ productName: "", price: "", stocks: "", categories: "", desc: "", thumb: "" });
            }}>❌ Cancel</button>
          )}
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Thumb</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stocks</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Create At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td><img src={p.thumb} alt={p.productName} className="w-12 h-12 object-cover rounded" /></td>
                <td>{p.productName}</td>
                <td>IDR {p.price}</td>
                <td>{p.stocks}</td>
                <td>{p.categories}</td>
                <td>{p.desc}</td>
                <td>{p.status}</td>
                <td>{formatDate(p.createdAt)}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-primary"
                    onClick={() => {
                      setEditingId(p.id);
                      setFormData({
                        productName: p.productName,
                        price: p.price,
                        stocks: p.stocks,
                        categories: p.categories,
                        desc: p.desc || "",
                        thumb: p.thumb || "",
                        status: p.status || "ready"
                      });
                    }}>✏ Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(p.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
