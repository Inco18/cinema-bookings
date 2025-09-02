<?php

namespace App\Services;

use App\Models\Booking;
use Paynow\Client;
use Paynow\Environment;
use Paynow\Service\Payment;

class PaynowService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client(config('paynow.api_key'), config('paynow.signature_key'), Environment::SANDBOX);
    }

    public function makePayment(Booking $booking, $token)
    {
        $orderReference = $booking->id;
        $idempotencyKey = uniqid($orderReference.'_');

        $paymentData = [
            'amount' => $booking->discounted_price ? $booking->discounted_price * 100 : $booking->price * 100,
            'currency' => 'PLN',
            'externalId' => $orderReference,
            'description' => "Rezerwacja $booking->id",
            'buyer' => [
                'email' => $booking->email,
                'firstName' => $booking->first_name,
                'lastName' => $booking->last_name,
            ],
            'continueUrl' => route('main.bookings.handle_payment_response', [
                'booking' => $booking, 'token' => urlencode($token),
            ]),
        ];

        $payment = new Payment($this->client);
        $result = $payment->authorize($paymentData, $idempotencyKey);
        $booking->update(['payment_id' => $result->getPaymentId()]);

        return $result->getRedirectUrl();
    }

    public function getStatus($paymentId)
    {
        $idempotencyKey = uniqid($paymentId.'_');
        $payment = new Payment($this->client);

        return $payment->status($paymentId, $idempotencyKey);
    }
}
