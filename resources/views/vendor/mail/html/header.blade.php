@props(['url'])
<div style="width: 100%; background-color: #f6f6f6; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
    <div style="flex: 1;">
        <a href="{{ url('/') }}" style="display: inline-block;">
            <img src="{{ asset('images/logo.png') }}" alt="Eki Logo" style="height: 50px;">
        </a>
    </div>
    <div style="flex: 1; display:flex; align-items:center; justify-content: space-between; text-align: right;">
        <a href="https://twitter.com" style="margin: 0 5px;">
            <img src="{{ asset('images/SocialIconTwitter.png') }}" alt="Twitter" style="height: 24px;">
        </a>
        <a href="https://facebook.com" style="margin: 0 5px;">
            <img src="{{ asset('images/SocialIconFB.png') }}" alt="Facebook" style="height: 24px;">
        </a>
        <a href="https://instagram.com" style="margin: 0 5px;">
            <img src="{{ asset('images/SocialIconIG.png') }}" alt="Instagram" style="height: 24px;">
        </a>
    </div>
</div>

