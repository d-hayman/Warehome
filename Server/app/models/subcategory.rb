class Subcategory < ApplicationRecord
  belongs_to :category

  has_and_belongs_to_many :items

  validates :name, presence: true
  validates :description, presence: true
end
