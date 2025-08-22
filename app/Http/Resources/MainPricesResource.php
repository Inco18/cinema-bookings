<?php

namespace App\Http\Resources;

use App\Enums\TicketType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MainPricesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticketType' => TicketType::tryFrom($this->ticket_type)?->getLabel(),
            'basePrice' => $this->base_price,
            'minPrice' => $this->min_price,
            'maxPrice' => $this->max_price,
            'description' => $this->description,
        ];
    }
}
