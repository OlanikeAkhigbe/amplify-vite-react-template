import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const options = ["Alpha (Ground floor)", "Beta (First floor)", "Delta (Second floor)", "Lamdba (Third floor)"];
  const [bookingOptions, setBookingOptions] = useState<string[]>(options);
  const [roomOption, setRoomOption] = useState<string>("")
  const [bookings, setBookings] = useState<Array<Schema["Booking"]["type"]>>([]);
  const { signOut } = useAuthenticator();
  useEffect(() => {
    client.models.Booking.observeQuery().subscribe({
      next: (data) => setBookings([...data.items]),
    });
  }, []);

  function handleChange(event) {
    setRoomOption(event.target.value);
  }

  function createBooking() {
    const windowValue = window.prompt("Enter Date to book for ");
    client.models.Booking.create({ content: roomOption + " is now booked. Date: " + windowValue });
  }

    
  function deleteBooking(id: string) {
    client.models.Booking.delete({ id })
  }

  return (
    <main>
      <h1>Meeting Room Bookings</h1>
      <button onClick={createBooking}>Add Booking</button>
      
      <ul>
        {bookings.map((booking) => (
          <li 
          onClick={() => deleteBooking(booking.id)}
          key={booking.id}>{booking.content}
          </li>
        ))}
      </ul>
      <div>
        <select onChange={(event) => handleChange(event)}>
          {bookingOptions.map((bookingOption, key) => (
            <option value={bookingOption} key={key}>{bookingOption}</option>
          ))}
        </select>
      </div>
      <br/>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
