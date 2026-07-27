import axios from "axios" ;
const  API_URL = 'http://localhost:8080/api/foods' ;
export const addFood = async(foodData , image) =>  {
  const formdata = new FormData();
    formdata.append('food' , JSON.stringify(foodData));
    formdata.append('file' , image) ;

     try{
     await  axios.post(API_URL , formdata , {headers: {"Content-Type": "multipart/form-data"} });
      
    }
    catch(error){
      console.log('Error' , error) ;
    throw error  ;
    }
}
  export const getFoodList =  async () =>{
  try{
    const response =  await axios.get(API_URL);
 return response.data ;

}

  catch(error){
    console.log("Error In Fetching Food List" , error) ;
    throw error ;
  }
}

export const deleteFood = async (foodId)  => {
 try{
   const response =   await axios.delete(API_URL+"/"+foodId);
 return response.status === 204 ;
 }catch(error){
  console.log("Error While deleting the Food" , error);
  throw error ;
 }
}
