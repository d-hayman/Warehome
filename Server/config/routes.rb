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
      scope module: 'categories' do
        resources :categories, only: [:index, :show, :create, :update, :destroy] do 
          resources :subcategories, only: [:index, :show, :create, :update, :destroy]
        end
      end
    end
  end
end
