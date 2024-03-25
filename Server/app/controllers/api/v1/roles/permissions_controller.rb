module Api
    module V1
      class Roles::PermissionsController < AuthenticatedController
        before_action -> {check_permissions( :Permission, params[:action] )}
        before_action :set_permission, only: %i[show]

        def index
          @permissions = Permission.all.order(model: :asc)
    
          total_permissions_count = Permission.count
    
          render json: {
            permissions: @permissions,
            total_count: total_permissions_count
          }
        end

        def show
            render json: @permission
        end

        private

        def set_permission
            @permission = Permission.find(params[:id])
        end

      end
    end
end