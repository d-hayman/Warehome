class UserSerializer
  include JSONAPI::Serializer

  include PermissionHelper

  attributes :id, :username
  
  attribute :permissions do |user| permission_list(user) end
end
