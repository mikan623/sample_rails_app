Rails.application.routes.draw do
  get "timeline/index"
  get "home/index"
  devise_for :users
  resources :posts do
    resource :like, only: [ :create, :destroy ]
  end

  # API routes
  namespace :api do
    resources :posts, only: [:index, :create, :destroy]
    resources :users, only: [:create]
    post 'sessions', to: 'sessions#create'
    get 'users/current', to: 'users#current'
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root to: "home#index"
  post "/create_post", to: "home#create_post", as: :create_post
  get "/timeline", to: "timeline#index"
end
