import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [bookings, setBookings] = useState<Array<Schema["Booking"]["type"]>>([]);
  const { signOut } = useAuthenticator();
  useEffect(() => {
    client.models.Booking.observeQuery().subscribe({
      next: (data) => setBookings([...data.items]),
    });
  }, []);

  function createBooking() {
    client.models.Booking.create({ content: window.prompt("Enter Date to book for ") });
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
      
      <br/>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
