@props(['url'])
<table style="width: 100%;">
    <tr>
        <td style="text-align: left; padding: 20px;">
            <a href="{{ url('/') }}" style="display: inline-block;">
                <img src="{{ asset('images/logo.png') }}" alt="Eki Logo" style="height: 50px;">
            </a>
        </td>
        <td style="text-align: right; padding: 10px;">
            <a href="https://twitter.com" style="margin: 0 5px;">
                <img src="{{ asset('images/SocialIconTwitter.png') }}" alt="Twitter" style="height: 24px;">
            </a>
        </td>
        <td style="text-align: right; padding: 10px;">
            <a href="https://facebook.com" style="margin: 0 5px;">
                <img src="{{ asset('images/SocialIconFB.png') }}" alt="Facebook" style="height: 24px;">
            </a>
        </td>
        <td style="text-align: right; padding: 10px;">
            <a href="https://instagram.com" style="margin: 0 5px;">
                <img src="{{ asset('images/SocialIconIG.png') }}" alt="Instagram" style="height: 24px;">
            </a>
        </td>
    </tr>
</table>
