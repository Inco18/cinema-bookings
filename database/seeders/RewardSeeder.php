<?php

namespace Database\Seeders;

use App\Enums\RewardType;
use App\Enums\RewardValueType;
use App\Models\Reward;
use Illuminate\Database\Seeder;

class RewardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Reward::create([
            'name' => 'Darmowy popcorn',
            'cost_points' => 100,
            'type' => RewardType::FREE_ITEM->value,
            'image' => 'popcorn.png',
            'value' => 1,
            'value_type' => RewardValueType::ITEM->value,
            'details' => 'Darmowy mały popcorn do odebrania w kasie.',
        ]);
        Reward::create([
            'name' => 'Darmowy popcorn',
            'cost_points' => 170,
            'type' => RewardType::FREE_ITEM->value,
            'image' => 'popcorn.png',
            'value' => 1,
            'value_type' => RewardValueType::ITEM->value,
            'details' => 'Darmowy średni popcorn do odebrania w kasie.',
        ]);
        Reward::create([
            'name' => 'Darmowy napój',
            'cost_points' => 90,
            'type' => RewardType::FREE_ITEM->value,
            'image' => 'drink.png',
            'value' => 1,
            'value_type' => RewardValueType::ITEM->value,
            'details' => 'Darmowy mały napój do odebrania w kasie.',
        ]);
        Reward::create([
            'name' => 'Darmowy napój',
            'cost_points' => 150,
            'type' => RewardType::FREE_ITEM->value,
            'image' => 'drink.png',
            'value' => 1,
            'value_type' => RewardValueType::ITEM->value,
            'details' => 'Darmowy średni napój do odebrania w kasie.',
        ]);
        Reward::create([
            'name' => 'Zniżka na rezerwację',
            'cost_points' => 150,
            'type' => RewardType::DISCOUNT->value,
            'value' => 10,
            'value_type' => RewardValueType::PERCENT->value,
            'details' => 'Zniżka 10% do wykorzystania przy rezerwacji online lub w kasie.',
        ]);
        Reward::create([
            'name' => 'Zniżka na rezerwację',
            'cost_points' => 280,
            'type' => RewardType::DISCOUNT->value,
            'value' => 20,
            'value_type' => RewardValueType::PERCENT->value,
            'details' => 'Zniżka 20% do wykorzystania przy rezerwacji online lub w kasie.',
        ]);
        Reward::create([
            'name' => 'Zniżka na rezerwację',
            'cost_points' => 550,
            'type' => RewardType::DISCOUNT->value,
            'value' => 30,
            'value_type' => RewardValueType::PERCENT->value,
            'details' => 'Zniżka 30% do wykorzystania przy rezerwacji online lub w kasie.',
        ]);
        Reward::create([
            'name' => 'Zniżka na rezerwację',
            'cost_points' => 100,
            'type' => RewardType::DISCOUNT->value,
            'value' => 5,
            'value_type' => RewardValueType::AMOUNT->value,
            'details' => 'Zniżka 5 zł do wykorzystania przy rezerwacji online lub w kasie.',
        ]);

    }
}
