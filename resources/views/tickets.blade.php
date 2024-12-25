<html lang="en">

<head>
    <title>Invoice</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="p-5">

    @foreach ($booking->seats as $seat)
        <div class="test">
            <img src="{{ asset('/ticket.svg') }}" class="h-14" />
            <img src="data:image/png;base64, {{ DNS1D::getBarcodePNG($booking->id, 'C39+', 5, 50, [0, 0, 0], true) }}"
                alt="barcode" />
        </div>
    @endforeach

</body>

</html>
