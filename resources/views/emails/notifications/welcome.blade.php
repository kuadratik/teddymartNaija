@component('mail::message')
# Welcome to Eki!

Hi {{ $notifiable->first_name }},

We're thrilled to have you join **EKI** and can't wait to showcase your products and services to customers. You are already on your way to creating stunning visual products that will captivate them.

Whether you're here to promote your brand, support a cause, or simply share your creations — welcome! We are here to guide your product presentation and uploads every step of the way.

Thanks,<br>
The TeddyMart Team

@component('mail::button', ['url' => url('/')])
Let's Get Started
@endcomponent



TeddyMart at the touch of a button! Download our app for Google & Mac.

<table>
  <tr>
    <td>
      <a href="https://play.google.com/store">
        <img src="{{ $message->embed(public_path('images/google-play-badge.png')) }}" alt="Get it on Google Play"
          style="width:150px;">
      </a>
    </td>
    <td>
      <a href="https://www.apple.com/app-store/">
        <img src="{{ $message->embed(public_path('images/app-store-badge.png')) }}" alt="Download on the App Store"
          style="width:150px;">
      </a>
    </td>
  </tr>
</table>

@component('mail::subcopy')
Questions or FAQ? Contact us at [inquiries@eki.market](mailto:inquiries@eki.market). If you'd rather not receive this kind of email, [Unsubscribe](#).
@endcomponent

@endcomponent
