// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

Stripe.setPublishableKey(); // Set publishable key TEST

var $form = $('#checkout-form'); // Retrieve the form

$form.submit(function (event) {
    $('#charge-error').addClass('hidden'); // clear any previous errors
    $form.find('button').prop('disabled', true); // Prevent user from submitting form multiple times during validation

    Stripe.card.createToken ({
        number: $('#card-number').val(), // Card number
        cvc: $('#cvc').val(), // Card CVC code
        exp_month: $('#exp-month').val(), // Card expiry month
        exp_year: $('#exp-year').val(), // Card expiry year
        name: $('#card-owner').val() // Card holder's name
    }, stripeResponseHandler);
    return false; // Stop here
}); // Ensure that it gets executed

// Show errors if any occur with payment, else append token to form before sending
function stripeResponseHandler(status, response){
    if (response.error){ // If error
        $('#charge-error').text(response.error.message); // Show the errors
        $('#charge-error').removeClass('hidden'); // unhide
        $form.find('button').prop('disabled', false); // Reenable submission privilege
    } else { // If token was created
        var token = response.id; // Get the token ID
        $form.append($('<input type="hidden" name="stripeToken" />').val(token)); // Add it to the form
        $form.get(0).submit(); // Submit
    }
}
