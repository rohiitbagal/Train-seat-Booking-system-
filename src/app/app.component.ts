import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  seats: number[][] = [
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1], // Last row with 3 seats
  ];

  seatsToBook: number = 0;
  bookingMessage: string = '';

  bookSeatsHandler() {
    if (this.seatsToBook < 1 || this.seatsToBook > 7) {
      this.bookingMessage =
        'You can only book between 1 and 7 seats at a time.';
      return;
    }

    const result = this.tryBookSeats(this.seatsToBook);
    this.bookingMessage = result.success
      ? `Seats booked: ${result.seats.join(', ')}`
      : 'Not enough seats available to complete the booking.';
  }

  tryBookSeats(requiredSeats: number): { success: boolean; seats: string[] } {
    const bookedSeats: string[] = [];

    // Iterate through rows to find available seats
    for (let row = 0; row < this.seats.length; row++) {
      const available = this.getAvailableSeatsInRow(row);

      // If enough seats are found in one row, book them immediately
      if (available.length >= requiredSeats) {
        this.updateSeats(row, available.slice(0, requiredSeats));
        bookedSeats.push(
          ...available
            .slice(0, requiredSeats)
            .map((seat) => `Row ${row + 1}, Seat ${seat + 1}`)
        );
        return { success: true, seats: bookedSeats };
      }
    }

    // Try to book across multiple rows if no single row can accommodate the request
    let remainingSeats = requiredSeats;
    for (let row = 0; row < this.seats.length && remainingSeats > 0; row++) {
      const available = this.getAvailableSeatsInRow(row);
      const seatsToBook = Math.min(available.length, remainingSeats);

      this.updateSeats(row, available.slice(0, seatsToBook));
      bookedSeats.push(
        ...available
          .slice(0, seatsToBook)
          .map((seat) => `Row ${row + 1}, Seat ${seat + 1}`)
      );

      remainingSeats -= seatsToBook;
    }

    return remainingSeats === 0
      ? { success: true, seats: bookedSeats }
      : { success: false, seats: [] };
  }

  getAvailableSeatsInRow(row: number): number[] {
    return this.seats[row]
      .map((seat, index) => (seat === 0 ? index : -1))
      .filter((i) => i !== -1);
  }

  updateSeats(row: number, seats: number[]) {
    seats.forEach((seat) => (this.seats[row][seat] = 1));
  }
}
