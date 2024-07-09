'use client';
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Page({ swal }) {
    const [name, setName] = useState("");
    const [cat, setCat] = useState([]);
    const [parCat, setParCat] = useState(null);
    const [state, setState] = useState(null);
    const [prop, setProp] = useState([]);

    function fetchCat() {
        axios.get('/api/categories').then(result => {
            setCat(result.data);
        });
    }

    function editCat(category) {
        setState(category);
        setName(category.name);
        setParCat(category.parCat?._id);
        setProp(category.prop.map(({ name, values }) => ({
            name,
            values: values.join(',')
        })));
    }

    function delCat(category) {
        swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, Delete!",
            reverseButtons: true,
            confirmButtonColor: "#d55"
        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete('/api/categories?_id=' + category._id);
                fetchCat();
            }
        }).catch(error => {
            // Handle error...
        });
    }

    function addProp() {
        setProp(prev => [...prev, { name: '', values: '' }]);
    }

    function handlePropertyNameChange(index, property, newName) {
        setProp(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProp(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProp(prev => prev.filter((_, pIndex) => pIndex !== indexToRemove));
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parCat,
            prop: prop.map(p => ({ name: p.name, values: p.values.split(',') }))
        };
        
        if (state) {
            await axios.put('/api/categories', { ...data, _id: state._id });
        } else {
            await axios.post('/api/categories', data);
        }
        
        setName("");
        setParCat("");
        setProp([]);
        setState(null);
        fetchCat();
    }

    useEffect(() => {
        fetchCat();
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{state ? `Edit Category "${state.name}"` : 'Create new category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                        type="text"
                        placeholder="Category Name"
                    />
                    <select value={parCat} onChange={ev => setParCat(ev.target.value)}>
                        <option value="">No parent Category</option>
                        {cat.length > 0 && cat.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-1.5">
                    <label className="block">Properties</label>
                    <button className="btn default py-1" type="button" onClick={addProp}>
                        Add new property
                    </button>
                    {prop.length > 0 && prop.map((property, index) => (
                        <div key={index} className="flex gap-2 md:w-full w-[95%] mt-2">
                            <input
                                type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                placeholder="Property name (example: color)"
                            />
                            <input
                                type="text"
                                className="mb-0"
                                value={property.values}
                                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                                placeholder="Values, comma separated"
                            />
                            <button
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="btn red"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {state && (
                        <button
                            onClick={() => { setState(null); setName(''); setParCat(''); setProp([]); }}
                            className="btn default"
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn default py-1">Save</button>
                </div>
            </form>
            {!state && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category Name</td>
                            <td>Parent Category</td>
                            <td>Settings</td>
                        </tr>
                    </thead>
                    <tbody>
                        {cat.length > 0 && cat.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parCat?.name}</td>
                                <td>
                                    <button onClick={() => editCat(category)} className="btn default mr-1">
                                        Edit
                                    </button>
                                    <button onClick={() => delCat(category)} className="btn red">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => (
    <Page swal={swal} />
));
