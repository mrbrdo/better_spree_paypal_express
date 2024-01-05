module Spree
  class PaypalExpressCheckout < ActiveRecord::Base
    def self.json_api_columns
      column_names.reject { |c| c.in?(["id"]) }
    end

    def self.json_api_type
      to_s.demodulize.underscore
    end
  end
end