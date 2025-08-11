# Be sure to restart your server when you modify this file.

# Configure importmap for the application.
# Read more: https://github.com/rails/importmap-rails
Rails.application.config.importmap.draw do
  # Use "pin" to link a JavaScript import to an npm package
  pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
  pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
  pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
  pin_all_from "app/javascript/controllers", under: "controllers"
end 