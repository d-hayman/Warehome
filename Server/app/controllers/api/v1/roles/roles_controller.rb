module Api
    module V1
      class Roles::RolesController < AuthenticatedController
        before_action -> {check_permissions( :Role, params[:action] )}
        before_action :set_role, only: %i[show update destroy]

        def index
          @roles = Role.all
    
          total_roles_count = Role.count
    
          render json: {
            roles: @roles,
            total_count: total_roles_count
          }
        end

        def show
            render json: include_permissions_and_users(@role)
        end

        def create
          @role = Role.new(role_params)
          
          if @role.save
              render json: @role
          else
              render json: @role.errors, status: :unprocessable_entity
          end
        end
          
        def update
          if @role.update(role_params)
            render json: @role
          else
            render json: @role.errors, status: :unprocessable_entity
          end
        end
          
        def destroy
          @role.destroy
        end

        private
        def include_permissions_and_users(role)
            role.as_json.merge(permissions: role.permissions, users: role.users)
        end

        def set_role
          @role = Role.find(params[:id])
        end

        def role_params
          params.require(:role).permit(:name, :user_ids => [], :permission_ids => [])
        end

      end
    end
end