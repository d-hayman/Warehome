class Category < ApplicationRecord
    has_many :subcategories, dependent: :destroy

    belongs_to :creator, class_name: "User", optional: true

    validates :name, presence: true
    validates :description, presence: true
end
