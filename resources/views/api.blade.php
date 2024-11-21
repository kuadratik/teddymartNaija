<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI" />
    <title>Teddyed</title>
    <link rel="stylesheet" href="{{ asset('dist/swagger-ui.css') }}" />
    <style>
        * {
            padding: 0px;
            margin: 0px;
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        html {
            font-family: sans-serif;
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: none !important;
        }

        .navbar {
            font-family: sans-serif;
            height: 50px;
            padding: 0.25rem 1rem;
            top: 0;
            background-color: #fff;
            border-bottom: 1px solid #e2e2e2;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #swagger-ui {
            padding: 0rem 0.5rem;
        }

        .form-control {
            padding: 0.75rem;
            width: 100px;
            background: #fff;
            border-radius: 0.5rem;
            border: 1px solid #e0e0e0;
        }

        swagger-ui .topbar .download-url-wrapper input[type=text] {
            width: 400px !important;
        }

        @media (max-width: 768px) {

            .swagger-ui input[type=email],
            .swagger-ui input[type=file],
            .swagger-ui input[type=password],
            .swagger-ui input[type=search],
            .swagger-ui input[type=text] {
                max-width: 400px !important;
            }
        }

        .code-body {
            padding-top: 10%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .passcode-card {
            border-radius: 0.5rem;
            border: 1px solid #999999;
            background: #d4d4d477;
            padding: 2rem 1rem;
            width: 100%;
            max-width: 400px;
            position: relative;
        }

        .form-ctr {
            padding: 1rem 0.75rem;
            width: 100%;
            background: #fff;
            border-radius: 0.35rem;
            border: 1px solid #e0e0e0;
            font-size: 1rem;
            text-align: center;
            outline: none
        }

        .form-ctr:focus {
            border: 1px solid #1f1f1f;
        }

        .form-ctr::placeholder {
            font-size: 1rem;
        }

        .box-title {
            text-align: center;
            margin-bottom: 1rem;
        }

        .danger-ctr {
            border: 1px solid rgb(253, 39, 39) !important;
        }
    </style>
</head>

<body>
    <div class="navbar">
        <div class="" style="display:flex">
            <input type="text" id="authInput" placeholder="bearer token" class="form-control" oninput="setKey()">
        </div>

        <h4 style="color:#525252">TeddyMart &copy;</h4>
    </div>

    <div id="swagger-ui"></div>

    @if ($checked)
        <script src="{{ asset('dist/swagger-ui-bundle.js') }}" defer></script>
        <script src="{{ asset('dist/swagger-ui-standalone-preset.js') }}" defer></script>
        <script>
            function setKey() {
                localStorage.setItem("teddyed-swaggerToken", event.currentTarget.value)
            }

            window.onload = () => {
                let path = "{{ asset('apis/page1.yaml') }}"

                authInput.value = localStorage.getItem("teddyed-swaggerToken");

                window.ui = SwaggerUIBundle({
                    url: path,
                    dom_id: '#swagger-ui',
                    requestInterceptor: function(req) {
                        var key = localStorage.getItem("teddyed-swaggerToken");

                        if (key && key.trim() !== "") {
                            req.headers.Authorization = 'Bearer ' + key;
                        }

                        return req;
                    },
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    layout: "StandaloneLayout",
                });
            };
        </script>
    @else
        <main class="code-body">
            <div class="passcode-card">
                <h4 class="box-title">Enter passcode to continue</h4>
                <form action="/passcode" method="post">
                    @csrf
                    <input type="text" name="passcode" placeholder="code"
                        class="form-ctr {{ session()->has('error') ? 'danger-ctr' : '' }}">
                </form>
            </div>
        </main>
    @endif

</body>

</html>
