module PermissionHelper
  extend ActiveSupport::Concern
  
  class_methods do
    def permission_list(user)
      user.permissions.map{ |permission| permission.model + ':' + permission.action }.join(',')
    end
  end
end