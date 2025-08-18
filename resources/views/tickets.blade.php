<html lang="en">

<head>
    <title>{{ 'Bilety' }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>

    @foreach ($booking->seats as $seat)
        <div
            class="h-72 flex justify-between items-center border-b-2 border-dashed border-black break-inside-avoid-page">
            <div class="h-full w-full flex flex-col items-start justify-start -mr-18">
                <img src="{{ asset('/ticket.svg') }}" class="h-12" />
                <div class="flex flex-col w-full items-center">
                    <h1 class="text-2xl font-bold">{{ $booking->showing->movie->title }}
                        | {{ strtoupper($booking->showing['type']) }}</h1>
                    <p>{{ \Carbon\Carbon::parse($booking->showing->start_time)->format('d.m.Y | H:i') }} |
                        Sala <span class="font-semibold">{{ $booking->showing->hall->number }}</span></p>
                    <div class="flex items-center opacity-100 gap-2">
                        @if ($booking->showing['speech_lang'] === 'PL')
                            <p>FILM POLSKI</p>
                        @endif

                        @if (isset($booking->showing['subtitles_lang']))
                            @if ($booking->showing['speech_lang'] === 'PL')
                                /
                            @endif
                            <p>NAPISY: {{ $booking->showing['subtitles_lang'] }}</p>
                        @endif

                        @if (isset($booking->showing['dubbing_lang']))
                            @if ($booking->showing['speech_lang'] === 'PL' || isset($booking->showing['subtitles_lang']))
                                /
                            @endif
                            <p>DUBBING: {{ $booking->showing['dubbing_lang'] }}</p>
                        @endif
                    </div>
                    <p class="mt-5">Bilet: <span class="font-semibold">normalny</span></p>
                    <p>Cena: <span
                            class="font-semibold">{{ number_format($booking->price / $booking->num_people, 2, ',', ' ') }}
                            zł</span></p>
                    <p class="mt-5">rząd: <span class="font-semibold">{{ $seat->row }}</span> miejsce:
                        <span class="font-semibold">{{ $seat->number }}</span>
                    </p>
                    <p class="text-gray-400 text-sm mt-2">Rezerwacja {{ $booking->id }}</p>
                </div>
            </div>
            <img src="data:image/png;base64, {{ DNS1D::getBarcodePNG($booking->id, 'C39+', 2, 50, [0, 0, 0]) }}"
                alt="barcode" class="-rotate-90 translate-x-18" />
        </div>
    @endforeach

</body>

</html>
