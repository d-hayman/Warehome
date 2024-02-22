class Container < ApplicationRecord
  has_one_attached :image

  belongs_to :parent, class_name: 'Container', optional: true

  has_many :children, class_name: 'Container', foreign_key: :parent_id

  has_many :containments
  has_many :items, through: :containments

  validates :name, presence: true
  validates :description, presence: true
end
