import './App.css';
import { use, useEffect, useState } from 'react';
import ProductList from './ProductList';
import CategoryFilter from './CategoryFilter';

function App() {
  const[products,setProducts]=useState([]);
  const[categories,setCategories]=useState([]);
  const[selectedcategory,setSelectedCategory]=useState([]);
  const[searchTerm,setSearchTerm]=useState("");
  const[sortOrder,setSortOrder]=useState("asc");
  
  useEffect(()=>{
    fetch('http://localhost:8080/api/products')
    .then(response=>response.json())
    .then(data=>setProducts(data));

    fetch("http://localhost:8080/api/categories")
    .then(response=>response.json())
    .then(data=>setCategories(data));
  },[]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSortChange = (event) =>{
    setSortOrder(event.target.value);
  }

  const handleCategorySelect = (categoryId) =>{
    setSelectedCategory(categoryId ? Number(categoryId) : null);
  }

  const filteredProducts = products
        .filter(product =>{
          return(
            (selectedcategory ? product.category.id===selectedcategory : true)
            &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })
        .sort((a,b)=>{
          if(sortOrder==="asc"){
            return a.price - b.price;
          }else{
            return b.price-a.price;
          }
        });

  return (
    <div className='container'>

      <h1 className='my-4 text-center'>Product Catalog</h1>

      <div className='row align-item-center mb-4'>
        <div className='col-md-3 col-sm-12 mb-12'>
          <CategoryFilter categories={categories} onSelect={handleCategorySelect}/>
        </div>
        <div className='col-md-5 col-sm-12 mb-12'>
          <input
                type='text'
                className='form-control'
                placeholder='search for product'
                onChange={handleSearchChange}
          ></input>
        </div>

        <div className='col-md-4 col-sm-12 mb-2'>
          <select className='form-control' onChange={handleSortChange}>
          <option value="asc">Sort By Price: Low to High</option>
            <option value="desc">Sort By Price: High to Low</option>
          </select>
        </div>

      </div>

    <div>
      {filteredProducts.length ? (
        <ProductList products={filteredProducts}/>
      ) : (
        <p>No Product Found</p>
      )}
    </div>
    </div>
  );
}

export default App;
