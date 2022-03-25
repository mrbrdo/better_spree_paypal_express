//= require spree/frontend

SpreePaypalExpress = {
  $button: null,
  $buttonParent: null,
  $newButtonParent: null,
  initialize: function($button) {
    this.$button = $button;
    this.$buttonParent = $button.parent();
    this.paymentMethodID = $button.data('payment-method-id');
    this.showLoadingOnClick();
    this.updateSaveAndContinueVisibility();
  },
  updateSaveAndContinueVisibility: function() {
    if (this.isButtonHidden()) {
      $(this).trigger('hideSaveAndContinue')
    } else {
      $(this).trigger('showSaveAndContinue')
    }
  },
  isButtonHidden: function () {
    paymentMethod = this.checkedPaymentMethod();
    return (!$('#use_existing_card_yes:checked').length && SpreePaypalExpress.paymentMethodID && paymentMethod.val() == SpreePaypalExpress.paymentMethodID);
  },
  checkedPaymentMethod: function() {
    return $('div[data-hook="checkout_payment_step"] input[type="radio"][name="order[payments_attributes][][payment_method_id]"]:checked');
  },
  hideSaveAndContinue: function() {
    $("#checkout_form_payment [data-hook=buttons]").hide();
    $("#checkout_form_payment").data('hidden-by-payment-method-id', SpreePaypalExpress.paymentMethodID);
    this.$newButtonParent = $("#checkout_form_payment [data-hook=buttons]").parent();
    this.$button.detach().appendTo(this.$newButtonParent);
    this.$buttonParent.parents('.payment-sources').hide();
  },
  showSaveAndContinue: function() {
    if (typeof ($("#checkout_form_payment").data('hidden-by-payment-method-id')) === 'undefined' || $("#checkout_form_payment").data('hidden-by-payment-method-id') == SpreePaypalExpress.paymentMethodID) {
      $("#checkout_form_payment [data-hook=buttons]").show();
      $("#checkout_form_payment").removeData('hidden-by-payment-method-id');
    }
    if (this.$newButtonParent) {
      this.$newButtonParent = null;
      this.$button.detach().appendTo(this.$buttonParent);
    }
  },
  showLoadingOnClick: function() {
    var $button = this.$button;
    var $buttonLink = $button.find('a');
    $buttonLink.click(function() {
      $buttonLink.hide();
      var $loading = $('<span>◯</span>');
      $loading.appendTo($button);
      setInterval(function() {
        if (($loading.text().match(/◯/g) || []).length >= 3)
          $loading.text('◯');
        else
          $loading.text($loading.text() + ' ◯');
      }, 500);
    });
  }
}

Spree.ready(function() {
  SpreePaypalExpress.initialize($('#paypal_button'));
  $('div[data-hook="checkout_payment_step"] input[type="radio"]').click(function (e) {
    SpreePaypalExpress.updateSaveAndContinueVisibility();
  });
})
