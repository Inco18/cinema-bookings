<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Spatie\LaravelPdf\Facades\Pdf;

class BookingConfirmation extends Mailable {
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Booking $booking
    ) {
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope {
        return new Envelope(
            subject: 'Potwierdzenie rezerwacji',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content {

        return new Content(
            view: 'mail.booking-confirmation',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array {
        return [
            Attachment::fromData(fn() => base64_decode(Pdf::view("tickets", ['booking' => $this->booking->load(['seats', 'showing', 'showing.movie', 'showing.hall'])])->margins(5, 5, 5, 5)->base64()), "bilety-{$this->booking->id}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
