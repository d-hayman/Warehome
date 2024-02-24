class Subcategory < ApplicationRecord
  belongs_to :category

  has_and_belongs_to_many :items

  belongs_to :creator, class_name: "User", optional: true

  validates :name, presence: true
  validates :description, presence: true
end
