export const calculateCartTotal = (cartItems , quantities) => {
        const subTotal = cartItems.reduce(
      (acc , food) => acc + food.price * quantities[food.id] 
      , 0
    );
    const shpping = subTotal === 0 || subTotal > 1000 ? 0.0 : 50.00 ;
    const tax = subTotal*0.1 ; // 10% tax 
    const total = subTotal+shpping+tax ;
return {subTotal , shpping , tax , total} ;
}
