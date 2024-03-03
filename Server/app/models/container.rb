class Container < ApplicationRecord
  has_one_attached :image

  belongs_to :parent, class_name: 'Container', optional: true

  has_many :children, class_name: 'Container', foreign_key: :parent_id

  has_many :containments
  has_many :items, through: :containments
  has_many :checkouts, through: :containments

  belongs_to :creator, class_name: "User", optional: true

  validates :name, presence: true
  validates :description, presence: true

  scope :top_level, ->() do
    where('parent_id IS NULL')
  end

  scope :children_of, ->(parent) do
    where('parent_id = ?', parent)
  end
end
