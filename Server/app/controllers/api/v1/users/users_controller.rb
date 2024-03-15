module Api
    module V1
      class Users::UsersController < AuthenticatedController
        before_action -> {check_permissions( :User, params[:action], ['show'], params[:id])}
        before_action :set_user, only: %i[show update destroy]

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

        def create
          #instantiate potential new user
          @user = User.new(user_create_params)

          if @user.save
            render json: include_permissions(@user)
          else
            render json: @user.errors, status: :unprocessable_entity
          end
        end

        def update
          if @user.update(user_create_params)
            render json: include_permissions(@user)
          else
            render json: @user.errors, status: :unprocessable_entity
          end
        end

        def destroy
          @user.destroy
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

        def user_create_params
          params.require(:user).permit(:username, :password, :password_confirmation)
        end

      end
    end
end