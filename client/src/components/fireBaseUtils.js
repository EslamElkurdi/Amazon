import {updateDoc,collection,addDoc,deleteDoc,orderBy,limit,setDoc,doc,query,where,getDoc, getDocs} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../firebase";
import { sendOrderDataToUserEmail } from "./Orders/OrdersUtils";

async function getCategories(){
  const querySnapshot = await getDocs(collection(db, "categories"));
  const dataArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
  }));
  console.log(dataArray);
  return dataArray;
}
export {getCategories};

async function getCategoryById(catId){
    if(catId==="All"){
      return {en:{name:"All products"},ar:{name:"كل المنتجات"}}
    }else{
      try {
        const docRef = doc(db, "categories", catId);
        const docSnapshot = await getDoc(docRef);
        
        if (docSnapshot.exists()) {
          const categoryData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          };
          console.log(categoryData,"categoryData")
          return categoryData;
        } else {
          console.log("No such category document!");
          return null;
        }
      } catch (error) {
        console.error("Error fetching category by ID: ", error);
        return null;
      }
    }
}
export {getCategoryById};

 function getCategoryBrands(productsSnapshot,catId){
  const brands = [];
  console.log("brands entered")

  // Loop through products
  productsSnapshot.forEach((productData) => {
    // Check if the product belongs to the given categoryId
    if (productData.category._id === catId) {
      // Extract the brand name from the 'en' key
      const brandName = productData.en.brand;

      // Add the brand name to the array if it's not already there
      if (!brands.includes(brandName)) {
        brands.push(brandName);
      }
    }
  });
  console.log(brands)
  return brands;}


  async function getProductFiltered(catId, searchTerm, rating, priceRange, brands) {// from 8
    let products = [];
    console.log("entered getProductFiltered");
    try {
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        console.log(productsSnapshot)
        console.log("entered getProductFiltered2");

        // Fetch all reviews at once
        const reviewsQuerySnapshot = await getDocs(collection(db, 'reviews'));
        console.log(reviewsQuerySnapshot)
        // Create a map to store reviews for each product
        const reviewsMap = {};
        reviewsQuerySnapshot.forEach(reviewDoc => {
            const reviewData = reviewDoc.data();
            const productId = reviewData.productId;
            if (!reviewsMap[productId]) {
                reviewsMap[productId] = [];
            }
            reviewsMap[productId].push(reviewData);
        });

        // Process products and calculate ratings
        for (const doc of productsSnapshot.docs) {
            const productData = doc.data();
            // Check if the product belongs to the specified category or if 'All' categories are requested
            if (catId === 'All' || productData.category._id === catId) {
                const productId = doc.id;
                const reviews = reviewsMap[productId] || [];
                let totalRating = 0;
                let reviewCount = reviews.length;
                reviews.forEach(review => {
                    totalRating += review.rating;
                });
                const overallRating = reviewCount > 0 ? Math.floor(totalRating / reviewCount) : 0;
                // Add productId and rating to the productData
                const productWithRating = {
                    ...productData,
                    productId: productId,
                    rating: overallRating,
                    ratingsNumber: reviewCount
                };
                products.push(productWithRating);
            }
        }

        console.log("entered getProductFiltered22");
        // Filter by search term
        if (searchTerm) {
            products = products.filter((product) => {
                return (product.en.title.toLowerCase().includes(searchTerm)||product.ar.title.toLowerCase().includes(searchTerm));
            });
        }
        const productsBrands = getCategoryBrands(products, catId);
        console.log(products, "products1", productsBrands, "productsBrands");
        return { products, productsBrands };
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}
export { getProductFiltered };

async function getProductFilteredInner(allCategoryProducts, rating, priceRange, brands) {
  let products = allCategoryProducts;

    // Filter by rating
    if (rating) {
      products = products.filter(product => product.rating === rating);
    }

    // Filter by price range
    if (priceRange == "any" ) {
      
    }else if(priceRange == "above10000"){
      products = products.filter(product => product.price > 10000);
    }else{
      priceRange = parseInt(priceRange.match(/\d+/)[0]); // Extracts the first sequence of digits
      products = products.filter(product => product.price <= priceRange);
    }

    // // Filter by brands
    if (brands.length) {
      products = products.filter(product => brands.includes(product.en.brand));
    }
    console.log(products,"products2")
  return products;
}
export { getProductFilteredInner };

async function getProduct(productId) {
  try {
    const productRef = doc(collection(db, 'products'), productId);
    const productDoc = await getDoc(productRef);
    if (productDoc.exists()) {
    // Construct the query for fetching reviews for the current product
    const productReviewsQuery = query(collection(db, 'reviews'), where('productId', '==', productId));
    const productReviewsSnapshot = await getDocs(productReviewsQuery);
    
    let totalRating = 0;
    let reviewCount = 0;

    productReviewsSnapshot.forEach(reviewDoc => {
      const reviewData = reviewDoc.data();
      totalRating += reviewData.rating;
      reviewCount++;
    });

    // Calculate the overall rating
    const overallRating = reviewCount > 0 ? Math.floor(totalRating / reviewCount) : 0;

    // Add productId and rating to the productData
    const productWithRating = {
      ...productDoc.data(),
      rating: overallRating,
      ratingsNumber: reviewCount
    };
    

      return productWithRating;
    } else {
      console.log('No such product document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export { getProduct };

async function getReviewsForProduct(productId) {
  try {
    const productReviewsQuery = query(collection(db, 'reviews'), where('productId', '==', productId));
    const productReviewsSnapshot = await getDocs(productReviewsQuery);

    // Initialize an array to store the reviews
    const reviews = [];

    // Iterate over each review document
    productReviewsSnapshot.forEach(reviewDoc => {
      const reviewData = reviewDoc.data();
      
      // Extract rating and comment from review data
      const { rating, comment } = reviewData;

      // Create a review object and push it to the reviews array
      reviews.push({ rating, comment });
    });

    // Return the array of reviews
    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

export { getReviewsForProduct };

async function submitReviewsForProduct(productId, userId, reviewData) {
  try {
    const reviewObject = {
      productId: productId,
      userId: userId,
      comment: reviewData.review,
      rating: reviewData.rating
    };

    // Check if the user has already submitted a review for this product
    const querySnapshot = await getDocs(
      query(collection(db, 'reviews'), where('productId', '==', productId), where('userId', '==', userId))
    );

    if (!querySnapshot.empty) {
      // If the user has already submitted a review, update the existing one
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, reviewObject);
      console.log('Review updated successfully!');
    } else {
      // If the user has not submitted a review before, add a new one
      await addDoc(collection(db, 'reviews'), reviewObject);
      console.log('Review submitted successfully!');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
  }
}

export { submitReviewsForProduct };

// update cart on db
async function updateCartDb(userId,productId,quantity=1){
  userAlreadyHasCart(userId)
  .then(hasCart => {
      if (hasCart) {
          // User already has a cart so you must push product
          pushProductToCart(userId,productId,quantity)            
      } else {
          //User does not have a cart in db you must push it
          pushCartToDatabase(userId,productId,quantity)
        }
  })
  .catch(error => {
      console.error('Error checking user cart:', error);
  });
}
export {updateCartDb};

async function userAlreadyHasCart(userId){
  try {
      // Query the cart collection for documents with the specified userId
      const querySnapshot = await getDocs(query(collection(db, 'cart'), where('userId', '==', userId)));
      // Check if any documents matching the query exist
      return !querySnapshot.empty;
  } catch (error) {
      console.error('Error checking user cart:', error);
      // Handle error
      return false;
  }
}

async function pushCartToDatabase(userId,productId,quantity=1){
  try {
    // Retrieve the product details from the "products" collection based on productId
    const productDoc = await getDoc(doc(db, 'products', productId));
    const productData = productDoc.data();
    
    if (productData) {
        // Calculate the total price for the product based on its price and quantity
        const totalPrice = productData.price * quantity;
        
        // Prepare the cart data
        const cartData = {
            userId: userId,
            totalPrice: totalPrice,
            products: [
                {
                    productId: productId,
                    quantity: quantity
                }
            ]
        };

        // Push the cart data to the "cart" collection
        await addDoc(collection(db, 'cart'), cartData);
    } else {
        console.error('Product not found.');
    }
} catch (error) {
    console.error('Error pushing cart to database:', error);
}
}

async function pushProductToCart(userId,productId,quantity=1){
  try {
    // Retrieve the current cart document for the given userId
    const cartQuerySnapshot = await getDocs(query(collection(db, 'cart'), where('userId', '==', userId)));
    const cartDocs = cartQuerySnapshot.docs;
    
    if (cartDocs.length > 0) {
        const cartDoc = cartDocs[0];
        const cartData = cartDoc.data();
        
        // Check if the product already exists in the cart
        const existingProductIndex = cartData.products.findIndex(product => product.productId === productId);
        
        if (existingProductIndex !== -1) {
            // If the product already exists, update its quantity
            cartData.products[existingProductIndex].quantity += quantity;
        } else {
            // If the product does not exist, add it to the products array
            cartData.products.push({
                productId: productId,
                quantity: quantity
            });
        }
        
        // Recalculate the total price based on the updated quantities of products
        let totalPrice = 0;
        for (const product of cartData.products) {
            const productDoc = await getDoc(doc(db, 'products', product.productId));
            const productData = productDoc.data();
            totalPrice += productData.price * product.quantity;
        }
        cartData.totalPrice = totalPrice;
        
        // Update the cart document in the Firestore database with the new products array and total price
        await updateDoc(doc(db, 'cart', cartDoc.id), cartData);
    } else {
        console.error('Cart not found for userId:', userId);
    }
} catch (error) {
    console.error('Error pushing product to cart:', error);
}
}

// update cart on localStorage
async function updateCartLocalStorage(userId,productId,quantity=1){
  // Check if the key 'userCart' exists in localStorage
if (localStorage.getItem('userCart') !== null) {
  // make cart for user
  console.log('The key "userCart" exists in localStorage.');
  await pushProductToCartLocalStorage(userId,productId,quantity)//from 8
} else {
  // update already existing cart
  console.log('The key "userCart" does not exist in localStorage.');
  await pushCartToLocalStorage(userId,productId,quantity);// from 8 
}
}
export {updateCartLocalStorage};

async function pushCartToLocalStorage(userId,productId,quantity=1){
  try {
    // Retrieve the product details from the "products" collection based on productId
    const productDoc = await getDoc(doc(db, 'products', productId));
    const productData = productDoc.data();
    
    if (productData) {
        // Calculate the total price for the product based on its price and quantity
        const totalPrice = productData.price * quantity;
        
        // Prepare the cart data
        const cartData = {
            userId: userId,
            totalPrice: totalPrice,
            products: [
                {
                    productId: productId,
                    quantity: quantity
                }
            ]
        };

        // Push the cart data to the localStorage
        localStorage.setItem('userCart', JSON.stringify(cartData));
    } else {
        console.error('Product not found.');
    }
} catch (error) {
    console.error('Error pushing cart to localStorage:', error);
}
}

async function pushProductToCartLocalStorage(userId,productId,quantity=1){
  console.log(JSON.parse(localStorage.getItem('userCart')))
  try {
    // Retrieve the current cart document from localStorage
      const cartData = (JSON.parse(localStorage.getItem('userCart')));
        
        // Check if the product already exists in the cart
        const existingProductIndex = cartData.products.findIndex(product => product.productId === productId);
        
        if (existingProductIndex !== -1) {
            // If the product already exists, update its quantity
            cartData.products[existingProductIndex].quantity += quantity;
        } else {
            // If the product does not exist, add it to the products array
            cartData.products.push({
                productId: productId,
                quantity: quantity
            });
        }
        
        // Recalculate the total price based on the updated quantities of products
        let totalPrice = 0;
        for (const product of cartData.products) {
            const productDoc = await getDoc(doc(db, 'products', product.productId));
            const productData = productDoc.data();
            totalPrice += productData.price * product.quantity;
        }
        cartData.totalPrice = totalPrice;
        
        // Update the cart document in the localStorage with the new products array and total price
        localStorage.setItem('userCart', JSON.stringify(cartData));
    
} catch (error) {
    console.error('Error pushing product to cart:', error);
}
}


function createNumberArray(num) {
  const result = [];
  for (let i = 1; i <= num; i++) {
      result.push(i);
  }
  return result;
}
export{createNumberArray};

async function getAvailableQuantityDb(userId,productId) {
  // AvailableQuantity must be real product quantity - the product quantity if user added it before to his cart
  try {
    // Fetch quantity in stock from products collection
    const productDoc = await getDoc(doc(db, 'products', productId));
    const quantityInStock = productDoc.data().quantityInStock;
    // Fetch user's cart
    const querySnapshot = await getDocs(query(collection(db, 'cart'), where('userId', '==', userId)));

    let availableQuantity = quantityInStock; // Initialize availableQuantity to quantityInStock

    if (!querySnapshot.empty) {
        // Iterate through the documents in the query snapshot
        querySnapshot.forEach(doc => {
            const productsInCart = doc.data().products;
            if (productsInCart) {
                // Find the product in the cart
                const productInCart = productsInCart.find(product => product.productId === productId);
                if (productInCart) {
                    // Reduce quantity from availableQuantity
                    const quantityInCart = productInCart.quantity;
                    availableQuantity -= quantityInCart;
                }
            }
        });
    }

    // Ensure availableQuantity is not negative
    availableQuantity = Math.max(availableQuantity, 0);

    return availableQuantity;
} catch (error) {
    console.error('Error fetching available quantity:', error);
    return 0; // Return 0 as available quantity in case of error
}
}
export{getAvailableQuantityDb};

async function getAvailableQuantityLocalStorage(userId,productId) {
  // AvailableQuantity must be real product quantity - the product quantity if user added it before to his cart
  try {
    // Fetch quantity in stock from products collection
    const productDoc = await getDoc(doc(db, 'products', productId));
    const quantityInStock = productDoc.data().quantityInStock;

    // Fetch user's cart from LocalStorage
    const productsInCart = JSON.parse(localStorage.getItem('userCart'));

    let availableQuantity = quantityInStock; // Initialize availableQuantity to quantityInStock    
            if (productsInCart) {
              console.log("entered")
                // Find the product in the cart
                const productInCart = productsInCart.products.find(product => product.productId === productId);
                if (productInCart) {
                    // Reduce quantity from availableQuantity
                    const quantityInCart = productInCart.quantity;
                    availableQuantity -= quantityInCart;
                };
              }

    // Ensure availableQuantity is not negative
    availableQuantity = Math.max(availableQuantity, 0);

    return availableQuantity;
} catch (error) {
    console.error('Error fetching available quantity:', error);
    return 0; // Return 0 as available quantity in case of error
}
}
export{getAvailableQuantityLocalStorage};

async function getCartProductsDb(userId){
  const cartProducts = [];
  let cartTotal = 0;
  let cartProductsQuantity = 0; // Initialize cartProductsQuantity
  
  // Query the cart collection for documents with the provided userId
  const cartQuerySnapshot = await getDocs(query(collection(db, 'cart'), where('userId', '==', userId)));
  
  // Iterate through each document in the cart collection
  for (const cartDoc of cartQuerySnapshot.docs) {
      // Get the products array from the cart document
      const productsArray = cartDoc.data().products;
  
      // Iterate through each product object in the products array
      for (const product of productsArray) {
          // Get the productId and quantity from the product object
          const { productId, quantity } = product;
  
          // Retrieve the product document from the products collection using productId
          const productDocRef = doc(db, 'products', productId);
          const productDocSnapshot = await getDoc(productDocRef);
  
          // Check if the product document exists
          if (productDocSnapshot.exists()) {
              // Get the product data
              const productData = productDocSnapshot.data();
              
              // Calculate subTotal for the product
              const subTotal = quantity * productData.price;
  
              // Append the product data along with quantity and subTotal to cartProducts array
              cartProducts.push({
                  productId,
                  quantity,
                  subTotal, // Adding subTotal here
                  ...productData
              });
  
              // Add subTotal to cartTotal
              cartTotal += subTotal;
  
              // Increment cartProductsQuantity
              cartProductsQuantity += quantity;
          } else {
              console.log(`Product with ID ${productId} not found.`);
              // Handle the case where the product is not found (optional)
          }
      }
  }
  
  // Apply the patch to cartProducts
  for (const product of cartProducts) {
      if (product.quantity > product.quantityInStock) {
          product.quantity = product.quantityInStock;
      }
  }
  
  // Return an object containing cartProducts array, cartTotal, and cartProductsQuantity
  const cartProductsObj = {
      cartProducts,
      cartTotal,
      cartProductsQuantity // Include cartProductsQuantity in the returned object
  };
  // update cart in fireStore or localStorage , this will help if quantites or prices changed in products so cart stored updated
  updateCartInStores(cartProducts,cartProductsObj,userId,true)

  console.log(cartProductsObj); // Logging the object containing cartProducts array, cartTotal, and cartProductsQuantity
  return cartProductsObj;
  
}
export{getCartProductsDb};

async function addShippingDataToCart(userId, nameValue, mobileValue, streetAddressValue, buildingValue, cityValue, districtValue, GovernorateValue) {
  console.log("id dindt pressesd")
  try {
    // Construct a query to find the cart document based on the userId
    const cartsRef = collection(db, 'cart');
    const querySnapshot = await getDocs(query(cartsRef, where('userId', '==', userId)));

    if (!querySnapshot.empty) {
      // Get the first cart document that matches the userId
      const cartDoc = querySnapshot.docs[0];

      // Update the cart document with the new shipping data
      await updateDoc(cartDoc.ref, {
        name: nameValue,
        mobile: mobileValue,
        streetAddress: streetAddressValue,
        building: buildingValue,
        city: cityValue,
        district: districtValue,
        Governorate: GovernorateValue
        // Add other shipping data fields as needed
      });

      return { success: true, message: 'Shipping data added to cart successfully.' };
    } else {
      // No cart document found for the user
      return { success: false, message: 'Cart not found for the user.' };
    }
  } catch (error) {
    console.error('Error adding shipping data to cart:', error);
    return { success: false, message: 'An error occurred while adding shipping data to cart.' };
  }
}
export { addShippingDataToCart };

async function getCartProductsLocalStorage(userId){
  const cartProducts = [];
  let cartTotal = 0;
  let cartProductsQuantity = 0; // Initialize cartProductsQuantity
  

      // Get the products array from the cart document
      const productsArray =   JSON.parse(localStorage.getItem('userCart')).products;

  
      // Iterate through each product object in the products array
      for (const product of productsArray) {
          // Get the productId and quantity from the product object
          const { productId, quantity } = product;
  
          // Retrieve the product document from the products collection using productId
          const productDocRef = doc(db, 'products', productId);
          const productDocSnapshot = await getDoc(productDocRef);
  
          // Check if the product document exists
          if (productDocSnapshot.exists()) {
              // Get the product data
              const productData = productDocSnapshot.data();
              
              // Calculate subTotal for the product
              const subTotal = quantity * productData.price;
  
              // Append the product data along with quantity and subTotal to cartProducts array
              cartProducts.push({
                  productId,
                  quantity,
                  subTotal, // Adding subTotal here
                  ...productData
              });
  
              // Add subTotal to cartTotal
              cartTotal += subTotal;
  
              // Increment cartProductsQuantity
              cartProductsQuantity += quantity;
          } else {
              console.log(`Product with ID ${productId} not found.`);
              // Handle the case where the product is not found (optional)
          }
      
  }
  
  // Apply the patch to cartProducts
  for (const product of cartProducts) {
      if (product.quantity > product.quantityInStock) {
          product.quantity = product.quantityInStock;
      }
  }
  
  // Return an object containing cartProducts array, cartTotal, and cartProductsQuantity
  const cartProductsObj = {
      cartProducts,
      cartTotal,
      cartProductsQuantity // Include cartProductsQuantity in the returned object
  };
  // update cart in fireStore or localStorage , this will help if quantites or prices changed in products so cart stored updated
  updateCartInStores(cartProducts,cartProductsObj,userId,false)

  console.log(cartProductsObj); // Logging the object containing cartProducts array, cartTotal, and cartProductsQuantity
  return cartProductsObj;
  
}
export{getCartProductsLocalStorage};

function updateCartInStores(cartPrds,cartProductsObj,userID,userLoggedIn){
  console.log(cartPrds,cartProductsObj)
  const updatedCartProducts = cartProductsObj.cartProducts.map(product => {
    for(const i of cartPrds){
    if (product.productId === i.productId) {
      let updatedQuantity = i.quantity ; // Increase quantity by one
      let subTotal = updatedQuantity * product.price;
      return { ...product, quantity: updatedQuantity, subTotal };
    } }
  });
  console.log(updatedCartProducts)
  const updatedCartTotal = updatedCartProducts.reduce((total, product) => total + product.subTotal, 0);
  const updatedCartProductsQuantity = updatedCartProducts.reduce((total, product) => total + product.quantity, 0);

  // update in db
  if(userLoggedIn){
    updateCartInFirestore(userID, updatedCartProducts, updatedCartTotal)
  }else{
    updateCartInLocalStorage(userID, updatedCartProducts, updatedCartTotal)
  }
  return {
    cartProducts: updatedCartProducts,
    cartProductsQuantity: updatedCartProductsQuantity,
    cartTotal: updatedCartTotal
  };
}
export{updateCartInStores};


function removeItem(productId,cartProductsObj,userID,userLoggedIn){
  const updatedCartProducts = cartProductsObj.cartProducts.map(product => {
    if (product.productId === productId) {
      let updatedQuantity = product.quantity - 1;
      let subTotal = updatedQuantity * product.price;
      return { ...product, quantity: updatedQuantity, subTotal };
    } else {
      return product;
    }
  });

  const updatedCartTotal = updatedCartProducts.reduce((total, product) => total + product.subTotal, 0);
  const updatedCartProductsQuantity = updatedCartProducts.reduce((total, product) => total + product.quantity, 0);
  // update in db or localStorage
  if(userLoggedIn){
    updateCartInFirestore(userID, updatedCartProducts, updatedCartTotal)
  }else{
    updateCartInLocalStorage(userID, updatedCartProducts, updatedCartTotal)
  }
  
  return {
    cartProducts: updatedCartProducts,
    cartProductsQuantity: updatedCartProductsQuantity,
    cartTotal: updatedCartTotal
  };
}
export{removeItem};

function increaseItem(productId,cartProductsObj,userID,userLoggedIn){
  const updatedCartProducts = cartProductsObj.cartProducts.map(product => {
    if (product.productId === productId) {
      let updatedQuantity = product.quantity + 1; // Increase quantity by one
      let subTotal = updatedQuantity * product.price;
      return { ...product, quantity: updatedQuantity, subTotal };
    } else {
      return product;
    }
  });

  const updatedCartTotal = updatedCartProducts.reduce((total, product) => total + product.subTotal, 0);
  const updatedCartProductsQuantity = updatedCartProducts.reduce((total, product) => total + product.quantity, 0);

  // update in db
  if(userLoggedIn){
    updateCartInFirestore(userID, updatedCartProducts, updatedCartTotal)
  }else{
    updateCartInLocalStorage(userID, updatedCartProducts, updatedCartTotal)
  }
  return {
    cartProducts: updatedCartProducts,
    cartProductsQuantity: updatedCartProductsQuantity,
    cartTotal: updatedCartTotal
  };
}
export{increaseItem};

function deleteItem(productId,cartProductsObj,userID,userLoggedIn){
  const updatedCartProducts = cartProductsObj.cartProducts.filter(product => product.productId !== productId);

  const updatedCartTotal = updatedCartProducts.reduce((total, product) => total + product.subTotal, 0);
  const updatedCartProductsQuantity = updatedCartProducts.reduce((total, product) => total + product.quantity, 0);
  // update in db
  if(userLoggedIn){
    updateCartInFirestore(userID, updatedCartProducts, updatedCartTotal)
  }else{
    updateCartInLocalStorage(userID, updatedCartProducts, updatedCartTotal)
  }
  return {
    cartProducts: updatedCartProducts,
    cartProductsQuantity: updatedCartProductsQuantity,
    cartTotal: updatedCartTotal
  };
}
export{deleteItem};

async function updateCartInFirestore(userID, cartProducts, cartTotal) {
  console.log("???")
  try {
    // Assuming 'carts' is the collection in Firestore where cart data is stored
    const querySnapshot = await getDocs(query(collection(db, "cart"), where("userId", "==", userID)));
    
    if (!querySnapshot.empty) {
      // Assuming there's only one cart document per user, so we use the first document found
      const cartDocRef = querySnapshot.docs[0].ref;

      const cartProductsDbStructure = cartProducts.map(obj => {
        // Destructure the object and create a new object without the specified keys
        const { productId, quantity } = obj;
        return { productId, quantity };
      });

      // Update the cart document in Firestore
      await updateDoc(cartDocRef, {
        products: cartProductsDbStructure,
        totalPrice: cartTotal
      });

      console.log("Cart updated successfully!");
    } else {
      console.error("Cart not found for userID:", userID);
    }
  } catch (error) {
    console.error("Error updating cart:", error);
  }
  
  }

async function updateCartInLocalStorage(userID, cartProducts, cartTotal) {
    try {
        const cartProductsDbStructure = cartProducts.map(obj => {
          // Destructure the object and create a new object without the specified keys
          const { productId, quantity } = obj;
          return { productId, quantity };
        });
  
        // Update the cart document in local storage
        localStorage.setItem('userCart', JSON.stringify({
          products: cartProductsDbStructure,
          totalPrice: cartTotal
        }));
  
        console.log("Cart updated successfully!");
      
    } catch (error) {
      console.error("Error updating cart:", error);
    }
    
    }

// Function to get cart products for payment
async function getCartProductsForPayment(userId) {
  const productsArray=await getCartProductsDb(userId)
  //const transformedArray = [];
    
    // productsArray.cartProducts.forEach(product => {
    //     // Check if the product already exists in the transformed array
    //     const existingProductIndex = transformedArray.findIndex(item => item.id === product.productId);
        
    //     if (existingProductIndex !== -1) {
    //         // If the product already exists, update its quantity
    //         transformedArray[existingProductIndex].quantity += product.quantity;
    //     } else {
    //         // If the product does not exist, add it to the transformed array
    //         transformedArray.push({
    //             id: product.productId,
    //             name: product.en.title,
    //             price: product.price,
    //             quantity: product.quantity
    //         });
    //     }
    // });
    
    //return transformedArray;
    return productsArray.cartTotal;
}
export { getCartProductsForPayment };

async function createOrderObject(userId) {
  try {
      const cart = await getCartProductsForOnlyOrders(userId);
      console.log(cart,"cart")
      
      if (!cart) {
          console.error(`Cart for user with ID ${userId} not found.`);
          return null;
      }

      const { cartTotal, cartProducts } = cart;
      const amount = cartTotal;
      const created = new Date();
      const state = "Processing";

      // Create basket array without 'quantityInStock'
      const basket = cartProducts.map(product => {
          const { quantityInStock, ...rest } = product;
          return rest;
      });
      console.log(basket,"basket")
      const orderObject = {
          userId,
          amount,
          created,
          state,
          basket,
          Governorate:cart.Governorate,
          building:cart.building,
          city:cart.city,
          district:cart.district,
          mobile:cart.mobile,
          name:cart.name,
          streetAddress:cart.streetAddress
      };
      console.log(orderObject,"orderObject")
      return orderObject;
  } catch (error) {
      console.error("Error creating order object:", error);
      return null;
  }
}

async function pushOrder(userId) {// from 8
  try {
      const orderObject = await createOrderObject(userId);
      console.log("Order Object:", orderObject);
      if (orderObject) {
          await pushOrderToFirestore(orderObject);
          console.log("Order successfully pushed to Firestore!");
          // reduce products quantities quantityInStock in add it to sold 
          updateStockAndSold(orderObject)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error("Error:", error);
            });
      } else {
          console.error("Failed to create order object.");
      }
  } catch (error) {
      console.error("Error:", error);
  }
}
export{pushOrder}

async function updateStockAndSold(orderObject) {// from 8
  const basket = orderObject.basket;

  try {
      // Iterate over each product in the basket
      for (const product of basket) {
          const productId = product.productId;
          const quantity = product.quantity;

          // Retrieve the product document from Firestore
          const productRef = doc(collection(db, 'products'), productId);
          const productDoc = await getDoc(productRef);

          if (!productDoc.exists()) {
              throw new Error(`Product with ID ${productId} not found`);
          }

          const productData = productDoc.data();
          const currentStock = productData.quantityInStock;
          const currentSold = productData.sold;

          // Update quantityInStock and sold fields
          const newStock = currentStock - quantity;
          const newSold = currentSold + quantity;

          // Update the product document in Firestore
          await updateDoc(productRef, {
            quantityInStock: newStock,
            sold: newSold
        });

          console.log(`Updated stock for product ${productId}. New stock: ${newStock}, Sold: ${newSold}`);
      }

      return "Stock and sold quantities updated successfully";
  } catch (error) {
      console.error("Error updating stock and sold quantities:", error);
      throw error;
  }
}
export{updateStockAndSold}


async function getCartProductsForOnlyOrders(userId){
  const cartProducts = [];
  let cartTotal = 0;
  let cartProductsQuantity = 0; // Initialize cartProductsQuantity
  
  // Query the cart collection for documents with the provided userId
  const cartQuerySnapshot = await getDocs(query(collection(db, 'cart'), where('userId', '==', userId)));
  
  // Iterate through each document in the cart collection
  for (const cartDoc of cartQuerySnapshot.docs) {
      // Get the products array from the cart document
      const productsArray = cartDoc.data().products;
  
      // Iterate through each product object in the products array
      for (const product of productsArray) {
          // Get the productId and quantity from the product object
          const { productId, quantity } = product;
  
          // Retrieve the product document from the products collection using productId
          const productDocRef = doc(db, 'products', productId);
          const productDocSnapshot = await getDoc(productDocRef);
  
          // Check if the product document exists
          if (productDocSnapshot.exists()) {
              // Get the product data
              const productData = productDocSnapshot.data();
              
              // Calculate subTotal for the product
              const subTotal = quantity * productData.price;
  
              // Append the product data along with quantity and subTotal to cartProducts array
              cartProducts.push({
                  productId,
                  quantity,
                  subTotal, // Adding subTotal here
                  ...productData
              });
  
              // Add subTotal to cartTotal
              cartTotal += subTotal;
  
              // Increment cartProductsQuantity
              cartProductsQuantity += quantity;
          } else {
              console.log(`Product with ID ${productId} not found.`);
              // Handle the case where the product is not found (optional)
          }
      }
  }
  
  // Apply the patch to cartProducts
  for (const product of cartProducts) {
      if (product.quantity > product.quantityInStock) {
          product.quantity = product.quantityInStock;
      }
  }
  
  // Return an object containing cartProducts array, cartTotal, and cartProductsQuantity
  const cartProductsObj = {
      cartProducts,
      cartTotal,
      cartProductsQuantity, // Include cartProductsQuantity in the returned object
      Governorate:cartQuerySnapshot.docs[0].data().Governorate,
      building:cartQuerySnapshot.docs[0].data().building,
      city:cartQuerySnapshot.docs[0].data().city,
      district:cartQuerySnapshot.docs[0].data().district,
      mobile:cartQuerySnapshot.docs[0].data().mobile,
      name:cartQuerySnapshot.docs[0].data().name,
      streetAddress:cartQuerySnapshot.docs[0].data().streetAddress
  };

  return cartProductsObj;
  
}

async function pushOrderToFirestore(orderObject) {
  try {
      const ordersCollection = collection(db, "orders");
      await addDoc(ordersCollection, orderObject);
      console.log("Order added to Firestore successfully!");
      // send order data to user email
      sendOrderDataToUserEmail(localStorage.getItem('userEmail'),emailBody(orderObject))
      return true; // Return true to indicate success
  } catch (error) {
      console.error("Error pushing order to Firestore:", error);
      return false; // Return false to indicate failure
  }
}

function emailBody(orderObject){
  let body = "Order details: ";

  // Loop through each product in the basket
  orderObject.basket.forEach((product, index) => {
    // Append product details to the body
    body += `${product.quantity} of ${product.en.title} ${product.price}$`;

    // Add a separator if it's not the last product
    if (index !== orderObject.basket.length - 1) {
      body += " - ";
    }
  });

  // Add order total to the body
  body += `. Order total is ${orderObject.amount}`;
  console.log(body)
  return body;
}

async function deleteUserCart(userId) {
  try {
    // Query the 'carts' collection to find the document with the matching userId
    const cartsQuery = query(collection(db, 'cart'), where('userId', '==', userId));
    const cartsSnapshot = await getDocs(cartsQuery);

    // Iterate over the query results (there should be only one match)
    cartsSnapshot.forEach(async (cartDoc) => {
        // Delete the document
        await deleteDoc(doc(db, 'cart', cartDoc.id));
        console.log('Cart document deleted successfully.');
    });
} catch (error) {
    console.error('Error deleting cart document:', error);
}
}
export{deleteUserCart}

async function pushLocalStorageCartForDb(userCart, userId) {
  // Include userId inside userCart
  if (typeof userCart === 'string') {
    userCart = JSON.parse(userCart);
  }
  userCart.userId = userId;
  // // Query the "cart" collection to find a document where userId matches
  const q = await query(collection(db, 'cart'), where('userId', '==', userId));

  const querySnapshot = await getDocs(q);

  // // Delete the document if it exists
  querySnapshot.forEach(doc => {
    console.log(doc,querySnapshot)
    deleteDoc(doc.ref);
  });
  // // then push new one
  console.log(userCart,"userCart100")
  await addDoc(collection(db, 'cart'), { userId: userId, ...userCart });
  
}

export { pushLocalStorageCartForDb };

// from 8 
async function getTopSellerProducts() {
  try {
    // Query Firestore to get the top 15 sold products
    const q = query(collection(db, 'products'), orderBy('sold', 'desc'), limit(15));
    const querySnapshot = await getDocs(q);

    // Extract the data from the query snapshot and return it
    const topSellerProducts = [];
    querySnapshot.forEach((doc) => {
      const productData = doc.data();
      // Use the Firestore document ID as the product ID
      const productId = doc.id;
      topSellerProducts.push({ ...productData, productId });
    });

    return topSellerProducts;
  } catch (error) {
    console.error("Error fetching top seller products: ", error);
    throw error;
  }
}

export { getTopSellerProducts };
// from 8 

// from 8 
async function getTopSellerOfSpecificProductCategory(catId) {
  try {
    // Fetch all products within the specified category
    const q = query(
      collection(db, 'products'),
      where('category._id', '==', catId)
    );
    const querySnapshot = await getDocs(q);

    // Extract the data from the query snapshot
    const allProductsInCategory = querySnapshot.docs.map(doc => ({
      productId: doc.id,
      ...doc.data()
    }));

    // Sort products by 'sold' property in descending order
    allProductsInCategory.sort((a, b) => b.sold - a.sold);

    // Return the top 4 sold products
    return allProductsInCategory.slice(0, 4);
  } catch (error) {
    console.error("Error fetching category top seller products: ", error);
    throw error;
  }
}

export { getTopSellerOfSpecificProductCategory };
// from 8 

// from 8 return cart quantitiy
async function getCartTotalQuantityDb(userId) {
  try {
      // Query the "cart" collection for the user's cart
      const cartQuery = query(collection(db, 'cart'), where('userId', '==', userId));
      const cartSnapshot = await getDocs(cartQuery);

      let totalQuantity = 0;

      // Iterate over each cart document
      cartSnapshot.forEach(cartDoc => {
          // Get the products array from the cart document
          const products = cartDoc.data().products;

          // Iterate over each product in the cart and sum their quantities
          products.forEach(product => {
              totalQuantity += product.quantity;
          });
      });
      console.log(totalQuantity,"totalQuantity")
      return totalQuantity;
  } catch (error) {
      console.error("Error getting cart total quantity:", error);
      throw error;
  }
}
export{getCartTotalQuantityDb}

function getCartTotalQuantityLocalStorage() {
  try {
    let totalQuantity = 0;
      // Retrieve cart data from local storage
      const cartData = JSON.parse(localStorage.getItem('userCart'));
      if (!cartData) {
          console.log('Cart data not found in local storage');
      }else{

      

      // Iterate over each product in the cart and sum their quantities
      cartData.products.forEach(product => {
          totalQuantity += product.quantity;
      });}

      return totalQuantity;
  } catch (error) {
      console.error("Error getting cart total quantity:", error);
      throw error;
  }
}
export { getCartTotalQuantityLocalStorage };

function getCartTotalQuantityDb2(cartProductsObj) {// from 8
  
  console.log(cartProductsObj,"getCartTotalQuantityDb2")
  let totalQuantity=0
      // Iterate over each cart document
      cartProductsObj.cartProducts.forEach(product => {

              totalQuantity += product.quantity;
          });
      console.log(totalQuantity,"totalQuantity")
      return totalQuantity;
  
}
export{getCartTotalQuantityDb2}