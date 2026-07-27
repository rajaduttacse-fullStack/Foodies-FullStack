import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { addFood } from "../../services/foodService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFood = () => {
  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Biriyani",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }
  
    try{
    await  addFood(data , image);
    toast.success('Food Added Successfully');
    setData({name: '' , description: '' , category: 'Biriyani' , price: ''});
    setImage(null) ;

    }catch(error){
    toast.error('Error in adding food');
    }

   
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add Food</h2>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              {/* Upload Image */}
              <div className="mb-3 text-center">
                <label htmlFor="image" style={{ cursor: "pointer" }}>
                  <img
                    src={image ? URL.createObjectURL(image) : assets.upload}
                    alt="Upload"
                    width={120}
                  />
                </label>

                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <form onSubmit={onSubmitHandler}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Food Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Type Your Food"
                    className="form-control"
                    required
                    onChange={onChangeHandler}
                    value={data.name}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Write Content Here"
                    rows="4"
                    required
                    onChange={onChangeHandler}
                    value={data.description}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    onChange={onChangeHandler}
                    value={data.category}
                  >
                    <option value="Biriyani">Biriyani</option>
                    <option value="Burger">Burger</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Cake">Cake</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Salad">Salad</option>
                    <option value="Ice Cream">Ice Cream</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>

                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    placeholder='&#8377;200'
                    required
                    onChange={onChangeHandler}
                    value={data.price}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Add Food
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;