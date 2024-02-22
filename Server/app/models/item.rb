class Item < ApplicationRecord
    has_one_attached :image

    has_many :containments
    has_many :containers, through: :containments

    has_and_belongs_to_many :subcategories

    validates :description, presence: true
end
