module Api
  module V1
    class UtilsController < ApiController

        def has_users
            render json: {hasUsers: User.count > 0}
        end
    end
  end
end