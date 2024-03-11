module Api
    module V1
      class Users::UsersController < AuthenticatedController
        before_action -> {check_permissions( :User, params[:action], ['show'], params[:id])}
        before_action :set_user, only: %i[show]

        def index
            users_per_page = params.has_key?(:per_page) ? params[:per_page] : 5
            @users = User.all
    
            total_users_count = User.count
    
            render json: {
              users: @users.page(params[:page]).per(users_per_page).map{ |user| include_permissions(user) },
              total_count: total_users_count,
              per_page: users_per_page
            }
        end

        def show
            render json: include_permissions(@user)
        end

        private
        def include_permissions(user)
            res = user.as_json
            res.delete("password")
            res.as_json.merge(permissions: user.permissions)
        end

        def set_user
            @user = User.find(params[:id])
        end

      end
    end
end