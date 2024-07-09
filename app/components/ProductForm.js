import { useEffect, useState } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { ReactSortable } from 'react-sortablejs';

export default function PForm({
  title: currTitle,
  desc: currDesc,
  price: currPrice,
  form,
  _id,
  imgs: images,
  category: currCategory,
  prodProps:currProdProps
}) {
  const [title, setTitle] = useState(currTitle || "");
  const [desc, setDesc] = useState(currDesc || '');
  const [price, setPrice] = useState(currPrice || '');
  const [category, setCategory] = useState(currCategory || "");
  const [prodProps,setProdProps]=useState(currProdProps || {});
  const [imgs, setImgs] = useState(images || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cat, setCat] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get('/api/categories');
        setCat(result.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }
    fetchData();
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    if (_id) {
      const data = { title, desc, price, imgs, category ,prodProps};
      await axios.put('/api/products', { ...data, _id });
    } else {
      try {
        const data = { title, desc, price, imgs };
        const res = await axios.post('/api/products', data);
        console.log(res.data);
      } catch (error) {
        console.error('Failed to create product:', error);
      }
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    return redirect('/products');
  }

  async function deleteImgs(name) {
    // Implement the delete functionality
  }

  function updImgsOrder(imgs) {
    setImgs(imgs);
  }

  async function uploadIMGS(ev) {
    setUploading(true);
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      try {
        const res = await axios.post('/api/upload', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const uploadedFiles = res.data.files;

        // Update the state with new images
        const newImgs = uploadedFiles.map((file) => ({
          name: file.fileName,
          imgURL: file.downloadURL,
        }));
        setImgs((prevImgs) => [...prevImgs, ...newImgs]);
        setUploading(false);
        ev.target.value = ''; // Reset the file input
        console.log(uploadedFiles);
      } catch (error) {
        console.error('Failed to upload images:', error);
        setUploading(false);
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Render a loading state
  }

  const props = [];
  if (cat.length>0 && category){
    let selCatInfo = cat.find(({_id})=> _id===category);
    // console.log(selCatInfo)
    if (selCatInfo && Array.isArray(selCatInfo.prop)) {
      props.push(...selCatInfo.prop);
    }
    while(selCatInfo?.parCat?._id){
      const parCat=cat.find(({_id})=> _id===selCatInfo?.parCat?._id);
      props.push(...parCat.prop)
      selCatInfo=parCat
      console.log(parCat)
    }
    // console.log(props)
  }

  function setProdProp(propName,value){
    setProdProps(prev=>{
      const newProdProps={...prev};
      newProdProps[propName]=value;
      return newProdProps
    })
  }

  return (
    <form onSubmit={saveProduct}>
      <h1>{form}</h1>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        required
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select  className='mb-2' value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {cat.length > 0 &&
          cat.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      <label >Properties</label>
      <div className='mb-1'>
      </div>
      {category.length > 0 && props.map(p => (
      <div key={p.name} className='flex items-center mb-2'>
        <div className='w-[30%]'>{p.name[0].toUpperCase()+p.name.substring(1)}</div>
        <div className='w-[70%]'>
          <select className='mb-0 shadow-md' value={prodProps[p.name]} onChange={ev => setProdProp(p.name, ev.target.value)}>
            {p.values.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        </div>
        ))}
      <div className='my-1'></div>
      <label>Photos</label>
      <div className="mb-2">
        <label className="size-24 border text-center flex justify-center text-sm gap-1 cursor-pointer bg-white rounded-lg border-gray-200 shadow-md items-center text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
            />
          </svg>
          Upload
          <input type="file" onChange={uploadIMGS} className="hidden" />
        </label>
        <ReactSortable
          list={imgs}
          setList={updImgsOrder}
          className="flex flex-wrap gap-1"
        >
          {imgs.length === 0 ? (
            <div>No photos in this product</div>
          ) : (
            imgs.map((img, index) => (
              <div
                key={index}
                className="flex flex-col items-center mt-2 w-[20%] text-center border border-gray-200 shadow-sm rounded-md"
              >
                <img
                  src={img.imgURL}
                  alt={img.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex justify-center w-[80%]">
                  <div className="truncate w-full text-center">{img.name}</div>
                </div>
              </div>
            ))
          )}
        </ReactSortable>
        {uploading && <div>Uploading...</div>}
      </div>
      <label>Product Price (in INR)</label>
      <input
        type="number"
        placeholder="price"
        required
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="description"
        value={desc}
        onChange={(ev) => setDesc(ev.target.value)}
      ></textarea>
      <button className="btn-primary" type="submit" disabled={!title || !price}>
        Save
      </button>
    </form>
  );
}
