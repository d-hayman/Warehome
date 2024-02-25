module Api
    module V1
      class AuthenticatedController < ApiController
        before_action :authenticate_user!
        #before_action :check_permissions
  
        private
  
        def check_permissions (model="", action="", allowSelf=[], id=0)
            #granular permission checks where applicable
            if model.length > 0 && action.length > 0
                #skip permission checks when a user is fetching their own data
                unless allowSelf.include?(action) && compare_id(id.to_i, model)
                    permission = Permission.find_by(model: model, action: action)
                    unless permission.user_ids.include? current_user.id
                        head :unauthorized
                    end
                end
            end
        end

        def compare_id(id, model)
          if model.to_s == "User"
            return id == current_user.id
          end

          # if user has comments then :Comment converted thusly should give us a list of the user's comments
          belongings = current_user.try(model.to_s.downcase.pluralize)
          unless belongings
            return false
          end

          return belongings.ids.include? id
        end
      end
    end
  end