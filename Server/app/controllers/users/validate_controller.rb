class Users::ValidateController < ApplicationController
    def validate
        unless authenticate_user!
            head :unauthorized
        end
    end
end