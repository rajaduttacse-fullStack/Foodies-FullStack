import React, { useEffect, useState } from 'react'
import {toast} from 'react-toastify'
import axios from 'axios' 
import './ListFood.css'
import { deleteFood, getFoodList } from '../../services/foodService'

const ListFood = () => {
  const [List, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await getFoodList();
      // Safely extract the array whether it's wrapped in a Page object or Axios response
      const foodData = response.data ? response.data.content || response.data : response.content || response;
      setList(Array.isArray(foodData) ? foodData : []);
    } catch (error) {
      toast.error('Error While reading the Foods');
    }
  }
 
  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if(success) {
        toast.success('Food Removed');
        await fetchList();
      } else {
        toast.error('Error Occured While removing the Food');
      }
    } catch(error) {
      toast.error('Error Occured While removing the Food');
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='py-5 row justify-content-center'>
      <div className='col-11 card'>
        <table className='table'>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              List.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img src={item.imageUrl} alt="" height={48} width={48} />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>&#8377;{item.price}.00</td>
                    <td className='text-danger'>
                      <i className='bi bi-x-circle-fill' onClick={() => removeFood(item.id)}></i>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListFood;