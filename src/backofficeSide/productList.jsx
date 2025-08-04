import { useAdminProduct } from "../components/adminProduct";

export default function ProductList() {
    const { products, loading } = useAdminProduct();

    if (loading) return <p>Please wait ...</p>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl mb-4 capitalize">product list</h2>
            <table className="table table-zebra">
                {/* head */}
                <thead>
                    <tr>
                        <th className="capitalize">no</th>
                        <th className="capitalize">product name</th>
                        <th className="capitalize">category</th>
                        <th className="capitalize">price</th>
                        <th className="capitalize">stock</th>
                        <th className="capitalize">img thumb</th>
                        <th className="capitalize">img</th>
                        <th className="capitalize">description</th>
                        <th className="capitalize">status</th>
                        <th className="capitalize">action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item)=>(
                    <tr key={item.id}>
                        <th>{products.no}</th>
                            <td>{products.productName}</td>
                            <td>{products.categories}</td>
                            <td>{products.price}</td>
                            <td>{products.stocks}</td>
                            <td>{products.thumb}</td>
                            <td>{products.img}</td>
                            <td>{products.desc}</td>
                            <td>{products.status}</td>
                            <td>
                                <ul className="flex gap-3">
                                    <li onClick={()=>navigate(`/auth/edit`,{state:products})} className='text-md rounded-full bg-blue-500 p-2'><FiEdit2 className='text-white text-lg' /></li>
                                    <li onClick={()=>navigate(`/auth/view`,{state:products})} className='text-md rounded-full bg-yellow-500 p-2'><FaRegEye className='text-white text-lg' /></li>
                                    <li onClick={()=>handleDelete(products.id)} className='text-md rounded-full bg-red-500 p-2'><FaRegTrashAlt className='text-white text-lg' /></li>
                                </ul>
                            </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}