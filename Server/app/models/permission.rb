class Permission < ApplicationRecord
    has_and_belongs_to_many :roles
    has_many :users, -> { distinct }, through: :roles
end
