import moment from 'moment'

function readableTimestamp(order){
  // Assuming `order.data.created` is a Timestamp object
  const seconds = order.data.created.seconds;
  const nanoseconds = order.data.created.nanoseconds;

  // Combine seconds and nanoseconds to get a Unix timestamp
  const unixTimestamp = seconds + nanoseconds / 1e9; // Convert nanoseconds to seconds
  const formattedDate = moment.unix(unixTimestamp).format("MMMM Do YYYY, h:mma");
  return formattedDate;
}

export {readableTimestamp}

