export const renderTime = (timestamp) => {
    const dateObject = new Date(timestamp);

// Format the date and time components
const year = dateObject.getFullYear();
const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
const day = dateObject.getDate().toString().padStart(2, '0');
const hours = dateObject.getHours().toString().padStart(2, '0');
const minutes = dateObject.getMinutes().toString().padStart(2, '0');
const seconds = dateObject.getSeconds().toString().padStart(2, '0');

// Create a formatted date and time string
const formattedDateTime = `${hours}:${minutes} ${day} thg ${month}`;

return formattedDateTime
}
