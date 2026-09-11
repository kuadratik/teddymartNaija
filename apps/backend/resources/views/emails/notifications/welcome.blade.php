@component('mail::message')
# Welcome to myEKI!

Hi {{ $notifiable->first_name }},

We're thrilled to have you join **myEKI** and can't wait to showcase your products and services to customers. You are already on your way to creating stunning visual products that will captivate them.

Whether you're here to promote your brand, support a cause, or simply share your creations — welcome! We are here to guide your product presentation and uploads every step of the way.

Thanks,<br>
The myEKI Team

@component('mail::button', ['url' => url(env('FRONT_URL'))])
Let's Get Started
@endcomponent



myEKI at the touch of a button! Download our app for Google & Mac.

<table>
  <tr>
    <td>
      <a href="https://play.google.com/store">
        <img src="{{ asset('images/google-play-badge.png') }}" alt="Get it on Google Play"
          style="width:150px;">
      </a>
    </td>
    <td>
      <a href="https://www.apple.com/app-store/">
        <img src="{{ asset('images/app-store-badge.png') }}" alt="Download on the App Store"
          style="width:150px;">
      </a>
    </td>
  </tr>
</table>

@component('mail::subcopy')
Questions or FAQ? Contact us at [{{config('services.inquiry.email')}}](mailto:{{config('services.inquiry.email')}}). If you'd rather not receive this kind of email, [Unsubscribe](#).
@endcomponent

@endcomponent
