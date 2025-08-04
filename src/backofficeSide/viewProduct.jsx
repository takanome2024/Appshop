import { useParams } from "react-router";
import { useEffect,useState } from "react";
import { useAdminProduct } from "../components/adminProduct";

export default function ProductView(){
    const {id}=useParams();
    const {getProductbyId}=useAdminProduct();
    cosnt [Product,setProduct]=useState(null);

    useEffect(()=>{
        async function fetchData(){
            const result=await getProductbyId(id);
            setProduct(result);
        }
        fetchData();
    },[id,getProductbyId]);

    if(!product) return <p>Please wait ...</p>;

    return(
                <form onSubmit={handleUpdate} className="flex justify-center items-center w-screen bg-[#EAF6FF] h-[100vh] ">
            <div className="flex flex-col bg-[#F9FAFB] p-4 rounded-xl">
                <div className="container flex justify-around gap-10">
                    <div className="leftSide p-2">
                        <div className="productName flex flex-col gap-2 mb-5">
                            <label htmlFor="name" className="capitalize">
                                product name
                            </label>
                            <input type="text" readOnly value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Type here" required className="input focus:outline-none rounded-full w-full" />
                        </div>
                        <div className="categoryName flex flex-col gap-2 mb-5">
                            <label htmlFor="category" className="capitalize">
                                category
                            </label>
                            <details className="dropdown ">
                                <summary className="btn rounded-full bg-white m-1 w-full justify-start text-left capitalize">{category}</summary>
                                <ul className="menu dropdown-content bg-white rounded-box z-1 w-full p-2 shadow-sm capitalize">
                                    {[
                                        'stationary', 'desktop & organizer', 'office', 'office techno', 'office equipment', 'whiteboard', 'battery'
                                    ].map((item) => (
                                        <li key={item}>
                                            <a onClick={() => handleSelect(item)}>{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>

                        <div className="thumbnail flex flex-col gap-2 mb-5">
                            <label htmlFor="thumb" className="capitalize">
                                thumbnail image
                            </label>
                            <input readOnly type="text" value={thumb} onChange={(e) => setThumb(e.target.value)} required className="bg-white p-2 w-100 border-1 border-stone-300 rounded-full" />
                        </div>
                        <div className="image flex flex-col gap-2 mb-5">
                            <label htmlFor="img" className="capitalize">
                                image
                            </label>
                            <input readOnly type="text" value={img} onChange={(e) => setImg(e.target.value)} required className="bg-white p-2 w-100 border-1 border-stone-300 rounded-full" />
                        </div>
                    </div>
                    <div className="rightSide p-2">
                        <div className="productPrice flex flex-col gap-2 mb-5">
                            <label htmlFor="pricing" className="capitalize">
                                price
                            </label>
                            <input readOnly type="text" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="Type here" className="input focus:outline-none rounded-full w-full" />
                        </div>
                        <div className="productPrice flex flex-col gap-2 mb-5">
                            <label htmlFor="stock" className="capitalize">
                                stock
                            </label>
                            <input readOnly type="number" value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="Type here" className="input focus:outline-none rounded-full w-full" />
                        </div>
                        <div className="productDetail flex flex-col gap-2 mb-5">
                            <label htmlFor="pricing" className="capitalize">
                                description
                            </label>
                            <textarea placeholder="Input description" value={description} onChange={(e) => setDescription(e.target.value)} className=" bg-white border-stone-300 border-1 p-2 rounded-md outline-none" rows="4" cols="50" />
                        </div>
                        <div className="productStatus flex flex-col gap-2 mb-5">
                            <label htmlFor="active" className="capitalize">
                                active
                            </label>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={handleToggle}
                                className="toggle border-stone-400 bg-stone-50 checked:border-stone-400 checked:bg-green-500 checked:text-stone-50"
                            />
                        </div>
                    </div>
                </div>
                <div className="buttonSection flex flex-col gap-3">
                    <button type="button" onClick={()=>navigate("/auth/ProductData")} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl capitalize rounded-full border-green-600 text-green-600 text-[1rem]">cancel</button>
                </div>
            </div>
        </form>
    )
}