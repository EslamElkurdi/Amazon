import {db} from '../../firebase'
import {collection,orderBy,query,where,setDoc,doc,getDocs,addDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import emailjs from '@emailjs/browser';

async function getUserOrders(userId) {


  try {
    // Construct a reference to the "orders" subcollection for the user
    const ordersCollectionRef = query(collection(db, "orders"), where("userId", "==", userId));
    
    // Fetch the documents in the "orders" subcollection
    const ordersQuerySnapshot = await getDocs(ordersCollectionRef);
    
    // Extract the data from each order document
    const userOrders = ordersQuerySnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
    return userOrders.reverse();
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

}
export {getUserOrders}

function getUserProductsAgain(orders) {
  
    // New list to store all products
    const allProducts = [];

    // Loop through each order
    orders.forEach(order => {
        // Loop through each product in the basket of the order
        order.data.basket.forEach(product => {
            // Push the product into the new list
            allProducts.push(product);
        });
    });
    return allProducts;

}
export {getUserProductsAgain}

async function searchOrders(searchTerm,userId) {
  
  try {
    // Construct a reference to the "orders" subcollection for the user
    const ordersCollectionRef = query(collection(db, "orders"), where("userId", "==", userId));
    
    // Fetch the documents in the "orders" subcollection
    const ordersQuerySnapshot = await getDocs(ordersCollectionRef);
    
    // Extract the data from each order document
    const userOrders = ordersQuerySnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    const filteredOrders = userOrders.filter(order => {
      // Loop through each order's basket items and check if any of the fields contain the searchTerm
      const basketItems = order.data.basket || []; // In case basket is undefined/null
      const basketContainsSearchTerm = basketItems.some(item =>
        ['title', 'description'].some(field =>
          typeof item.en[field] === 'string' && item.en[field].toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        typeof item.price === 'number' && item.price.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      // Check if any of the fields in the order's data object contain the searchTerm
      const orderDataContainsSearchTerm = ['amount'].some(field =>
        typeof order.data[field] === 'number' && order.data[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      return basketContainsSearchTerm || orderDataContainsSearchTerm;
    });
      
    return filteredOrders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }


}
export {searchOrders}

function searchProductsAgain(orders,searchTerm) {
  
  // New list to store all products
  const allProducts = [];

  // Loop through each order
  orders.forEach(order => {
      // Loop through each product in the basket of the order
      order.data.basket.forEach(product => {
          // Push the product into the new list
          allProducts.push(product);
      });
  });

   // Convert searchTerm to lowercase for case-insensitive search
   const searchTermLower = searchTerm.toLowerCase();

   // Filter allProducts based on searchTerm
   const filteredProducts = allProducts.filter(product => {
     // Convert title, description, and price to lowercase for comparison
     const titleLower = product.en.title.toLowerCase();
     const descriptionLower = product.en.description.toLowerCase();
     const priceString = product.price.toString().toLowerCase();
 
     // Check if title, description, or price includes the searchTerm
     return (
       titleLower.includes(searchTermLower) ||
       descriptionLower.includes(searchTermLower) ||
       priceString.includes(searchTermLower)
     );
   });

  return filteredProducts;
}
export {searchProductsAgain}

function extractOrdersYears(allOrders) {
  const orderYears = [];
  allOrders.forEach(order => {
    const createdTimestamp = order.data.created;
    if (createdTimestamp) {
      // Create a Date object from the timestamp
      const createdDate = new Date(createdTimestamp.seconds * 1000); // Convert seconds to milliseconds
      // Extract the year from the Date object
      const year = createdDate.getFullYear();
      // Check if the year already exists in the array
      if (!orderYears.includes(year)) {
        // Add the year to the array
        orderYears.push(year);
      }
    }
  });
  return orderYears;
}
export { extractOrdersYears };


function filterOrdersBySelectedYear(selectedYear,allOrders){
  const ordersInYear = allOrders.filter(order => {
    if (order.data.created) {
      // Convert the 'created' timestamp to a Date object
      const createdDate = new Date(order.data.created.seconds * 1000); // Convert seconds to milliseconds
      // Extract the year from the Date object
      const orderYear = createdDate.getFullYear();
      // Check if the order was made in the specified year
      return orderYear === parseInt(selectedYear);
    }
    return false; // If 'created' is not available, exclude the order
  }).sort((a, b) => {
    // Convert the 'created' timestamps to Date objects
    const dateA = new Date(a.data.created.seconds * 1000);
    const dateB = new Date(b.data.created.seconds * 1000);
    // Sort in descending order based on 'created' timestamps
    return dateB - dateA;
  });
  return ordersInYear;
}
export {filterOrdersBySelectedYear}
// service id :service_mk194gi
// email template id: template_3s7fpzt
// public key: ixIuePvTWhAedcaHd

// SECRET KEY JIT f89210275f50de01ccba209927095b2d
// API KEY JIT edbbb38febe1a16712328a4332b35b09
// service id in mailjs service_hxv8ftf

// smtp password 6BE496238C3FDBA7FD2F2674445800A4EAF7
// smtp username bashawwn@gmail.com
// Server smtp.elasticemail.com
// Port 2525

function sendOrderDataToUserEmail(userEmail,orderData){
  console.log("entered send order data to email")
  emailjs.send('service_ral0ptt', 'template_7agy59h', {
    to_email: userEmail,
    message: orderData,
    from_email:"bashawwn@gmail.com"
  }, {
    publicKey: '0jqomuvwLgPIOnBQc',
  })
  .then(
    () => {
      console.log('SUCCESS!');
    },
    (error) => {
      console.log('FAILED...', error.text);
    },
  );
}

export {sendOrderDataToUserEmail}

const highlightText = (text, highlight) => {
  text=String(text)// convert numbers to strings
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      // <span key={index} style={{ backgroundColor: 'yellow' }}>
      //   {part}
      // </span>
      `<span key=${index} style="background-color: yellow;">${part}</span>`
    ) : (
      part
    )
  ).join('');
};

export {highlightText}