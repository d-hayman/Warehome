Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root to: proc { [404, {}, ["Not found."]] }

  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  #API routes
  namespace :api do
    namespace :v1 do

      namespace :utils do
        get "has_users"
      end

      scope module: 'containers' do
        resources :containers, only: [:index, :show, :create, :update, :destroy] do
          match "items/:id", to: "containers#add_item", via: [:put]
          match "items/:id", to: "containers#remove_item", via: [:delete]
          post "items/:item_id/checkout", to: "checkouts#create"
          delete "items/:item_id/checkout/:id", to: "checkouts#destroy"
        end
      end

      scope module: 'items' do
        resources :items, only: [:index, :show, :create, :update, :destroy] do
          match "subcategories/:id", to: "items#add_subcategory", via: [:put]
          match "subcategories/:id", to: "items#remove_subcategory", via: [:delete]
        end
      end

      scope module: 'categories' do
        resources :categories, only: [:index, :show, :create, :update, :destroy] do 
          resources :subcategories, only: [:index, :show, :create, :update, :destroy]
        end
      end

      scope module: 'users' do
        resources :users, only: [:index, :show]
      end

      scope module: 'roles' do
        resources :roles, only: [:index, :show, :create, :update, :destroy]
        resources :permissions, only: [:index, :show]
      end
      
    end
  end
end
