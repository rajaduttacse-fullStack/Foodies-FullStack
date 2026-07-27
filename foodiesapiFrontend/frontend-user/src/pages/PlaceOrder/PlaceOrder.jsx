import React, { useContext ,useState } from 'react'
import {assets} from '../../assets/assets'
import {StoreContext} from '../../context/StoreContext'
import { calculateCartTotal } from '../../util/cartUtils';
import { toast } from "react-toastify";
import {RAZORPAY_KEY} from "../../util/constants"
import { useNavigate } from "react-router-dom";
import axios from "axios";
 
function PlaceOrder() {
    const {foodList , quantities , setQuantities , token} = useContext(StoreContext);
    const navigate = useNavigate();
    const [data , setData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      state: '',
      city: '',
      zip: ''
    });

      const onChangeHandler = (event) =>{
      const name = event.target.name ;
      const value = event.target.value ;
      setData(data => ({...data , [name]: value }));
    };
    const onSubmithandler = async (event) => {
      event.preventDefault();
      const orderData = {
        userAddress: `${data.firstName} ${data.lastName} ${data.address} ${data.city} ${data.state} ${data.zip} ` ,
        phoneNumber: data.phoneNumber ,
        email: data.email ,
        orderedItems: cartItems.map(item =>({
        foodId: item.id,
        quantity: quantities[item.id],
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name
        })) ,
        amount: total.toFixed(2) ,
        orderStatus: "Preparing"
      };
       try {
      const  response = await  axios.post('http://localhost:8080/api/orders/create' , orderData, {headers: {'Authorization': `Bearer ${token}`}});
      if(response.status === 201 && response.data.razorpayOrderId){
        // initiate the payment 
        initiateRazorpayPayment(response.data);
      }else{
        toast.error("unable to order , please try again");
      }
      
       } catch (error) {
         toast.error("unable to order , please try again");
       }
    };
    const initiateRazorpayPayment = (order) =>{
      const options = {
        key: RAZORPAY_KEY ,
        amount: order.amount , //convert to paisa
        currency: "INR" ,
        name: "Food Land" ,
        description: "Food order payment" ,
        order_id: order.razorpayOrderId,
        handler: async function(razorpayResponse){
       await verifyPayment(razorpayResponse);
        },
        prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email ,
        contact: data.phoneNumber
        },
        theme: {color: "#3399cc"},
        modal:{
          ondismiss : async function(){
            toast.error("Payment Cancelled.");
           await deleteOrder(order.id);
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } ;
    
    const verifyPayment = async (razorpayResponse) =>{
      const paymentData =  {
        razorpay_payment_id: razorpayResponse.razorpay_payment_id ,
        razorpay_order_id: razorpayResponse.razorpay_order_id ,
        razorpay_signature: razorpayResponse.razorpay_signature 
      };
        try {
              const response = await axios.post('http://localhost:8080/api/orders/verify' , paymentData , {headers: {'Authorization': `Bearer ${token}`}})
        if(response.status=== 200){
          toast.success("Payment Successful");
        await  clearCart();
        navigate('/myorders');
        }else{
          toast.error("Payment failed");
          navigate('/');
        }
            
        } catch (error) {
          toast.error('Payment failed , please try again.');
        }
    };
    const deleteOrder = async (orderId) => {
      try {
       await axios.delete('http://localhost:8080/api/orders/'+orderId, {headers: {'Authorization': `Bearer ${token}`}});
      } catch (error) {
        toast.error("unable to remove the order.");
      }
    };
    const clearCart = async () =>{
       try {
         await axios.delete('http://localhost:8080/api/cart/clear' , {headers: {'Authorization': `Bearer ${token}`}});
         setQuantities({});
       } catch (error) {
        toast.error('Error While clearing the cart');
       }
    }

    const cartItems = foodList.filter(food => quantities[food.id] > 0);


    //calculation
    const {subTotal , shpping , tax , total} = calculateCartTotal(cartItems , quantities);


  return (
    <div className='container mt-2'>
       <div className="py-5 text-center">
        <img className="d-block mx-auto " src={assets.logo} alt="" width="98" height="98"/>
      
    
      </div>
    
        <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-primary" >Order Summary</span>
            <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
          </h4>
          <ul className="list-group mb-3">
          {
            cartItems.map(item => (
                <li   key={item.id}
                className="list-group-item d-flex justify-content-between lh-condensed">
              <div>
                <h6 className="my-0">{item.name}</h6>
                <small className="text-muted">Qty:{quantities[item.id]}</small>
              </div>
              <span className="text-muted">&#8377;{item.price*quantities[item.id]}</span>
            </li>
            ))
          }
            <li className="list-group-item d-flex justify-content-between">
              <div>

                <span >Shipping</span>
              </div>
              <span className="text-muted">{subTotal === 0 || subTotal > 1000 ? 0.0 : shpping.toFixed(2) }</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <div>
               
                <span className="text-muted">Tax (10%) </span>
              </div>
              <span className="text-muted">&#8377;{tax.toFixed(2)}</span>
            </li>
           
            <li className="list-group-item d-flex justify-content-between">
              <span>Total (INR)</span>
              <strong>&#8377;{total.toFixed(2)}</strong>
            </li>
          </ul>

         
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation" onSubmit={onSubmithandler}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName">First name</label>
                <input type="text" className="form-control" id="firstName" placeholder="John"  name='firstName' onChange={onChangeHandler} value={data.firstName}  required/>
                
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName">Last name</label>
                <input type="text" className="form-control" id="lastName" placeholder="Dey"  name='lastName' onChange={onChangeHandler} value={data.lastName} required/>
                
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">@</span>
                </div>
                <input type="email" className="form-control" id="email" placeholder="Email"  name='email' onChange={onChangeHandler} value={data.email} required/>
               
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="phone">Phone Number</label>
              <input type="number" className="form-control" id="phone" placeholder="1234567890"  name='phoneNumber' onChange={onChangeHandler} value={data.phoneNumber} required/>
             
            </div>

            <div className="mb-3">
              <label htmlFor="address">Address</label>
              <input type="text" className="form-control" id="address" placeholder="1234 Main St" name='address' onChange={onChangeHandler} value={data.address} required/>
             
            </div>

           

            <div className="row">
              <div className="col-md-5 mb-3">
                <label htmlFor="country">State</label>
                <select className="custom-select d-block w-100" id="state" name='state' onChange={onChangeHandler} value={data.state} required>
                  <option value="">Choose...</option>
                  <option>West Bengal</option>
                </select>
               
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="state">City</label>
                <select className="custom-select d-block w-100" id="city"  name='city' onChange={onChangeHandler} value={data.city} required>
                  <option value="">Choose...</option>
                  <option>Kolkata</option>
                </select>
               
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="zip">Zip</label>
                <input type="number" className="form-control" id="zip" placeholder="700137" name='zip' onChange={onChangeHandler} value={data.zip} required/>
             
              </div>
            </div>
            <hr className="mb-4"/>
          
            <button className="w-100 btn btn-primary btn-lg " type="submit" disabled={cartItems.length===0}>Continue to checkout</button>
          </form>
        </div>
      </div>
    
 </div>

  );
};

export default PlaceOrder ;