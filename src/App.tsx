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
    client.models.Booking.create({ content: window.prompt("Booking content") });
  }

    
  function deleteBooking(id: string) {
    client.models.Booking.delete({ id })
  }

  return (
    <main>
      <h1>Meeting Room Bookings</h1>
      <button onClick={createBooking}>+ new</button>
      <ul>
        {bookings.map((booking) => (
          <li 
          onClick={() => deleteBooking(booking.id)}
          key={booking.id}>{booking.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new booking.
        <br />
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
